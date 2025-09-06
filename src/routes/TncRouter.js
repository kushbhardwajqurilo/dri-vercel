const TncRoutetr = require("express").Router();
const {
  addTNC,
  updateTnc,
  deleteTnc,
  getAllTnc,
} = require("../controllers/termsAndConditionController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
TncRoutetr.post("/add", AuthMiddleWare, addTNC);
TncRoutetr.put("/update", AuthMiddleWare, updateTnc);
TncRoutetr.delete("/delete", AuthMiddleWare, deleteTnc);
TncRoutetr.get("/all", getAllTnc);
module.exports = TncRoutetr;
