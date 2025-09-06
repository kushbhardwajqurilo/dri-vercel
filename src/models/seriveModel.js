const mongoose = require("mongoose");
const serviceSchema = mongoose.Schema({
  adminId: {
    type: String,
    required: [true, "admin is required"],
  },
  fees: {
    type: Number,
    required: [true, "service fees is required"],
  },
  duedate: {
    type: String,
    required: [true, "duedate is required"],
  },
});

const ServiceFeesModel = new mongoose.model("Servicefee", serviceSchema);
module.exports = ServiceFeesModel;
