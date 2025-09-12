// import DrisModel from "../../models/DriUserModel";
// import fcmTokenModel from "../../models/fcmTokenModel";
// import User from "../../models/userModel";
// import { sentNotificationToMultipleUsers } from "../expo-push-notification/expoNotification";
// import { insertManyNotification } from "../../controllers/notificationController/notificationsController";

// export default async function handler(req, res) {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const pendingEmis = await DrisModel.find({
//       status: "pending",
//       reminderSent: { $ne: true },
//     });

//     if (pendingEmis.length === 0) {
//       return res.status(200).json({ message: "No pending EMIs" });
//     }

//     const uniqueUserPhones = [...new Set(pendingEmis.map((emi) => emi.phone))];

//     for (let phone of uniqueUserPhones) {
//       const user = await User.findOne({ phone });
//       if (!user) continue;

//       const userEmis = pendingEmis.filter((emi) => emi.phone === phone);
//       let messages = [];
//       let emisToUpdate = [];
//       let userName = userEmis[0]?.name || "User";

//       for (let emi of userEmis) {
//         const dueDate = new Date(emi.dueDate);
//         dueDate.setHours(0, 0, 0, 0);
//         const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

//         if (diffDays === 2) {
//           messages.push(
//             `⏰ EMI of ₹${
//               emi.monthlyEmi
//             } is due on ${dueDate.toDateString()} (2 days left)`
//           );
//           emisToUpdate.push(emi._id);
//         } else if (diffDays < 0) {
//           messages.push(
//             `⚠️ EMI of ₹${
//               emi.monthlyEmi
//             } was due on ${dueDate.toDateString()} but not paid yet!`
//           );
//           emisToUpdate.push(emi._id);
//         }
//       }

//       if (messages.length === 0) continue;

//       const finalMessage = `Hello ${userName},\n${messages.join("\n")}`;

//       const userTokensDocs = await fcmTokenModel.find({ userId: user._id });
//       const userTokens = userTokensDocs.map((e) => e?.token).filter(Boolean);

//       if (userTokens.length === 0) continue;

//       await sentNotificationToMultipleUsers(userTokens, finalMessage);

//       await insertManyNotification(
//         [user._id],
//         "EMI Reminder",
//         finalMessage,
//         "emi_reminder"
//       );

//       await DrisModel.updateMany(
//         { _id: { $in: emisToUpdate } },
//         { $set: { reminderSent: true } }
//       );
//     }

//     res.status(200).json({ success: true, message: "EMI reminders processed" });
//   } catch (error) {
//     console.error("❌ EMI Reminder job error:", error);
//     res.status(500).json({ error: "Cron job failed" });
//   }
// }
