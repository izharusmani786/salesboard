import { NavLink } from "react-router-dom";

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  // Transition logic for a smooth slide effect
  const sidebarStyles = {
    width: isCollapsed ? "70px" : "250px",
    height: "100vh",
    position: "fixed",
    transition: "width 0.3s ease", // Smooth animation
    overflowX: "hidden"
  };

  const toggleCollapse = () => setIsCollapsed(prev => !prev);

  return (
    <div className="bg-dark text-white d-flex flex-column p-3" style={sidebarStyles}>
      
      {/* Header with Toggle Icon */}
      <div className="d-flex align-items-center mb-4">
        <button
          className="btn btn-dark text-white p-0 me-2"
          onClick={toggleCollapse}
          style={{ fontSize: "24px", border: "none" }}
        >
          {/* Pure HTML Hamburger Icon */}
          {isCollapsed ? ">" : "☰"} 
        </button>
        
        {/* Only show title if NOT collapsed */}
        {!isCollapsed && <h5 className="m-0 text-nowrap">Sales Dash</h5>}
      </div>

      <ul className="nav nav-pills flex-column gap-2">
        <SidebarLink to="/" icon="📊" label="Sales Overview" isCollapsed={isCollapsed} />
        <SidebarLink to="/stores" icon="🏪" label="Stores" isCollapsed={isCollapsed} />
        <SidebarLink to="/notifications" icon="🔔" label="Notifications" isCollapsed={isCollapsed} />
        <SidebarLink to="/settings" icon="⚙️" label="Settings" isCollapsed={isCollapsed} />
      </ul>
    </div>
  );
}

// Small helper component to keep the code clean
function SidebarLink({ to, icon, label, isCollapsed }) {
  return (
    <li className="nav-item">
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          `nav-link text-white d-flex align-items-center ${isActive ? "bg-secondary" : ""}`
        }
        style={{ paddingLeft: isCollapsed ? "10px" : "" }}
      >
        <span className="me-3">{icon}</span>
        {!isCollapsed && <span className="text-nowrap">{label}</span>}
      </NavLink>
    </li>
  );
}