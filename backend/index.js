require("dotenv").config();

const express=require("express");
const mongoose=require("mongoose");
const app=express();

const port=process.env.port||3002;
const url=process.env.MONGO_URL;

app.listen(port,()=>{
    console.log("App Started");
    mongoose.connect(url);
    console.log("Connected to DB");
})





