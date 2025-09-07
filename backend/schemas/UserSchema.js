const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, 
  funds: {
  availableMargin: { type: Number, default: 0 },  
  usedMargin: { type: Number, default: 0 },       
  availableCash: { type: Number, default: 0 },
  payin: { type: Number, default: 0 },            
  payout: { type: Number, default: 0 },          
  }
});

module.exports = UserSchema;
