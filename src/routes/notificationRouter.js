const {
  getUserNotifications,
  sendNotificationToAll,
  markAsRead,
} = require("../controllers/notificationController/notificationsController");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const notificationRouter = require("express").Router();

// notificationRouter.post()
notificationRouter.get("/all", UserAuthMiddleWare, getUserNotifications);
notificationRouter.patch("/:id", UserAuthMiddleWare, markAsRead);
notificationRouter.post("/", sendNotificationToAll);
// notificationRouter.delete()
module.exports = notificationRouter;
