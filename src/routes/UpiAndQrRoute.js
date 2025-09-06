const {
  createUPI,
  getUPI,
  deleteUPI,
  updateUPI,
} = require("../controllers/UPIController");
const UploadSingleImage = require("../middlewares/singleImageUpload");

const QRUPIRouter = require("express").Router();
QRUPIRouter.post("/", UploadSingleImage.single("image"), createUPI);
QRUPIRouter.get("/", getUPI);
QRUPIRouter.delete("/:id", deleteUPI);
QRUPIRouter.put("/update", UploadSingleImage.single("image"), updateUPI);
module.exports = QRUPIRouter;
