require("dotenv").config();


const express=require("express");
const mongoose=require("mongoose");
const app=express();


const PositionsModel=require('./model/PositionsModel.js');


const port=process.env.PORT||3002;
const url=process.env.MONGO_URL;


app.use('/addPositions',async(req,res)=>{
    let tempPositions= [
       {
      product: "CNC",
      name: "EVEREADY",
      qty: 2,
      avg: 316.27,
      price: 312.35,
      net: "+0.58%",
      day: "-1.24%",
      isLoss: true,
    },
    {
      product: "CNC",
      name: "JUBLFOOD",
      qty: 1,
      avg: 3124.75,
      price: 3082.65,
      net: "+10.04%",
      day: "-1.35%",
      isLoss: true,
    },
 
  ];


    tempPositions.forEach((item)=>{
        let newPositions= new PositionsModel({
            product: item.product,
          name: item.name,
          qty: item.qty,
          avg: item.avg,
          price: item.price,
          net: item.net,
          day: item.day,
          isLoss: item.isLoss,
        })
        newPositions.save();
    })
    res.send('done');
})


mongoose.connect(url)
  .then(() => {
    console.log("Connected to DB");
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch(err => console.error("DB connection failed:", err));