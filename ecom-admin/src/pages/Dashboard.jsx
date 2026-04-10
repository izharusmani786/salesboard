import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import { ThemeContext } from "../context/ThemeContext";
import SEO from "../components/SEO";

// Colors from the Figma design
const COLORS = ["#3498db", "#f39c12", "#5dade2", "#ebedef"];


export default function Dashboard() {
  const { darkMode } = useContext(ThemeContext);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [dateRange, setDateRange] = useState({
    min: "",
    max: ""
  });

  const [dashboardData, setDashboardData] = useState(null);

  const dynamicHeight = Math.max((dashboardData?.charts?.salesByCity?.length || 0) * 40, 300);

  const fetchStates = async () => {
    try {
      const res = await api.get("/states");

      console.log(res.data);

      const data = res.data.data || [];

      setStates(data);

      if (data.length > 0) {
        setSelectedState((prev) => prev || data[0]);
      }

    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchDateRange = async (state) => {
    try {
      const res = await api.get(`/date-range/${state}`);

      const data = res.data.data;

      const minDate = new Date(data.dateRange.min)
        .toISOString()
        .split("T")[0];

      const maxDate = new Date(data.dateRange.max)
        .toISOString()
        .split("T")[0];

      setDateRange({
        min: minDate,
        max: maxDate
      });

    } catch (error) {
      console.error("Error fetching date range:", error);
    }
  };

  const fetchDashboard = async () => {
    try {
      if (!selectedState || !dateRange.min || !dateRange.max) return;

      const min = new Date(dateRange.min).getTime();
      const max = new Date(dateRange.max).getTime();

      const res = await api.get(
        `/dashboard?state=${encodeURIComponent(selectedState)}&minDate=${min}&maxDate=${max}`
      );

      setDashboardData(res.data);

    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };
  
  // Fetch states
  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchDateRange(selectedState);
    }
  }, [selectedState]);

  useEffect(() => {
    if (selectedState && dateRange.min && dateRange.max) {
      fetchDashboard();
    }
  }, [selectedState, dateRange]);

  return (
    <div className="container-fluid">

      <SEO 
        title="Dashboard | Sales Analytics"
        description="View sales insights, charts, and analytics by state, category, and products."
      />
      
      {/* Header + Filters */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className={`m-0 ${darkMode ? 'text-white' : ''}`}>Sales Overview</h4>
        <div className="d-flex gap-2">
          {/* State Dropdown */}
          <select
            className="form-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{ backgroundColor: darkMode ? "#2c3e50" : "#fff", color: darkMode ? "#ecf0f1" : "#333" }}
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {/* From Date */}
          <input type="date" className="form-control" value={dateRange.min} onChange={(e) => setDateRange(prev => ({ ...prev, min: e.target.value }))} style={{ backgroundColor: darkMode ? "#2c3e50" : "#fff", color: darkMode ? "#ecf0f1" : "#333" }}/>

          {/* To Date */}
          <input type="date" className="form-control" value={dateRange.max} onChange={(e) => setDateRange(prev => ({ ...prev, max: e.target.value }))} style={{ backgroundColor: darkMode ? "#2c3e50" : "#fff", color: darkMode ? "#ecf0f1" : "#333" }}/>

        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Sales", value: `$${dashboardData?.cards?.totalSales || 0}`, icon: "💰" },
          { label: "Quantity Sold", value: dashboardData?.cards?.totalQuantity || 0, icon: "📦" },
          { label: "Discount%", value: `${dashboardData?.cards?.totalDiscount || 0}%`, icon: "⚖️" },
          { label: "Profit", value: `$${dashboardData?.cards?.totalProfit || 0}`, icon: "🏦" }
        ].map((card, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card border-0 shadow-sm p-3 ${darkMode ? 'bg-dark text-white' : ''}`}>
              <div className="d-flex align-items-center gap-3">
                <div className="fs-2 text-primary opacity-50">{card.icon}</div>
                <div>
                  <small className={`fw-bold d-block ${darkMode ? 'text-white' : 'text-muted'}`}>{card.label}</small>
                  <h4 className="mb-0 fw-bold">{card.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

  
      {/* Charts Section */}
      <div className="row g-3 mb-4">
        {/* Sales by City - Horizontal Bar */}
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm p-3 h-100 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h6 className="fw-bold mb-3">Sales by City</h6>
            <div style={{ height: "300px", overflowY: "auto", overflowX: "hidden" }}>
              <ResponsiveContainer width="100%" height={dynamicHeight}>
                <BarChart 
                  layout="vertical" 
                  data={dashboardData?.charts?.salesByCity} 
                  margin={{ left: 30, right: 30 }}
                >
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="city" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={100} // Increased width for longer city names
                    tick={{
                      fill: darkMode ? "#ffffff" : "#000000",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#333" : "#fff",
                      border: "none",
                    }}
                    labelStyle={{ color: darkMode ? "#fff" : "#000" }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="#aed6f1" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sales by Products - Styled List */}
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm p-3 h-100 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h6 className="fw-bold mb-3">Sales by Products</h6>
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {/* Header */}
              <div className="d-flex justify-content-between px-2 mb-2 small fw-bold text-muted">
                <span>Product Name</span>
                <span>Sales in $</span>
              </div>

              {/* Rows */}
              {dashboardData?.charts?.salesByProduct?.map((item, i) => (
                <div 
                  key={i} 
                  className="d-flex align-items-center justify-content-between mb-2 p-2 rounded-1"
                  style={{ 
                    backgroundColor: "#e0f2f7", // The light teal background from the screenshot
                    fontSize: "0.85rem"
                  }}
                >
                  {/* Product Name - Left side */}
                  <div 
                    className="text-truncate pe-3" 
                    style={{ maxWidth: "75%", color: "#333" }}
                    title={item.product} // Shows full name on hover
                  >
                    {item.product}
                  </div>

                  {/* Sales Value - Right side with the darker blue highlight box */}
                  <div 
                    className="fw-bold text-end rounded-1 px-2"
                    style={{ 
                      backgroundColor: "#add8e6", // Slightly darker blue for the price area
                      minWidth: "80px",
                      color: "#2c3e50"
                    }}
                  >
                    ${item.sales}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="row g-3">
        {/* Category - Donut Chart */}
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm p-3 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h6 className="fw-bold mb-3">Sales by Category</h6>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dashboardData?.charts?.salesByCategory}
                  dataKey="sales"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                >
                  {dashboardData?.charts?.salesByCategory?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub Category - Bar/List Hybrid */}
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm p-3 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h6 className="fw-bold mb-3">Sales by Sub Category</h6>
            <div style={{ height: "200px", overflowY: "auto" }} className="px-2">
               {dashboardData?.charts?.salesBySubCategory?.map((item, i) => (
                 <div key={i} className="mb-2">
                    <div className="d-flex justify-content-between small">
                      <span>{item.subCategory}</span>
                      <span className="text-info fw-bold">${item.sales}</span>
                    </div>
                    <div className="progress" style={{height: "8px"}}>
                      <div className="progress-bar" style={{width: '70%', backgroundColor: '#aed6f1'}}></div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Segment - Donut Chart */}
        <div className="col-md-4">
          <div className={`card border-0 shadow-sm p-3 ${darkMode ? 'bg-dark text-white' : ''}`}>
            <h6 className="fw-bold mb-3">Sales by Segment</h6>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dashboardData?.charts?.salesBySegment}
                  dataKey="sales"
                  nameKey="segment"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {dashboardData?.charts?.salesBySegment?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}