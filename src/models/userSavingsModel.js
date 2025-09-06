const mongoose = require("mongoose");
const userSavingSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user required"],
    ref: "user",
  },
  month: {
    type: String,
    required: [true, "month required"],
  },
  year: {
    type: Number,
    required: [true, "year required"],
  },
  amount: {
    type: Number,
    required: [true, "amount required"],
    default: 0,
  },
  totalSaving: {
    type: Number,
  },
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "bank required"],
    ref: "bank",
  },
});

module.exports = mongoose.model("useSaving", userSavingSchema);
