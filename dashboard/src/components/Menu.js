import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState("Guest");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "Guest");
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, []);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");

      await fetch("https://gtbackend-izyf.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsProfileDropdownOpen(false);
      window.location.href = "https://gettradz.vercel.app";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "https://gettradz.vercel.app";
    }
  };

  return (
    <div
      className="menu-container"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#f9f9f9",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Left side - Menus */}
      <div className="menus">
        <ul style={{ display: "flex", gap: "20px", listStyle: "none", margin: 0, padding: 0 }}>
          <li>
            <Link to="/" onClick={() => handleMenuClick(0)} style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 0 ? "menu selected" : "menu"}>Dashboard</p>
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={() => handleMenuClick(1)} style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 1 ? "menu selected" : "menu"}>Orders</p>
            </Link>
          </li>
          <li>
            <Link to="/holdings" onClick={() => handleMenuClick(2)} style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 2 ? "menu selected" : "menu"}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link to="/funds" onClick={() => handleMenuClick(3)} style={{ textDecoration: "none" }}>
              <p className={selectedMenu === 3 ? "menu selected" : "menu"}>Funds</p>
            </Link>
          </li>
        </ul>
      </div>

      {/* Right side - Profile */}
      <div
        className="profile"
        onClick={handleProfileClick}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "8px",
          position: "relative",
        }}
      >
        <div
          className="avatar"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            background: "#667eea",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {username.charAt(0).toUpperCase()}
        </div>
        <p className="username" style={{ margin: 0 }}>
          {username}
        </p>
        <span style={{ fontWeight: "bold" }}>▾</span>

        {/* Dropdown */}
        {isProfileDropdownOpen && (
          <div
            className="profile-dropdown"
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              background: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              marginTop: "8px",
              minWidth: "120px",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
