const express = require("express");
const emiRouters = express.Router();
const UploadSingleImage = require("../middlewares/singleImageUpload");
const { uploadEMICSV, payEmi, getEmiStatus } = require("../controllers/testEmiController");

emiRouters.post("/upload-emi", UploadSingleImage.single("csv"), uploadEMICSV);
emiRouters.patch("/emi/pay/:userId", payEmi);
emiRouters.get("/emi/status/:userId", getEmiStatus);

module.exports = emiRouters;
