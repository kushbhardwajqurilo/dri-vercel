const UPIModel = require("../models/UPIModel");
const cloudinary = require("../utilitis/cloudinary");
const fs = require("fs");
exports.createUPI = async (req, res, next) => {
  try {
    const { upi_id } = req.body;
    const filePath = req.file?.path;

    if (!upi_id) {
      return res.status(400).json({ message: "UPI ID is required" });
    }

    await UPIModel.deleteMany({});

    let payload = { upi_id };

    if (filePath) {
      const qr = await cloudinary.uploader.upload(filePath, {
        folder: "DRI_QR_CODE",
      });

      payload.qrCode = qr.secure_url;
      payload.qrCodePublic_key = qr.public_id;

      fs.unlinkSync(filePath);
    }

    const newUPI = await UPIModel.create(payload);

    return res.status(201).json({
      success: true,
      message: " UPI Add successfully",
    });
  } catch (error) {
    console.error("Error in createUPI:", error);
    return res.status(500).json({ message: error.message });
  }
};

//get upi
exports.getUPI = async (req, res, next) => {
  try {
    const upi = await UPIModel.find();
    if (!upi) {
      return res.status(404).json({ message: "No UPI found" });
    }
    return res.status(200).json({ success: true, data: upi });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// delete UPI
exports.deleteUPI = async (req, res, next) => {
  try {
    const upi_id = req.params.id;
    const find = await UPIModel.findById(upi_id);
    if (!find) {
      return res.status(404).json({ message: "No UPI found" });
    }
    await cloudinary.uploader.destroy(find.qrCodePublic_key);
    await find.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "UPI deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

// update  upi
exports.updateUPI = async (req, res, next) => {
  try {
    const { upi_id } = req.body;
    const filePath = req.file?.path;

    const existingUPI = await UPIModel.findOne();
    if (!existingUPI) {
      return res.status(404).json({ message: "No UPI record found" });
    }

    let updatedData = {};

    //  Update UPI ID if provided
    if (upi_id) {
      updatedData.upi_id = upi_id;
    }

    //  If new file provided, delete old image & upload new
    if (filePath) {
      if (existingUPI.qrCodePublic_key) {
        await cloudinary.uploader.destroy(existingUPI.qrCodePublic_key);
      }

      const qr = await cloudinary.uploader.upload(filePath, {
        folder: "DRI_QR_CODE",
      });

      updatedData.qrCode = qr.secure_url;
      updatedData.qrCodePublic_key = qr.public_id;

      fs.unlinkSync(filePath);
    }

    // 🔹 Update record in DB
    const updatedUPI = await UPIModel.findByIdAndUpdate(
      existingUPI._id,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "UPI updated successfully",
      data: updatedUPI,
    });
  } catch (error) {
    console.error("Error in updateUPI:", error);
    return res.status(500).json({ message: error.message });
  }
};
