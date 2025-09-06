const bannerModel = require("../models/bannerModel");
const bannerWithTitle = require("../models/bannerWithTitleModel");
const cloudinary = require("../utilitis/cloudinary");
const fs = require("fs");
// banner without title
exports.createBanner = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(404)
        .json({ message: "Image is required", success: false });
    }
    const imagePath = file.path;
    const banner = await cloudinary.uploader.upload(imagePath, {
      folder: "Banners",
    });
    fs.unlinkSync(imagePath);
    const upload = await bannerModel.create({
      bannerImage: banner.secure_url,
      public_id: banner.public_id,
    });
    if (!upload) {
      return res
        .status(404)
        .json({ success: false, message: "failed to upload" });
    }
    return res
      .status(201)
      .json({ success: true, message: "banner uploaded successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBanner = async (req, res, next) => {
  try {
    const banner = await bannerModel.find();
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "No banner found" });
    }
    return res.status(200).json({ success: true, banner });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// banner without title end...

//banner with title start...

exports.bannerWithTitle = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const bannerImage = file.path;
    const { title, hyperLink } = req.body;
    if (!title || !hyperLink) {
      return res
        .status(400)
        .json({ success: false, message: "Title and hyperLink is required" });
    }

    const banner = await cloudinary.uploader.upload(bannerImage, {
      folder: "Banners",
    });
    fs.unlinkSync(bannerImage); // delete local file

    const paylod = {
      bannerImage: banner.secure_url,
      bannerTitle: title,
      public_id: banner.public_id,
      hyperLink,
    };

    const bannerRes = await bannerWithTitle.create(paylod);
    if (!bannerRes) {
      return res.status(400).json({ success: false, message: "Upload failed" });
    }
    return res.status(201).json({
      success: true,
      message: "Banner uploaded successfully",
      data: bannerRes,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// updpate banner with titiel
exports.updateBannerWithTitle = async (req, res, next) => {
  try {
    const bannerId = req.body.id;
    const { title, hyperLink } = req.body;
    // get existing banner
    const existingBanner = await bannerWithTitle.findById(bannerId);
    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    let updatedData = {};

    // update title if provided
    if (title) {
      updatedData.bannerTitle = title;
    }

    if (hyperLink) {
      updatedData.hyperLink = hyperLink;
    }
    // check if image file provided
    if (req.file) {
      // delete old image from Cloudinary (if exists)
      if (existingBanner.public_id) {
        await cloudinary.uploader.destroy(existingBanner.public_id);
      }

      // upload new image to Cloudinary
      const newBanner = await cloudinary.uploader.upload(req.file.path, {
        folder: "Banners",
      });

      // delete local file after upload
      fs.unlinkSync(req.file.path);

      // update DB fields
      updatedData.bannerImage = newBanner.secure_url;
      updatedData.public_id = newBanner.public_id;
    }

    // update document in DB
    const updatedBanner = await bannerWithTitle.findByIdAndUpdate(
      bannerId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (err) {
    console.error("Error in updateBannerWithTitle:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteBannerWithTitle = async (req, res, next) => {
  try {
    const bannerId = req.params.id;

    // Find banner by ID
    const banner = await bannerWithTitle.findById(bannerId);
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Delete image from Cloudinary
    if (banner.public_id) {
      await cloudinary.uploader.destroy(banner.public_id);
    }

    // Delete banner from database
    await bannerWithTitle.findByIdAndDelete(bannerId);

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// banner without title end...

exports.getBannerWithTitle = async (req, res, next) => {
  try {
    const banner = await bannerWithTitle.find();
    if (!banner) {
      return res
        .status(404)
        .json({ success: false, message: "No banners found" });
    }
    return res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteBannerWithTitle = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    const isBanner = await bannerWithTitle.findById(bannerId);
    if (!isBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    await isBanner.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateTitledBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id;
    const banner = req.body;
    const isBanner = await bannerWithTitle.findById(bannerId);
    if (!isBanner) {
      return res
        .status(404)
        .json({ success: false, message: "Banner not found" });
    }
    isBanner.bannerTitle = banner.title;
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete banner
exports.deleteBanner = async (req, res, next) => {
  try {
    const { public_id } = req.query;
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") {
      return res.status(400).json({
        success: false,
        message: "failed to delete image",
      });
    }
    await bannerModel.deleteOne({ public_id });
    res.status(201).json({
      success: true,
      message: "image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
