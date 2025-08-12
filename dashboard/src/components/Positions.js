import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3002/allPositions").then((res) => {
      setAllPositions(res.data); // Store fetched positions
    });
  }, []);

  const handleSell = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/positions/${id}`);
      setAllPositions(allPositions.filter((pos) => pos._id !== id));
    } catch (err) {
      console.error("Error selling position:", err);
    }
  };

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>Current Value</th>
              <th>P&L</th>
              <th>Chg.</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock) => {
              const curValue = stock.price * stock.qty; // Current market value
              const pl = curValue - stock.avg * stock.qty; // Profit/Loss
              const isProfit = pl >= 0.0;
              const profClass = isProfit ? "text-success" : "text-danger";
              const dayClass = stock.isLoss ? "text-danger" : "text-success";

              return (
                <tr key={stock._id}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{pl.toFixed(2)}</td>
                  <td className={dayClass}>{stock.day}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleSell(stock._id)}
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
