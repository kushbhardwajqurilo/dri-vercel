const {
  getUserNotifications,
  sendNotificationToAll,
  markAsRead,
  customeNotification,
  getCustomNotification,
} = require("../controllers/notificationController/notificationsController");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const notificationRouter = require("express").Router();

// notificationRouter.post()
notificationRouter.get("/all", UserAuthMiddleWare, getUserNotifications);
notificationRouter.patch("/:id", UserAuthMiddleWare, markAsRead);
notificationRouter.post("/", sendNotificationToAll);
notificationRouter.post("/custom-notification", customeNotification);
notificationRouter.get("/get-custom-notification", getCustomNotification);
module.exports = notificationRouter;
