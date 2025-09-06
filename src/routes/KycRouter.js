const {
  CompleteKYC,
  ApproveByAdmin,
  getSingleKycDetails,
  getAllKycDetails,
} = require("../controllers/KYCController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");
const { cloudinaryUploader } = require("../utilitis/multerStor");
const KycRouters = require("express").Router();

KycRouters.post(
  "/add-kyc",
  cloudinaryUploader,
  UserAuthMiddleWare,
  roleAuthenticaton("user"),
  CompleteKYC
);
KycRouters.post(
  "/approve-kyc",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  ApproveByAdmin
);
KycRouters.get("/get-kyc", getAllKycDetails);
KycRouters.get("/single-kyc", getSingleKycDetails);
module.exports = KycRouters;
