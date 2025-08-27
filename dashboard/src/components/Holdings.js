import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import "./Holdings.css";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    fetchHoldings();
  }, []);

 const fetchHoldings = () => {
  axios
    .get("http://localhost:3002/allHoldings")
    .then((res) => {
      setAllHoldings(res.data);
    })
    .catch((err) => {
      console.error("Error fetching holdings:", err);
    });
};


  const handleSell = async (id, maxQty) => {
    const qtyToSell = prompt(
      `Enter quantity to sell (Available: ${maxQty}):`,
      "1"
    );

    if (!qtyToSell || isNaN(qtyToSell) || qtyToSell <= 0) {
      alert("Invalid quantity.");
      return;
    }

    try {
      await axios.post(`http://localhost:3002/sellholdings/${id}`, {
        qty: parseInt(qtyToSell, 10),
      });
      // Refresh holdings after selling
      fetchHoldings();
    } catch (err) {
      console.error("Error selling stock:", err);
      alert("Failed to sell stock.");
    }
  };

  const labels = allHoldings.map((stock) => stock.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";

              return (
                <tr key={stock._id}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{(stock.avg ?? 0).toFixed(2)}</td>
                  <td>{(stock.price ?? 0).toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="action-btn sell-btn"
                      onClick={() => handleSell(stock._id, stock.qty)}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
