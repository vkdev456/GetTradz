import React from 'react';

function Signup() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Signup</h2>
        <form action="/signup" method="POST" className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input 
              name="username"
              id="username"
              type="text"
              className="form-control"
              required
            />
            <div className="valid-feedback">Looks Good!</div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              name="email"
              id="email"
              type="email"
              className="form-control"
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
