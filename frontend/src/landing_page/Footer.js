import React from "react";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px 0",
        marginTop: "auto",    // makes footer stick to bottom
        borderTop: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <img src="media/images/logo.svg" style={{ width: "120px" }} alt="Logo" />
        <p style={{ marginTop: "10px", color: "#6c757d" }}>
          © {new Date().getFullYear()} GetTradz. All rights reserved.
        </p>
    
      </div>
    </footer>
  );
}

export default Footer;
