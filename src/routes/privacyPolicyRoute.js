const {
  privacyPolicy,
  getAllPolicy,
  deletePrivacyPolicy,
} = require("../controllers/PrivacyPolicyController");

const privacyPolicyRouter = require("express").Router();

privacyPolicyRouter.post("/", privacyPolicy);
privacyPolicyRouter.get("/", getAllPolicy);
privacyPolicyRouter.delete("/", deletePrivacyPolicy);
module.exports = privacyPolicyRouter;
