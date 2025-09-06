const mongoose = require("mongoose");
const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, "bank name require"],
    unique: true,
  },
  icon: {
    type: String,
    required: [true, "bank icon requrie"],
  },
});

module.exports = mongoose.model("bank", bankSchema);
