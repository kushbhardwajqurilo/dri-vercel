const FcmToken = require("../models/fcmTokenModel");
async function saveExpoToken(userId, token) {
  console.log("userId", userId);
  if (!token) {
    return;
  }

  const check = await FcmToken.findOne({ userId });

  if (!check) {
    const newToken = new FcmToken({ userId, token });
    await newToken.save();
    console.log("New userId with token created ✅");
  } else {
    if (check.token !== token) {
      check.token = token;
      await check.save();
      console.log("Token updated ✅");
    } else {
      console.log("Token already up-to-date ⚡");
    }
  }
}

module.exports = { saveExpoToken };
