require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const app=express();

const bodyparser=require('body-parser');
const cors=require('cors');
const cron = require("node-cron");


const PositionsModel=require('./model/PositionsModel.js');
const HoldingsModel=require('./model/HoldingsModel.js');
const OrdersModel=require("./model/OrdersModel.js");


const port=process.env.PORT||3002;
const url=process.env.MONGO_URL;

app.use(cors());
app.use(bodyparser.json());


app.get("/allHoldings", async (req, res) => {

    let allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  
});

app.get("/allPositions", async (req, res) => {

    let allPositions = await PositionsModel.find({});
    res.json(allPositions);
  
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Save order in Orders collection
    const newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
    });
    await newOrder.save();

    // Update Holdings
    if (mode === "BUY") {
      // Check if stock already exists in holdings
      let existingHolding = await HoldingsModel.findOne({ name });

      if (existingHolding) {
        // Update qty and avg cost
        const totalQty = existingHolding.qty + qty;
        const newAvg =
          (existingHolding.avg * existingHolding.qty + price * qty) / totalQty;

        existingHolding.qty = totalQty;
        existingHolding.avg = newAvg;
        existingHolding.price = price; // latest LTP
        await existingHolding.save();
      } else {
        // Create new holding
        const newHolding = new HoldingsModel({
          name,
          qty,
          avg: price,
          price,
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      // Decrease holding
      let existingHolding = await HoldingsModel.findOne({ name });

      if (existingHolding) {
        existingHolding.qty -= qty;

        if (existingHolding.qty <= 0) {
          await HoldingsModel.findByIdAndDelete(existingHolding._id);
        } else {
          await existingHolding.save();
        }
      }
    }

    res.json({ message: "Order placed and holdings updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing order", error });
  }
});


app.get("/orders",async(req,res)=>{
       let orders=await OrdersModel.find({});
       res.json(orders);
})

app.delete("/holdings/:id", async (req, res) => {
  try {
    const deletedPosition = await HoldingsModel.findByIdAndDelete(req.params.id);

    if (!deletedPosition) {
      return res.status(404).json({ message: "Position not found" });
    }

    res.json({ message: "Position sold successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting position", error });
  }
});


cron.schedule("0 0 * * *", async () => {
  try {
    await OrdersModel.deleteMany({});
    console.log("All orders deleted at midnight");
  } catch (error) {
    console.error("Error deleting orders:", error);
  }
});


mongoose.connect(url)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("DB connection failed:", err));
 