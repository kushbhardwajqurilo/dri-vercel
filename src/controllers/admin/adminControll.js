const adminModel = require("../../models/adminModel");
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  compareHashPassword,
} = require("../../utilitis/hashPash");
const fs = require("fs");
const cloudinary = require("../../utilitis/cloudinary");
const adminAndLoginBannerModel = require("../../models/adminAndLoginBannerModel");
const otpStores = {};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    if (!name || !email || !phone || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isAdmin = await adminModel.findOne({ phone: phone });
    if (isAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const haspass = await hashPassword(password);
    const addAdmin = await adminModel.create({
      name,
      email,
      phone,
      password: haspass,
      role,
    });
    if (!addAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create Admin" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Admin created successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Admin Credentials" });
    }
    const isExist = await adminModel.findOne({ email });
    if (!isExist) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    // --------- Check if account is locked -------------
    if (isExist.lockUntil && isExist.lockUntil > Date.now()) {
      const unlockTime = new Date(isExist.lockUntil).toLocaleTimeString();
      return res.status(403).json({
        success: false,
        message: `Account locked until ${unlockTime}`,
      });
    }
    // ------ check password match --------
    const isMatch = await compareHashPassword(password, isExist.password);
    if (!isMatch) {
      isExist.failedAttempts = (isExist.failedAttempts || 0) + 1;
      // Lock the account if failed 3 times
      if (isExist.failedAttempts >= 3) {
        isExist.lockUntil = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await isExist.save();
        return res.status(403).json({
          success: false,
          message:
            "Account locked due to 3 failed attempts. Try again in 10 minutes.",
        });
      }
      await isExist.save();
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    //If correct password, reset attempts
    isExist.failedAttempts = 0;
    isExist.lockUntil = null;
    await isExist.save();

    const payload = {
      name: isExist.name,
      email: isExist.email,
      adminId: isExist._id,
      role: isExist.role,
    };
    const secretKey = process.env.SecretKey;
    const adminToken = jwt.sign(payload, secretKey, { expiresIn: "15d" });
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: adminToken,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    const { admin_id } = req;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "driadmiprofile",
    });
    fs.unlinkSync(req.file.path);
    const user = await adminModel.findByIdAndUpdate(
      admin_id,
      {
        image: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Profile image uploaded successfully",
      success: "Prifile Uploaded.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.addBarcodeWithUpi = async (req, res, next) => {
  try {
    const { admin_id, imagePath } = req;
    const { upi, role } = req.body;
    if (!imagePath || !upi || !admin_id || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Request" });
    }
    const isAdmin = await adminModel.findOne({ _id: admin_id });
    if (!isAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    const addBarcodeWithUpi = await adminModel.updateOne(
      { _id: admin_id },
      { barcode: imagePath, upi }
    );
    if (addBarcodeWithUpi.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "upload failed...",
      });
    }
    return res
      .status(201)
      .json({ success: true, message: "barcode and upi added." });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateAdminDetails = async (req, res) => {
  try {
    const { admin_id } = req;
    const { email, phone } = req.body;

    // Validate inputs
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide email or phone to update",
      });
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Phone number must be 10 digits",
      });
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Check email uniqueness
    if (email) {
      const existingEmail = await adminModel.findOne({
        email,
        _id: { $ne: admin_id },
      });
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Check phone uniqueness
    if (phone) {
      const existingPhone = await adminModel.findOne({
        phone,
        _id: { $ne: admin_id },
      });
      if (existingPhone) {
        return res.status(409).json({
          success: false,
          message: "Phone number is already in use",
        });
      }
    }

    // Prepare update object
    const updates = {};
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    const updatedAdmin = await adminModel.findByIdAndUpdate(admin_id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin details updated successfully",
      data: updatedAdmin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.requestOtp = async (req, res, next) => {
  try {
    const { admin_id } = req;
    if (!admin_id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "phone required",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    otpStores[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };
    const admin = await adminModel.findById(admin_id);
    if (admin) {
      if (!admin.phone === phone) {
        delete otpStores[phone];
        return res.status(400).json({
          success: false,
          message: "phone Invaid",
        });
      }
      return res.status(200).json({
        success: true,
        message: "otp send.",
        otp,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

// send ot to admin
exports.verifyOtpForAdmin = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number requred" });
    }
    if (!otp) {
      return res.status(400).json({ success: false, message: "Otp Missing" });
    }
    const admin = await adminModel.findOne({ phone });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Admin Phone Numbber" });
    }
    const record = otpStores[phone];
    if (!record || record.expiresAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not found" });
    }

    const submittedOtp = Number(otp);
    const storedOtp = Number(record.otp);
    if (storedOtp !== submittedOtp) {
      return res.status(401).json({ success: false, message: "Invalid OTP" });
    }

    const verifyToken = await jwt.sign(
      { key: admin._id },
      process.env.ChangePasswordKey,
      { expiresIn: "5m" }
    );
    return res
      .status(200)
      .json({ success: true, message: "OTP verified", verifyToken });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};
// change password
exports.changePasswprd = async (req, res) => {
  try {
    const { key } = req;
    const { newPassword } = req.body;
    if (!key) {
      return res
        .status(400)
        .json({ success: false, message: "verification key missing" });
    }
    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "New Password Missing",
      });
    }
    const encryptPassword = await hashPassword(newPassword);
    const update_password = await adminModel.findByIdAndUpdate(key, {
      password: encryptPassword,
    });
    if (!update_password) {
      return res
        .status(400)
        .json({ success: false, message: "Filed Try Again..." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Passoword Changed" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
exports.getAdminDetails = async (req, res) => {
  try {
    const { admin_id, role } = req;
    if (!admin_id || !role) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: missing admin ID or role",
      });
    }

    const admin = await adminModel.findById(admin_id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Admin details fetched successfully",
      data: admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getBarcodeAndUpi = async (req, res, next) => {
  try {
    const { admin_id, role } = req;
    if (!admin_id || !role) {
      return res.status(400).json({
        success: false,
        message: "Invalid request: missing admin ID or role",
      });
    }
    const admin = await adminModel
      .findById(admin_id)
      .select("-password -name -email -phone  -_id -role -__v");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// login backgroudd api
exports.addLoginBackground = async (req, res, next) => {
  try {
    const { admin_id } = req;
    const file = req.file.path;
    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "admin invalid",
      });
    }
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "file missing",
      });
    }
    const image = await cloudinary.uploader.upload(file, {
      folder: "admin_and_login_banners",
    });
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Faild to upload image",
      });
    }
    const payload = {
      loginBanner: image.secure_url,
      loginBanner_public_key: image.public_id,
    };
    const store = await adminAndLoginBannerModel.create(payload);
    if (store.length === 0 || !store) {
      return res.status(404).json({
        success: false,
        message: "Faild.. try agian.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "upload done.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

//  get login banner
exports.adminDashboardBanner = async (req, res, next) => {
  try {
    const { admin_id } = req;
    const file = req.file.path;
    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "admin invalid",
      });
    }
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "file missing",
      });
    }
    console.log(file.admin_id);
    const image = await cloudinary.uploader.upload(file, {
      folder: "admin_and_login_banners",
    });
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Faild to upload image",
      });
    }
    const payload = {
      adminBanner: image.secure_url,
      adminBanner_public_key: image.public_id,
    };
    const store = await adminAndLoginBannerModel.create(payload);
    if (store.length === 0 || !store) {
      return res.status(404).json({
        success: false,
        message: "Faild.. try agian.",
      });
    }
    return res.status(201).json({
      success: true,
      message: "upload done.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
// delelte login banner
exports.deletLoginDashboardBanner = async (req, res, next) => {
  try {
    const { admin_id } = req;
    const { public_id } = req.params;
    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "admin invalid",
      });
    }
    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "image credentials missing",
      });
    }
    const image = await cloudinary.uploader.destroy(public_id);
    if (image.result === "ok") {
      const res = await adminAndLoginBannerModel.deleteOne({
        $or: [
          { loginBanner_public_key: public_id },
          { adminBanner_public_key: public_id },
        ],
      });
      if (!res) {
        return res
          .status(404)
          .json({ success: false, message: "unable to delete image" });
      }
      return res.status(201).json({
        success: true,
        message: "Image delete",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Faild to delete image",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

exports.getAdminAnsLoginBanner = async (req, res, next) => {
  try {
    const response = await adminAndLoginBannerModel.find({});
    if (!response) {
      return res
        .status(404)
        .json({ success: false, message: "unable to get banner" });
    }
    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  admin banner and profile image get api
exports.getAdminProfileAndBanner = async (req, res, next) => {
  try {
    const adminImage = await adminModel.find({});
    const adminBanner = await adminAndLoginBannerModel.find({});
    // console.log(adminImage[0].image,adminBanner[0].adminBanner)
    if (!adminImage || !adminBanner) {
      return res
        .status(404)
        .json({ success: false, message: "unable to get banner and image" });
    }
    return res.status(200).json({
      success: true,
      data: {
        adminProfile: adminImage[0].image,
        adminBanner: adminBanner[0].adminBanner,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

exports.getUserLoginBanner = async (req, res) => {
  try {
    const banners = await adminAndLoginBannerModel.find({}).select();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};
