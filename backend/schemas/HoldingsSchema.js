const {Schema}=require("mongoose");

const HoldingsScehma=new Schema({
     name: String ,
     qty: Number,
     avg: Number,
     price: Number,
     net: String,
     day: String,

});

module.exports={HoldingsScehma};
