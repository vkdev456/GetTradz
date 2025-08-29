require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session=require("express-session");
const cors = require("cors");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./model/UsersModel");

const HoldingsModel = require("./model/HoldingsModel");
const OrdersModel  = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(express.json());
app.use(session({
  secret: "secret-key",
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
  }
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser",async(req,res)=>{
  let fakeUser=new User({
    username:"user1",
    email:"demo@gmail.com"   
  });
  let rps=await User.register(fakeUser,"helloworld");
  res.send(rps);
})

app.post("/signup", async (req,res)=>{
     res.send("form");
});














































app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allOrders",async(req,res)=>{
   let allOrders= await OrdersModel.find({});
   res.json(allOrders);
});

app.post("/newOrder", async (req, res) => {
  try {
    // Saving new order 
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
      //Calculate average price
      let totalQty = existingHolding.qty + req.body.qty;
      let newAvg =
        (existingHolding.avg * existingHolding.qty +
          req.body.price * req.body.qty) /
        totalQty;

      // Update holding
      existingHolding.qty = totalQty;
      existingHolding.avg = newAvg;
      existingHolding.price = req.body.price; // latest price
      existingHolding.day = new Date().toISOString().slice(0, 10);
      await existingHolding.save();
    } else {

      // Create new holding 
      // this where problem solving helps
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

// sell holdings with qty
app.post("/sellholdings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sellQty = req.body.qty; // quantity to sell

    if (!sellQty || sellQty <= 0) {
      return res.status(400).send("Invalid quantity to sell.");
    }

    // find holding
    let holding = await HoldingsModel.findById(id);

    if (!holding) {
      return res.status(404).send("Holding not found.");
    }

    if (sellQty > holding.qty) {
      return res.status(400).send("Not enough quantity to sell.");
    }

    //sell order in Orders History
    let sellOrder = new OrdersModel({
      name: holding.name,
      qty: sellQty,
      price: holding.price,
      mode: "SELL",
    });
    await sellOrder.save();

    // reduce qty from holding
    holding.qty -= sellQty;

    //remove holdings if zero from DB
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