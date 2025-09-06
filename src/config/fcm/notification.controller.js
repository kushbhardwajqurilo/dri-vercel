const fcmTokenModel = require("../../models/fcmTokenModel");
const { sendNotificationToDevice } = require("../../services/fcmService");

exports.sendKycApprovalNotification = async (userId) => {
  const userTokens = await fcmTokenModel.find({ userId });
  if (!userTokens.length) return false;

  const notification = {
    title: "Congratulation 🎉",
    body: "Your KYC Approved By Admin.",
  };

  for (let fcm of userTokens) {
    await sendNotificationToDevice(fcm.token, notification, {
      type: "success",
    });
  }

  return true;
};
