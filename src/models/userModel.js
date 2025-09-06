const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  phone: { type: String },
  aternatePhone: { type: String, default: "" },
  otp: { type: Number, default: 0 },
  otpExpire: { type: Date, default: "" },
});
const User = new mongoose.model("user", userSchema);
module.exports = User;
