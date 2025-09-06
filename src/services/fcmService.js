const admin = require("../config/fcm/fcmConfig");

// send a notification to a single device token
async function sendNotificationToDevice(token, notification, data = {}) {
  if (!token) throw new Error("token required");

  const message = {
    token,
    notification,
    data,
  };
  return admin.messaging().send(message);
}

async function sendNotificationToTopic(topic, notification, data = {}) {
  if (!topic) throw new Error("topic required");

  const message = {
    topic,
    notification,
    data,
  };
  return admin.messaging().send(message);
}

//  send multicase to many tokens

async function sendMultiCast(token = [], notification, data = {}) {
  if (!Array.isArray(token) || token.length === 0)
    throw new Error("tokens are requried");
  const message = {
    notification,
    data,
  };
  return admin.messaging().sendMultiCast({ token, ...message });
}

module.exports = {
  sendNotificationToDevice,
  sendNotificationToTopic,
  sendMultiCast,
};
