const {
  SubscriptionsController,
  getUsersSubscriptionToUser,
  getUsersSubscriptionToAdmin,
  deleteSubscription,
  updateSubscription,
} = require("../controllers/admin/monthlySubsciption");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const subscriptionRouter = require("express").Router();
subscriptionRouter.post(
  "/add-subscription",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  SubscriptionsController
);
subscriptionRouter.get("/get-substouser", getUsersSubscriptionToUser);
subscriptionRouter.get(
  "/get-substoadmin",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  getUsersSubscriptionToAdmin
);
subscriptionRouter.put(
  "/update-subscription",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  updateSubscription
);
subscriptionRouter.delete(
  "/delete-subscription",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  deleteSubscription
);

module.exports = subscriptionRouter;
