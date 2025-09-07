import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
  const [funds, setFunds] = useState(null); // start with null to detect loading
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login.");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3002/funds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFunds(res.data);
      } catch (err) {
        console.error("Error fetching funds:", err);
        setError("Failed to fetch funds. Please try again.");
      }
    };

    fetchFunds();
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!funds) return <p>Loading...</p>;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Funds</p>
        </span>
        <div className="data">
          <div className="first">
            <h3>{Number(funds.availableCash).toLocaleString()}</h3>
            <p>Available Balance</p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
