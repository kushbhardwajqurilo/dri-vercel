const whatsappModel = require("../models/whatsappModel");

exports.addWhatsApp = async (req, res) => {
  try {
    const { number } = req.body;
    // 1. Empty / undefined check
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number is required",
      });
    }

    // 2. Number type & digits check
    let numStr = String(number).trim();

    if (!/^\d+$/.test(numStr)) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number must contain only digits",
      });
    }

    // 3. Length check (exactly 10 digits)
    if (numStr.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number must be exactly 10 digits",
      });
    }

    // 4. Check if already exists
    const existing = await whatsappModel.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number already exists",
      });
    }

    // 5. Insert new number
    const newData = await whatsappModel.create({ number: numStr });

    return res.status(200).json({
      success: true,
      message: "WhatsApp number added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// get whatapp number
exports.getWhatsappNumber = async (req, res) => {
  try {
    const whatsapp = await whatsappModel.find({});
    if (!whatsapp || whatsapp.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "WhatsApp Number Not Found." });
    }
    return res.json({ whatsapp: whatsapp[0] });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

// update number
exports.updateWhatsappNumber = async (req, res) => {
  try {
    const { number } = req.body;

    // 1. Empty / undefined check
    if (!number) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number is required",
      });
    }

    // 2. Number type & digits check
    const numStr = String(number).trim();

    if (!/^\d+$/.test(numStr)) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number must contain only digits",
      });
    }

    // 3. Length check (exactly 10 digits)
    if (numStr.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "WhatsApp number must be exactly 10 digits",
      });
    }

    // 4. Find existing record
    let whatsapp = await whatsappModel.findOne();

    if (!whatsapp) {
      return res.status(404).json({
        success: false,
        message: "WhatsApp number not found",
      });
    }

    // 5. Update the number
    whatsapp.number = numStr;
    await whatsapp.save();

    return res.status(200).json({
      success: true,
      message: "WhatsApp number updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
