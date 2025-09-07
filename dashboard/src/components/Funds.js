import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Funds.css";

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
      setError("Please login.");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("https://gtbackend-izyf.onrender.com/funds", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const funds = res.data || {};
      setAvailableMargin(funds.availableMargin || 0);
      setUsedMargin(funds.usedMargin || 0);
      setAvailableCash(funds.availableCash || 0);
    } catch (err) {
      setError("Failed to fetch funds.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAddFunds = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://gtbackend-izyf.onrender.com/funds/add",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableMargin(res.data.funds.availableMargin);
      setUsedMargin(res.data.funds.usedMargin);
      setAvailableCash(res.data.funds.availableCash);
      setAmount("");
    } catch (err) {
      alert("Failed to add funds.");
    }
  };

  const handleWithdrawFunds = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    if (Number(amount) > availableMargin) return alert("Insufficient margin");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://gtbackend-izyf.onrender.com/funds/withdraw",
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAvailableMargin(res.data.funds.availableMargin);
      setUsedMargin(res.data.funds.usedMargin);
      setAvailableCash(res.data.funds.availableCash);
      setAmount("");
    } catch (err) {
      alert("Failed to withdraw funds.");
    }
  };

  if (loading) return <p className="center-text">Loading...</p>;
  if (error) return <p className="center-text error">{error}</p>;

  return (
    <div className="funds-container">
      <h2 className="center-text">Funds Dashboard</h2>

      <div className="funds-grid">
        <div className="fund-card">
          <h4>Available Margin</h4>
          <p>{availableMargin.toFixed(2)}</p>
        </div>
        <div className="fund-card">
          <h4>Used Margin</h4>
          <p>{usedMargin.toFixed(2)}</p>
        </div>
        <div className="fund-card">
          <h4>Available Cash</h4>
          <p>{availableCash.toFixed(2)}</p>
        </div>
      </div>

      <div className="manage-funds">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="buttons">
          <button onClick={handleAddFunds}>Add</button>
          <button onClick={handleWithdrawFunds}>Withdraw</button>
        </div>
      </div>
    </div>
  );
}

export default Funds;
