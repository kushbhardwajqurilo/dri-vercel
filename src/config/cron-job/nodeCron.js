const cron = require("node-cron");
const DrisModel = require("../../models/DriUserModel");
const fcmTokenModel = require("../../models/fcmTokenModel");
const {
  sentNotificationToMultipleUsers,
} = require("../expo-push-notification/expoNotification");
const User = require("../../models/userModel");
const {
  insertManyNotification,
} = require("../../controllers/notificationController/notificationsController");

const cronJob = cron.schedule(
  "*/1 * * * *",
  async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pendingEmis = await DrisModel.find({
        status: "pending",
        reminderSent: { $ne: true },
      });

      if (pendingEmis.length === 0) {
        cronJob.stop();
        return;
      }

      const uniqueUserPhones = [
        ...new Set(pendingEmis.map((emi) => emi.phone)),
      ];

      for (let phone of uniqueUserPhones) {
        const user = await User.findOne({ phone });
        if (!user) continue;

        const userEmis = pendingEmis.filter((emi) => emi.phone === phone);
        let messages = [];
        let emisToUpdate = [];
        let userName = userEmis[0]?.name || "User";

        for (let emi of userEmis) {
          const dueDate = new Date(emi.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

          if (diffDays === 2) {
            messages.push(
              `⏰ EMI of ₹${
                emi.monthlyEmi
              } is due on ${dueDate.toDateString()} (2 days left)`
            );
            emisToUpdate.push(emi._id);
          } else if (diffDays < 0) {
            messages.push(
              `⚠️ EMI of ₹${
                emi.monthlyEmi
              } was due on ${dueDate.toDateString()} but not paid yet!`
            );
            emisToUpdate.push(emi._id);
          }
        }

        if (messages.length === 0) continue;

        const finalMessage = `Hello ${userName},\n${messages.join("\n")}`;

        const userTokensDocs = await fcmTokenModel.find({ userId: user._id });
        const userTokens = userTokensDocs.map((e) => e?.token).filter(Boolean);

        if (userTokens.length === 0) continue;

        // 🔔 Send push notification
        await sentNotificationToMultipleUsers(userTokens, finalMessage);

        // 📝 Insert notifications into DB
        await insertManyNotification(
          [user._id],
          "EMI Reminder",
          finalMessage,
          "emi_reminder"
        );

        // ✅ Update EMI reminders
        await DrisModel.updateMany(
          { _id: { $in: emisToUpdate } },
          { $set: { reminderSent: true } }
        );
      }
    } catch (error) {
      console.error("❌ Cron job error:", error);
    }
    cronJob.stop();
  },
  { scheduled: false }
);

module.exports = { cronJob };
