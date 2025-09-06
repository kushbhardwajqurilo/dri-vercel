const {
  addAdvocate,
  updateAdvocate,
  getSingleAdvocate,
  getAllAdvocates,
} = require("../controllers/admin/advocateController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const UploadSingleImage = require("../middlewares/singleImageUpload");

const advocateRouter = require("express").Router();
advocateRouter.post("/add", UploadSingleImage.single("image"), addAdvocate);
advocateRouter.put(
  "/update",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  UploadSingleImage.single("image"),
  updateAdvocate
);
advocateRouter.get("/single/:id", getSingleAdvocate);
advocateRouter.get("/all", getAllAdvocates);

module.exports = advocateRouter;
