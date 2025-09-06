const mongoose = require("mongoose");
const Counter = require("./counter");
const userSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    tyep: String,
  },
  gender: {
    type: String,
    default: "Other",
  },
  phone: {
    type: String,
    ref: "kyc",
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
  totalEmi: {
    type: Number,
    default: 0,
  },
  monthlyEmi: {
    type: String,
    default: 0,
  },
  emiPay: {
    type: Number,
    default: 0,
  },
  loanType: {
    type: String,
    default: "",
  },
  status: {
    type: "String",
    default: "Pending",
  },
  dueDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = `#${String(counter.seq).padStart(5, "0")}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const DrisModel = mongoose.model("DriUser", userSchema);
module.exports = DrisModel;
