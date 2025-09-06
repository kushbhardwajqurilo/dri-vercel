const adminModel = require("../../models/adminModel");
const DRIModel = require("../../models/DriWorkModel");
const cloudinary = require("../../utilitis/cloudinary");
const fs = require("fs");
exports.createDRI = async (req, res, next) => {
  try {
    const file = req.file.path;
    const { title, content } = req.body;
    const { admin_id } = req;
    if (!admin_id || !title || !content) {
      return res.status(400).json({ success, message: "Invalid Credentials." });
    }
    const payload = { adminId: admin_id, title, content };
    const image = await cloudinary.uploader.upload(file, {
      folder: "driWorkAvatar",
    });
    payload.avatar = image.secure_url;
    payload.public_id = image.public_id;
    fs.unlinkSync(file);
    const isAdmin = await adminModel.findOne({ _id: admin_id });
    if (!isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Admin Try Again." });
    }
    const DRI = await DRIModel.create(payload);
    if (!DRI) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to Create DRI Works" });
    }
    return res
      .status(200)
      .json({ success: true, message: "DRI Works Created Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// update dri

exports.updateDri = async (req, res, next) => {
  try {
    const { title, content, driId, public_id } = req.body;
    if (!title || !content || !driId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials." });
    }

    let payload = {
      title,
      content,
    };

    // Agar image bheja gaya hai to update karo
    if (req.file) {
      const file = req.file.path;

      // purani image delete karo
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }

      // nayi image upload karo
      const image = await cloudinary.uploader.upload(file, {
        folder: "driWorkAvatar",
      });

      fs.unlinkSync(file);

      payload.avatar = image.secure_url;
      payload.public_id = image.public_id;
    }

    // DB update
    const updateDRI = await DRIModel.findByIdAndUpdate(driId, payload, {
      new: true,
    });

    if (!updateDRI) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to Update DRI Works" });
    }

    return res.status(200).json({
      success: true,
      message: "DRI Works Updated Successfully",
      data: updateDRI,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.DeleteDri = async (req, res, next) => {
  try {
    const { admin_id } = req;
    const { driId } = req.query;
    if (!admin_id || !driId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials." });
    }
    const isAdmin = await adminModel.findById(admin_id);
    if (isAdmin) {
      const updateDRI = await DRIModel.findByIdAndDelete(driId);
      if (!updateDRI) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to Delete DRI Works" });
      }
      await cloudinary.uploader.destroy(updateDRI.public_id);
      return res
        .status(200)
        .json({ success: true, message: "DRI Works Delete Successfully" });
    }
    return res
      .status(400)
      .json({ success: false, message: "Invalid Admin Try Again." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get dri works

exports.getAlldriWorks = async (req, res, next) => {
  try {
    const all = await DRIModel.find({});
    if (!all) {
      return res
        .status(400)
        .json({ success: false, message: "No DRI Works Found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "DRI Works Found.", data: all });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, error });
  }
};
