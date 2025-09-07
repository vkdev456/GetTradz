import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css"; // add custom CSS

function Funds() {
  const [availableMargin, setAvailableMargin] = useState(0);
  const [usedMargin, setUsedMargin] = useState(0);
  const [availableCash, setAvailableCash] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFunds = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:3002/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const funds = res.data || {};
      setAvailableMargin(funds.availableMargin || 0);
      setUsedMargin(funds.usedMargin || 0);
      setAvailableCash(funds.availableCash || 0);
    } catch (err) {
      console.error("Error fetching funds:", err);
      setError("Failed to fetch funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const updateFunds = (funds) => {
    setAvailableMargin(funds.availableMargin || 0);
    setUsedMargin(funds.usedMargin || 0);
    setAvailableCash(funds.availableCash || 0);
  };

  const handleAddFunds = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:3002/funds/add",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateFunds(res.data.funds);
      setAmount("");
    } catch (err) {
      console.error("Error adding funds:", err);
      alert("Failed to add funds.");
    }
  };

  const handleWithdrawFunds = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    if (Number(amount) > availableMargin)
      return alert("Cannot withdraw more than available margin");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:3002/funds/withdraw",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.success) {
        alert(res.data.message || "Withdrawal failed");
      } else {
        updateFunds(res.data.funds);
      }
      setAmount("");
    } catch (err) {
      console.error("Error withdrawing funds:", err);
      alert("Failed to withdraw funds.");
    }
  };

  if (loading)
    return <p className="text-center mt-4">Loading funds...</p>;
  if (error)
    return <p className="text-center text-danger mt-4">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Funds Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card fund-card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Available Margin</h5>
              <h3>{availableMargin.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card fund-card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">Used Margin</h5>
              <h3>{usedMargin.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card fund-card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Available Cash</h5>
              <h3>{availableCash.toFixed(2)}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4 manage-funds-card">
        <h5 className="mb-3">Manage Funds</h5>
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button
            className="btn btn-success"
            onClick={handleAddFunds}
            disabled={!amount || Number(amount) <= 0}
          >
            Add
          </button>
          <button
            className="btn btn-danger"
            onClick={handleWithdrawFunds}
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              Number(amount) > availableMargin
            }
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default Funds;
