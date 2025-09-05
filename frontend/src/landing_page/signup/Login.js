import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/login", {
        username,
        password,
      });

      if (res.data.success) {
        // Save JWT token 
        localStorage.setItem("token", res.data.token);

        // Redirect to dashboard
        window.location.href = "http://localhost:3001";
      } else {
        alert("Login failed, please check credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Error logging in: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
