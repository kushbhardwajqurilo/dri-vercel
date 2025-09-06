const {
  importUsersFromCSV,
  getUsersList,
  searchUserById,
  getSingleUser,
  getAssignAdvocate,
  getSettementAdvance,
} = require("../controllers/DriUser");
const csvUpload = require("../middlewares/csvMiddleware");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const driRoute = require("express").Router();
driRoute.post("/", csvUpload.single("csv"), importUsersFromCSV);
driRoute.get("/", getUsersList);
driRoute.get("/search", searchUserById);
driRoute.post("/single", getSingleUser);
driRoute.get("/assign-advocate", UserAuthMiddleWare, getAssignAdvocate);
driRoute.get("/settlement-advance", getSettementAdvance);
module.exports = driRoute;
