const mongoose = require("mongoose");
const fcmTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "90d",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("fcmToken", fcmTokenSchema);
