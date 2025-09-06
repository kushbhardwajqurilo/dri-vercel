const admin = require("firebase-admin");

if (
  !process.env.fcm_projectId ||
  !process.env.fcm_clientEmail ||
  !process.env.fcm_privateKey
) {
  throw new Error("missing fireabse service account credentials");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.fcm_projectId,
      clientEmail: process.env.fcm_clientEmail,
      privateKey: process.env.fcm_privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

module.exports = admin;
