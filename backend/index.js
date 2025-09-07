require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import Models
const UserModel = require("./model/UsersModel");
const HoldingsModel = require("./model/HoldingsModel");
const OrdersModel = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123";

const app = express();

// ----------------- Middleware -----------------
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- JWT Auth Middleware -----------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded; // attach user info { id, username }
    next();
  });
}

// ----------------- Routes -----------------

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with default funds (no openingBalance)
    const newUser = new UserModel({
      username,
      email,
      passwordHash: hashedPassword,
      funds: {
        availableMargin: 0,
        usedMargin: 0,
        availableCash: 0,
        payin: 0,
        payout: 0,
      },
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, message: "User registered successfully", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

// Get Holdings
app.get("/allHoldings", authMiddleware, async (req, res) => {
  const holdings = await HoldingsModel.find({ userId: req.user.id });
  res.json(holdings);
});

// Get Orders
app.get("/allOrders", authMiddleware, async (req, res) => {
  const orders = await OrdersModel.find({ userId: req.user.id });
  res.json(orders);
});

// Place New Order
app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, qty, price, mode } = req.body;

    let user = await UserModel.findById(userId);
    if (!user) return res.status(404).send("User not found.");

    if (mode === "BUY") {
      const totalCost = qty * price;
      if (user.funds.availableCash < totalCost) {
        return res.status(400).send("Insufficient funds to complete this order.");
      }
      user.funds.availableCash -= totalCost;
      user.funds.usedMargin += totalCost;
      await user.save();
    }

    const newOrder = new OrdersModel({ userId, name, qty, price, mode });
    await newOrder.save();

    if (mode === "BUY") {
      let existingHolding = await HoldingsModel.findOne({ userId, name });
      if (existingHolding) {
        let totalQty = existingHolding.qty + qty;
        let newAvg = (existingHolding.avg * existingHolding.qty + price * qty) / totalQty;
        existingHolding.qty = totalQty;
        existingHolding.avg = newAvg;
        existingHolding.price = price;
        existingHolding.day = new Date().toISOString().slice(0, 10);
        await existingHolding.save();
      } else {
        const newHolding = new HoldingsModel({
          userId,
          name,
          qty,
          avg: price,
          price,
          net: "0",
          day: new Date().toISOString().slice(0, 10),
        });
        await newHolding.save();
      }
    }

    res.send("Order placed successfully, funds updated.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save order and update funds.");
  }
});

// Sell Holdings
app.post("/sellholdings/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const sellQty = req.body.qty;
    const userId = req.user.id;

    if (!sellQty || sellQty <= 0) return res.status(400).send("Invalid quantity to sell.");

    let holding = await HoldingsModel.findOne({ _id: id, userId });
    if (!holding) return res.status(404).send("Holding not found.");
    if (sellQty > holding.qty) return res.status(400).send("Not enough quantity to sell.");

    const sellValue = holding.price * sellQty;

    let user = await UserModel.findById(userId);
    user.funds.availableCash += sellValue;
    user.funds.usedMargin -= sellValue;
    await user.save();

    const sellOrder = new OrdersModel({
      userId,
      name: holding.name,
      qty: sellQty,
      price: holding.price,
      mode: "SELL",
    });
    await sellOrder.save();

    holding.qty -= sellQty;
    if (holding.qty === 0) await HoldingsModel.findByIdAndDelete(id);
    else await holding.save();

    res.send("Sold successfully! Funds updated.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to sell holding.");
  }
});

// Get Funds
app.get("/funds", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json({
      availableMargin: user.funds.availableMargin,
      usedMargin: user.funds.usedMargin,
      availableCash: user.funds.availableCash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching funds.");
  }
});

// Add Funds
// Add Funds
app.post("/funds/add", authMiddleware, async (req, res) => {
  try {
    let { amount } = req.body;
    amount = Number(amount);

    if (!amount || amount <= 0)
      return res.status(400).json({ success: false, message: "Invalid amount" });

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.funds.availableMargin += amount;
    user.funds.availableCash += amount;

    await user.save();

    res.json({ success: true, funds: user.funds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding funds." });
  }
});


// Withdraw Funds
app.post("/funds/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (user.funds.availableMargin < amount) {
      return res.status(400).json({ success: false, message: "Insufficient funds" });
    }

    user.funds.availableMargin -= amount;
    user.funds.availableCash -= amount;
    await user.save();
    res.json({ success: true, funds: user.funds });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error withdrawing funds." });
  }
});

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB connection failed:", err));
