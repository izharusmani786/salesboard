import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function MainLayout({ children }) {
  // Move the state here so both Sidebar and the content div can see it
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  // Sync with window size (Mobile optimization)
  useEffect(() => {
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Pass state and setter to Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Adjust Topbar if it's also fixed, or leave as is if it's relative */}
      <Topbar isCollapsed={isCollapsed} />

      <div
        style={{
          // Dynamic margin based on sidebar state
          marginLeft: isCollapsed ? "70px" : "250px", 
          padding: "20px",
          backgroundColor: darkMode ? "#2c3e50" : "#f5f6fa",
          minHeight: "100vh",
          // Add transition so it slides smoothly with the sidebar
          transition: "margin-left 0.3s ease-in-out", 
          width: "auto"
        }}
      >
        {children}
      </div>
    </div>
  );
}