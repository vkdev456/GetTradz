require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const UserModel = require("./model/UsersModel");
const HoldingsModel = require("./model/HoldingsModel");
const OrdersModel = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret123"; 

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], 
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------Middleware -----------------

//     JWT 
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    req.user = decoded; // attach user info
    next();
  });
}

// Signup - JWT
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

    const newUser = new UserModel({
      username,
      email,
      passwordHash: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating user" });
  }
});



// login -> jwt
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});



app.get("/allHoldings", authMiddleware, async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allOrders", authMiddleware, async (req, res) => {
  let allOrders = await OrdersModel.find({});
  res.json(allOrders);
});

app.post("/newOrder", authMiddleware, async (req, res) => {
  try {
    // Save new order
    let newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });
    await newOrder.save();

    // If holding already exists
    let existingHolding = await HoldingsModel.findOne({ name: req.body.name });

    if (existingHolding) {
      // Calculate average price
      let totalQty = existingHolding.qty + req.body.qty;
      let newAvg =
        (existingHolding.avg * existingHolding.qty +
          req.body.price * req.body.qty) /
        totalQty;

      existingHolding.qty = totalQty;
      existingHolding.avg = newAvg;
      existingHolding.price = req.body.price; // latest price
      existingHolding.day = new Date().toISOString().slice(0, 10);
      await existingHolding.save();
    } else {
      // Create new holding
      let newHolding = new HoldingsModel({
        name: req.body.name,
        qty: req.body.qty,
        avg: req.body.price,
        price: req.body.price,
        net: "0",
        day: new Date().toISOString().slice(0, 10),
      });
      await newHolding.save();
    }

    res.send("Order and Holding updated/saved!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save order and holding.");
  }
});


// sell 
app.post("/sellholdings/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const sellQty = req.body.qty;

    if (!sellQty || sellQty <= 0) {
      return res.status(400).send("Invalid quantity to sell.");
    }

    let holding = await HoldingsModel.findById(id);
    if (!holding) {
      return res.status(404).send("Holding not found.");
    }

    if (sellQty > holding.qty) {
      return res.status(400).send("Not enough quantity to sell.");
    }

    // record sell order
    let sellOrder = new OrdersModel({
      name: holding.name,
      qty: sellQty,
      price: holding.price,
      mode: "SELL",
    });
    await sellOrder.save();

    // reduce qty from holding
    holding.qty -= sellQty;

    if (holding.qty === 0) {
      await HoldingsModel.findByIdAndDelete(id);
    } else {
      await holding.save();
    }

    res.send("Sold successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to sell holding.");
  }
});



mongoose.connect(uri)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB connection failed:", err));