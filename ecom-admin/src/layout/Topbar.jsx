import { useState, useContext } from "react";
import { Moon, Settings, LogOut, User } from "lucide-react"; // Optional: icons make it look much better
import { ThemeContext } from "../context/ThemeContext";

export default function Topbar({ isCollapsed }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      className="d-flex justify-content-end align-items-center px-4"
      style={{
        height: "60px",
        backgroundColor: "#0c6470",
        color: "#fff",
        marginLeft: isCollapsed ? "70px" : "250px",
        transition: "margin-left 0.3s ease-in-out",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="position-relative">
        {/* Profile Trigger */}
        <div 
          className="d-flex align-items-center gap-2" 
          style={{ cursor: "pointer" }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="small fw-light">Hello User</span>
          <img
            src="https://i.pravatar.cc/35"
            alt="user"
            className="rounded-circle border border-2 border-white"
          />
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Transparent overlay to close dropdown when clicking outside */}
            <div 
              className="position-fixed top-0 start-0 w-100 h-100" 
              onClick={() => setShowDropdown(false)}
              style={{ zIndex: -1 }}
            />
            
            <div 
              className="card border-0 shadow position-absolute end-0 mt-2 py-2"
              style={{ width: "180px", color: "#333", zIndex: 1001 }}
            >
              <button onClick={toggleTheme} className="btn btn-light w-100 text-start rounded-0 px-3 py-2 small d-flex align-items-center gap-2">
                <Moon size={16} /> Dark Mode
              </button>
              <button className="btn btn-light w-100 text-start rounded-0 px-3 py-2 small d-flex align-items-center gap-2">
                <Settings size={16} /> Settings
              </button>
              <hr className="my-1 opacity-10" />
              <button className="btn btn-light w-100 text-start rounded-0 px-3 py-2 small text-danger d-flex align-items-center gap-2">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}