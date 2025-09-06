const BankModel = require("../../models/BankModel");
const cloudinary = require("../../utilitis/cloudinary");
const fs = require("fs");
exports.addBanks = async (req, res) => {
  try {
    const { bankName } = req.body;
    const file = req.file.path;
    if (!bankName) {
      return res
        .status(400)
        .json({ success: false, message: "bank name missing" });
    }
    if (!file) {
      return res.status(400).json({ success: false, message: "image missing" });
    }
    const upload = await cloudinary.uploader.upload(file, {
      folder: "banks_icons",
    });
    const icon = upload.secure_url;
    fs.unlinkSync(file);
    if (!icon) {
      return res.status("failed to upload icon");
    }
    const payload = { bankName, icon };
    const insertBank = await BankModel.create(payload);
    if (!insertBank) {
      return res
        .status(400)
        .json({ success: false, message: "failed to insert bank" });
    }
    return res.status(201).json({
      success: true,
      message: "bank add successfull",
    });
  } catch (error) {
    return res.status({ success: false, message: error.message, error });
  }
};

exports.getBanks = async (req, res) => {
  try {
    const banks = await BankModel.find({});
    if (!banks || banks.length === 0) {
      return res.json(400).json({ success: false, message: "Unable to fetch" });
    }
    return res.status(200).json({
      success: true,
      data: banks,
    });
  } catch (error) {
    return res.status({ success: false, message: error.message, error });
  }
};
