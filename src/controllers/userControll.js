const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const DriUser = require("../models/DriUserModel");
const userSavingsModel = require("../models/userSavingsModel");
const KYCmodel = require("../models/KYCModel");
const { saveExpoToken } = require("../utilitis/fcm.utils");
const FcmToken = require("../models/fcmTokenModel");
const {
  sendNotificationToSingleUser,
} = require("../config/expo-push-notification/expoNotification");
const otpStore = {};
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // ✅ Phone validation
    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Valid 10-digit phone number is required",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry

    let user = await User.findOne({ phone: phone });
    if (!user) {
      user = await User.create({ phone: phone });
    }

    user.otp = Number(otp);
    user.otpExpire = otpExpiry;
    await user.save();

    const apiUrl = `https://sms.autobysms.com/app/smsapi/index.php?key=45FA150E7D83D8&campaign=0&routeid=9&type=text&contacts=${phone}&senderid=SMSSPT&msg=Your OTP is ${otp} SELECTIAL&template_id=1707166619134631839`;

    const response = await axios.get(apiUrl);
    console.log("SMS API Response:", response.data);

    if (response.data.type === "SUCCESS") {
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
        error: response.data,
      });
    }
  } catch (err) {
    console.error("OTP sending error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
// Verify OTP
// exports.verifyOTP = async (req, res) => {
//   try {
//     const { phone, otp, expoToken } = req.body;
//     if (!phone || !otp) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Phone & OTP required" });
//     }
//     // 🔹 OTP validation logic (same as before)...

//     let user = await User.findOne({ phone });
//     if (!user) {
//       user = await User.create({ phone });
//     }

//     // 🔹 Save / Update FCM token
//     if (expoToken) {
//       await saveExpoToken(user._id, expoToken);
//     }

//     // 🔹 Create JWT
//     const token = jwt.sign(
//       { userId: user._id, role: "user" },
//       process.env.SecretKey,
//       {
//         expiresIn: "7d",
//       }
//     );

//     delete otpStore[phone];
//     const isKycApprove = await KYCmodel.findOne({
//       $or: [{ alternatePhone: phone }, { phone }],
//     });

//     if (isKycApprove) {
//       return res.status(200).json({
//         success: true,
//         message: "Login successful",
//         token,
//         status: isKycApprove.status, // pending / approved / rejected
//       });
//     }
//     const check = await sendNotificationToSingleUser(
//       expoToken,
//       "Login Successfully",
//       "Debt Relief India"
//     );
//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       status: "new",
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp, FcmToken } = req.body;

    // Basic validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone and OTP are required",
      });
    }

    // Get user from DB
    let user = await User.findOne({
      $or: [{ phone }, { aternatePhone: phone }],
    });

    if (!user) {
      user = await User.create({ phone });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Failed to verify user.",
        });
      }
    }

    // OTP & expiry check
    if (!user.otp || !user.otpExpire || Date.now() > user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    if (Number(user.otp) !== Number(otp)) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ✅ OTP correct → clear OTP fields
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    if (expoToken) {
      await saveExpoToken(user._id, expoToken);
    }
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.SecretKey,
      { expiresIn: "7d" }
    );

    // ✅ Check KYC status
    const isKycApprove = await KYCmodel.findOne({
      $or: [{ alternatePhone: phone }, { phone }],
    });

    if (isKycApprove) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        status: isKycApprove.status, // pending / approved / rejected
      });
    }

    const check = await sendNotificationToSingleUser(
      expoToken,
      "Login Successfully",
      "Debt Relief India"
    );
    // New user (no KYC yet)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      status: "new",
      token,
    });
  } catch (err) {
    console.error("verifyOTP error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.userController = async (req, res, next) => {
  try {
    const { user_id } = req;
    if (!user_id) {
      return res
        .status(404)
        .json({ success: false, message: "user id missing" });
    }
    const userData = await User.findOne({ _id: user_id });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    return res.status(200).json({ success: true, userData });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

//  create user

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!req.body) {
      return res
        .status(400)
        .json({ success: false, message: "invalid request" });
    }
    if (!name || !email || !phone) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const existingUser = await User.findOne({ phone: phone });
    if (existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User already exists" });
    }
    const user = await User.create({ name, email, phone });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Created" });
    }
    return res
      .status(201)
      .json({ success: true, message: "User Created Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const { id } = req.query;
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "invalid user" });
    }
    const updateFields = {
      name,
      email,
      phone,
    };
    const user = await User.updateOne({ _id: id }, updateFields, { new: true });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "faild to update" });
    }

    return res.status(200).json({ success: true, message: "update success" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
// user login ny phone and otp

//
exports.InsertUser = async (req, res, next) => {
  try {
    // const {name, email,gender,}
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// insert saving by user
exports.userSaving = async (req, res, next) => {
  try {
    // Get user_id from proper place
    const user_id = req?.user_id || req.params.user_id || req.body.user_id;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "unauthorized user",
      });
    }

    const { month, year, amount, bank_id } = req.body;
    const requiredFields = { month, year, amount };
    const missingFields = [];

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null || value === "") {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        errors: missingFields,
      });
    }

    const saving = await userSavingsModel.create({
      user_id,
      month,
      year,
      amount,
      bank_id,
    });

    return res.json(saving);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get savings by user
