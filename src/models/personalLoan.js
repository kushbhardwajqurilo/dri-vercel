const mongoose = require("mongoose");
const personalLoanSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  phone: {
    type: Number,
    required: [true, "phone number required"],
  },
  principleAmount: {
    type: Number,
    required: true,
  },
  estimatedSettlement: {
    type: Number,
    required: true,
  },
  saving: {
    type: Number,
    required: true,
  },
  loanType: {
    type: String,
    required: true,
  },
  bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bank",
  },
});
const personalLoanModel = new mongoose.model(
  "personalloans",
  personalLoanSchema
);
module.exports = personalLoanModel;
