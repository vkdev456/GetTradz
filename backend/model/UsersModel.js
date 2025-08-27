const mongoose = require("mongoose");
const UserSchema = require("../schemas/UserSchema");
const passportLocalMongoose = require("passport-local-mongoose"); 


UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
