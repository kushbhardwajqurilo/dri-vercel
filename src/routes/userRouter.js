const {
  sendNotificationToSingleUser,
} = require("../config/expo-push-notification/expoNotification");
const {
  userController,
  createUser,
  updateUser,
  sendOTP,
  verifyOTP,
  userSaving,
  getSavingByMonthYear,
  changePhoneNumber,
  getUserProfile,
  getAllSavingToUser,
} = require("../controllers/userControll");
// const limiter = require("../middlewares/rateLimitMiddleware");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const userRouter = require("express").Router();
userRouter.get("/", userController);
userRouter.get("/user-profile", UserAuthMiddleWare, getUserProfile);
userRouter.post("/", createUser);
userRouter.post("/login", sendOTP);
userRouter.put("/", updateUser);
userRouter.put("/change-phone", changePhoneNumber);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/user-savings", UserAuthMiddleWare, userSaving);
userRouter.get("/get-user", UserAuthMiddleWare, userController);
userRouter.get("/get-user-saving", UserAuthMiddleWare, getSavingByMonthYear);
userRouter.get("/get-savings", UserAuthMiddleWare, getAllSavingToUser);
userRouter.post("/notification", sendNotificationToSingleUser);

module.exports = userRouter;
