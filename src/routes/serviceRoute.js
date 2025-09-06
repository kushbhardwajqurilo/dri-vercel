const serviceRouter = require("express").Router();
const {
  createServiceFees,
  updateServiceFees,
  deleteServiceFees,
  getAllServicesToUser,
  getAllServicesToAdmin,
} = require("../controllers/admin/serviceFeesController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");
serviceRouter.post(
  "/",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  createServiceFees
);
serviceRouter.put(
  "/",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  updateServiceFees
);
serviceRouter.delete(
  "/",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  deleteServiceFees
);
serviceRouter.get("/user", getAllServicesToUser);
serviceRouter.get(
  "/admin",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  getAllServicesToAdmin
);

module.exports = serviceRouter;
