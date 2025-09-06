const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String, // . "kyc_approved", "payment_success", "login_alert"
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
