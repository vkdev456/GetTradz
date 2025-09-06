import React, { useEffect, useState } from "react";
import axios from "axios";

const Summary = () => {
  const [funds, setFunds] = useState(0);

  useEffect(() => {
    const fetchFunds = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:3002/funds", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFunds(res.data.funds);
      } catch (err) {
        console.error("Error fetching funds:", err);
      }
    };

    fetchFunds();
  }, []);

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
            <h3>{funds.toLocaleString()}</h3>
            <p>Available Balance</p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
