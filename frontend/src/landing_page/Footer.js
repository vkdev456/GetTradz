import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#f9f9f9", padding: "20px 0" }}>
      <div className="container border-top pt-3 text-center">
        <img src="media/images/logo.svg" style={{ width: "120px" }} alt="Logo" />
        <p className="mt-2 text-muted">
          © {new Date().getFullYear()} GetTradz. All rights reserved.
        </p>

        <div className="mt-3">
          <a href="/support">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
