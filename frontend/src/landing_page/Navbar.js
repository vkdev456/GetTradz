import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
    <div className="container p-2">
      <Link className="navbar-brand" to="/">
          <img
              src="media/images/logo.svg"
              style={{ width: "15%" }}  
              alt="Logo"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-lg-0"> {}
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/login">
                login
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/signup">
                Signup
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