exports.getSavingByMonthYear = async (req, res) => {
  try {
    const user_id =
      req.user_id ||
      req.params.user_id ||
      req.body.user_id ||
      req.query.user_id;
    if (!user_id) {
      return res.status(404).json({
        success: false,
        message: "invalid user",
      });
    }

    const { month, year } = req.body;
    const requiredFields = { user_id, month, year };
    const missingFields = [];

    for (const [key, value] of Object.entries(requiredFields)) {
      if (value == null || value === "" || value === "undefined") {
        missingFields.push(key);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `${missingFields.join(", ")} required`,
        errors: missingFields,
      });
    }

    const payload = {
      user_id,
      month: month.trim(),
      year: parseInt(year),
    };

    const savings = await userSavingsModel.find(payload);

    if (savings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No savings found for this month and year",
      });
    }

    return res.status(200).json({
      success: true,
      data: savings,
    });
  } catch (err) {
    console.error("Error fetching savings:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//get all saivng to usr
exports.getAllSavingToUser = async (req, res) => {
  try {
    const { user_id } = req;
    if (!user_id) {
      return res.status(404).json({
        success: false,
        message: "user id missing",
      });
    }

    const savings = await userSavingsModel
      .find({ user_id })
      .select("-__v")
      .populate("bank_id", "-__v -_id");

    if (savings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No savings found",
      });
    }

    return res.status(200).json({
      success: true,
      data: savings,
    });
  } catch (err) {
    console.error("Error fetching savings:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

//get all user savings

// change phone number
exports.changePhoneNumber = async (req, res) => {
  try {
    const { oldNumber, newNumber } = req.body;
    if (!oldNumber) {
      return res.status(200).json({
        success: false,
        message: "old number missing",
      });
    }
    if (!newNumber) {
      return res.status(200).json({
        success: false,
        message: "old number missing",
      });
    }
    //check alterPhone already register
    const isAlternatePhone = await User.findOne({ alternatePhone: newNumber });
    if (isAlternatePhone) {
      return res
        .status(400)
        .json({ success: false, message: "New Number already register" });
    }
    const user = await User.findOne({ phone: oldNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "old number not register",
      });
    }
    user.alternatePhone = newNumber;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "phone number change successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// get user profiles
exports.getUserProfile = async (req, res) => {
  try {
    const { user_id } = req;
    console.log("user", user_id);
    if (!user_id) {
      return res.status(400).json({ success: false, message: "user required" });
    }
    const profile = await KYCmodel.findOne({ user_id }).select(
      "-aadhar -backAdhar -pan -__v  -status -date"
    );
    if (!profile) {
      return res
        .status(400)
        .json({ success: false, message: "User profile not found try again." });
    }
    return res.status(200).json({ success: true, data: profile });
  } catch (error) {
    return res.status(400).json({ success: false, message: error?.message });
  }
};
