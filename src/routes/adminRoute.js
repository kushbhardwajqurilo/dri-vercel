const {
  createAdmin,
  loginAdmin,
  addBarcodeWithUpi,
  updateAdminDetails,
  getAdminDetails,
  getBarcodeAndUpi,
  uploadProfileImage,
  adminDashboardBanner,
  addLoginBackground,
  getAdminAnsLoginBanner,
  getAdminProfileAndBanner,
  requestOtp,
  verifyOtpForAdmin,
  changePasswprd,
} = require("../controllers/admin/adminControll");
const { addBanks, getBanks } = require("../controllers/admin/bankController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/bannerMiddleware");
const {
  forgetPasswordMddleware,
} = require("../middlewares/changePasswordMiddleware");
const limiter = require("../middlewares/rateLimitMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const UploadSingleImage = require("../middlewares/singleImageUpload");

const adminRouter = require("express").Router();
adminRouter.post("/", createAdmin);
adminRouter.post("/login", limiter, loginAdmin);
adminRouter.put(
  "/profile-update",
  AuthMiddleWare,
  UploadSingleImage.single("image"),
  uploadProfileImage
);
adminRouter.put(
  "/",
  upload.single("barcode"),
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  addBarcodeWithUpi
);
adminRouter.put(
  "/update-details",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  updateAdminDetails
);
adminRouter.get(
  "/get-details",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  getAdminDetails
);
adminRouter.get(
  "/barcode-details",
  AuthMiddleWare,
  roleAuthenticaton("admin", "user"),
  getBarcodeAndUpi
);
adminRouter.post(
  "/admindashboardbanner",
  AuthMiddleWare,
  UploadSingleImage.single("image"),
  adminDashboardBanner
);
adminRouter.get("/getadminBanner", getAdminAnsLoginBanner);
adminRouter.get("/adminProfileBanner", getAdminProfileAndBanner);
// adminRouter.get("/login-background", getlo);
adminRouter.post("/add-banks", UploadSingleImage.single("image"), addBanks);
adminRouter.get("/get-banks", getBanks);

//regarding change password routes
adminRouter.post("/request-otp", AuthMiddleWare, requestOtp);
adminRouter.post("/verify-otp", AuthMiddleWare, verifyOtpForAdmin);
adminRouter.put("/change-password", forgetPasswordMddleware, changePasswprd);
module.exports = adminRouter;
