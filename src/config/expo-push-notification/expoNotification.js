const { Expo } = require("expo-server-sdk");
let expo = new Expo();

// send notificatio to sigele user..
// async function sendNotificationToSingleUser(req, res) {
//   const { token, message, title } = req.body;
//   if (!Expo.isExpoPushToken(req.body.token)) {
//     console.log(`invalid Expo push token: ${token}`);
//     return JSON.stringify({
//       success: false,
//       message: "user expo token not valid",
//     });
//   }
//   let messages = [
//     {
//       to: token,
//       sound: "default",
//       title: title,
//       body: message,
//       data: { extra: "some data" },
//     },
//   ];
//   try {
//     let receipts = await expo.sendPushNotificationsAsync(messages);
//     // console.log("single user notification send", receipts);
//     if (receipts.staus == "ok") {
//       return res.json({ message: "notification send" });
//     }
//   } catch (error) {
//     return { success: false, message: error.message, error };
//   }
// }

//  send notification to multiple users
async function sentNotificationToMultipleUsers(tokens, message) {
  let messages = [];
  for (let token of tokens) {
    if (!Expo.isExpoPushToken(token)) {
      return JSON.stringify({
        success: false,
        message: "Expo Token Not Valid",
      });
    }
    messages.push({
      to: token,
      sound: "default",
      body: message,
      data: { extra: "some data" },
    });
  }
  let receiptAll = [];
  try {
    let parts = expo.chunkPushNotifications(messages);
    for (let part of parts) {
      let receipt = await expo.sendPushNotificationsAsync(part);
      receiptAll.push(...receipt);
    }
    return JSON.stringify({ success: true, message: "notifications send.." });
  } catch (error) {
    return JSON.stringify({ success: false, message: error.message, error });
  }
}

async function sendNotificationToSingleUser(token, message, title, type) {
  if (!Expo.isExpoPushToken(token)) {
    // console.log(`invalid Expo push token: ${token}`);
    return JSON.stringify({
      success: false,
      message: "user expo token not valid",
    });
  }
  let messages = [
    {
      to: token,
      sound: "default",
      title: title,
      body: message,
      data: {
        image: `https://res.cloudinary.com/dvlqwoxvj/image/upload/v1756900537/favicon_ybguu8.png`,
      },
      type: type,
    },
  ];
  try {
    let receipts = await expo.sendPushNotificationsAsync(messages);
    // console.log("single user notification send", receipts);
    if (receipts.staus == "ok") {
      return res.json({ message: "notification send" });
    }
  } catch (error) {
    return { success: false, message: error.message, error };
  }
}

module.exports = {
  sendNotificationToSingleUser,
  sentNotificationToMultipleUsers,
};
