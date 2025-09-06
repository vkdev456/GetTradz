import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3002/signup", form);

      if (res.data.success) {
        alert("Signup successful! Please login.");
        // Redirect to login page
        window.location.href = "http://localhost:3000/login";
      }else {
        alert("Signup failed: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              name="username"
              id="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              name="email"
              id="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              name="password"
              id="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-success w-100">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
