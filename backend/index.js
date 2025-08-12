require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const app=express();

const bodyparser=require('body-parser');
const cors=require('cors');


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

app.post("/newOrder",async(req,res)=>{

    let newOrder=new OrdersModel({
          name: req.body.name,
          qty:req.body.price,
          price: req.body.price,
          mode: req.body.mode,
    });

    newOrder.save();
    res.send('Order saved');

});

mongoose.connect(url)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("DB connection failed:", err));
 