const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user missing"],
    ref: "user",
  },
  id: {
    type: String,
  },
  profile: {
    type: String,
    default: "blank.jpg",
  },
  image: {
    type: [String],
    required: [true, "At least one document is required"],
    default: [],
  },
  pdf: {
    type: [String], // store all PDFs URLs
    default: [],
  },
  name: {
    type: String,
    required: [true, "name required"],
  },
  lastname: {
    type: String,
  },
  status: {
    type: String,
    default: "pending",
  },
  phone: {
    type: String,
    required: [true, "phone number required"],
  },
  alernatePhone: {
    type: String,
    default: "0",
  },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  email: {
    type: String,
    required: [true, "email missing"],
    unique: true,
  },
  gender: {
    type: String,
    required: [true, "gender required"],
  },
  assign_advocate: {
    type: String,
    ref: "advocate",
  },
});

const KYCmodel = mongoose.model("kyc", kycSchema);
module.exports = KYCmodel;
