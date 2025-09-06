const mongoose = require("mongoose");
const EmiSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      ref: "DriUser",
    },
    credit_Cards: {
      type: [String],
      default: [],
    },
    credit_Amount: {
      type: [String],
      default: [],
    },
    CreditTotal: {
      type: String,
    },
    personal_Loan: {
      type: [String],
      default: [],
    },
    PL_Amount: {
      type: [String],
      default: [],
    },
    PL_Total: {
      type: String,
      default: "",
    },
    Service_Fees: {
      type: String,
      default: "",
    },
    Service_Advance_Total: {
      type: String,
      default: "",
    },
    Final_Settlement: {
      type: String,
      default: "",
    },
    Settlement_Percent: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const EmiModel = new mongoose.model("emisettlement", EmiSchema);
module.exports = EmiModel;
