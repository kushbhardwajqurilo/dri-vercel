const {
  sendToDevice,
  sendToTopic,
  sendMultiCast,
} = require("../controllers/fcm_controller/fcm.controller");

const fcmRouter = require("express").Router();

fcmRouter.post("/device", sendToDevice);
fcmRouter.post("/topic", sendToTopic);
fcmRouter.post("/multicast", sendMultiCast);
module.exports = fcmRouter;
