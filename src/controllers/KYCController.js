const {
  sendKycApprovalNotification,
} = require("../config/fcm/notification.controller");
const adminModel = require("../models/adminModel");
const advocateModel = require("../models/advocateModel");
const DrisModel = require("../models/DriUserModel");
const KYCmodel = require("../models/KYCModel");
const User = require("../models/userModel");
const cloudinary = require("../utilitis/cloudinary");
// const fs = require('fs');
const { Readable } = require("stream");
const {
  createNotification,
} = require("./notificationController/notificationsController");
const path = require("path");
const fs = require("fs");
const superbase = require("../config/superbase storage/superbaseConfig");
const {
  sendNotificationToSingleUser,
} = require("../config/expo-push-notification/expoNotification");
const fcmTokenModel = require("../models/fcmTokenModel");

// exports.CompleteKYC = async (req, res, next) => {
//   try {
//     const imageResults = [];
//     const pdfResults = [];
//     const { user_id } = req;
//     const { name, lastname, email, gender, phone } = req.body;

//     // Validate required fields
//     if (!name || !user_id) {
//       return res
//         .status(400)
//         .json({ message: "Please fill all fields", success: false });
//     }

//     // Check if user exists
//     const isUser = await User.findById(user_id);
//     if (!isUser) {
//       return res.status(400).json({ message: "Invalid User", success: false });
//     }

//     // Check for duplicate email
//     if (isUser.email === email) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email Already Registered" });
//     }

//     // Check if KYC already exists
//     const isKyc = await KYCmodel.findOne({ $or: [{ user_id }, { phone }] });
//     if (isKyc) {
//       if (isKyc.status === "pending") {
//         return res.status(400).json({
//           message: "KYC already submitted. Awaiting approval",
//           success: false,
//         });
//       }
//       if (isKyc.status === "approve") {
//         return res
//           .status(200)
//           .json({ message: "KYC already approved", success: true });
//       }
//     }

//     // Function to upload to Cloudinary
//     const uploadToCloudinary = (fileBuffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "Kyc Documents" },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result.secure_url);
//           }
//         );
//         Readable.from(fileBuffer).pipe(stream);
//       });
//     };

//     // Function to upload to Supabase
//     const uploadToSupabase = async (fileBuffer, filename) => {
//       try {
//         const uniqueFilename = `pdfs/${Date.now()}-${filename}`;
//         const { data, error } = await superbase.storage
//           .from("kyc-pdfs")
//           .upload(uniqueFilename, fileBuffer, {
//             contentType: "application/pdf",
//             upsert: true,
//           });

//         if (error) {
//           console.error("Supabase upload error:", error.message);
//           throw new Error(`Failed to upload PDF: ${error.message}`);
//         }

//         // Get public URL
//         const { publicUrl } = superbase.storage
//           .from("kyc-pdfs")
//           .getPublicUrl(data.path);

//         console.log(publicUrl);
//         if (!publicUrl) {
//           throw new Error("Failed to generate public URL for PDF");
//         }

//         console.log("PDF uploaded to Supabase:", publicUrl);
//         return publicUrl;
//       } catch (error) {
//         console.error("Supabase upload error:", error.message);
//         throw error;
//       }
//     };

//     // Process uploaded files
//     if (req.files && Array.isArray(req.files)) {
//       for (const file of req.files) {
//         const ext = file.originalname.split(".").pop().toLowerCase();

//         if (ext === "pdf") {
//           const pdfUrl = await uploadToSupabase(file.buffer, file.originalname);
//           pdfResults.push(pdfUrl);
//         } else {
//           const imageUrl = await uploadToCloudinary(file.buffer);
//           imageResults.push(imageUrl);
//         }
//       }
//     } else {
//       console.warn("No files found in req.files");
//     }

//     // Log results for debugging
//     console.log("Image Results:", imageResults);
//     console.log("PDF Results:", pdfResults);

//     // Create KYC payload
//     const payload = {
//       user_id,
//       name,
//       lastname,
//       email,
//       gender,
//       phone,
//       image: imageResults.length > 0 ? imageResults : [],
//       pdf: pdfResults.length > 0 ? pdfResults : [],
//     };

//     // Save to database
//     const uploadKyc = await KYCmodel.create(payload);

//     if (!uploadKyc) {
//       return res
//         .status(400)
//         .json({ message: "Failed to upload KYC", success: false });
//     }
//     return res.status(200).json({
//       success: true,
//       message:
//         "Your documents have been submitted. Admin will approve within 24 hours.",
//     });
//   } catch (error) {
//     console.error("KYC submission error:", error.message);
//     return res.status(500).json({ message: error.message, success: false });
//   }
// };
//approved kyc by admin

exports.ApproveByAdmin = async (req, res) => {
  try {
    const iconUrl = req.protocol + "://" + req.get("host");

    const admin_id = req.admin_id;
    const { kycId, assign_id, advocate_id } = req.body;

    if (!admin_id) {
      return res.status(400).json({
        success: false,
        message: "Invalid Admin Credentials",
      });
    }

    if (!kycId || !assign_id || !advocate_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const isAdmin = await adminModel.findById(admin_id);
    if (!isAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isKYC = await KYCmodel.findById(kycId);
    if (!isKYC) {
      return res.status(404).json({
        success: false,
        message: "KYC not found",
      });
    }

    if (isKYC.status === "approve") {
      return res.status(400).json({
        success: false,
        message: "KYC is already approved",
      });
    }

    // ✅ Get user_id from KYC and assign to advocate
    const userId = isKYC.user_id;

    const updatedAdvocate = await advocateModel.findByIdAndUpdate(
      advocate_id,
      { $addToSet: { assignUsers: userId.toString() } }, // prevent duplicates
      { new: true }
    );

    if (!updatedAdvocate) {
      return res.status(404).json({
        success: false,
        message: "Advocate not found or update failed",
      });
    }

    const payload = {
      id: assign_id,
      assign_advocate: advocate_id,
      status: "approve",
    };

    const updateKYC = await KYCmodel.findByIdAndUpdate(kycId, payload, {
      new: true,
    });

    if (!updateKYC) {
      return res.status(400).json({
        success: false,
        message: "Failed to approve KYC",
      });
    }
    const driPayload = {
      name: updateKYC.name,
      gender: updateKYC.gender,
      phone: updateKYC.phone,
      status: "N/A",
    };
    const insertDRiUserAfterAsign = await DrisModel.create(driPayload);
    const expo_token = await fcmTokenModel.findOne({
      userId: updateKYC.user_id,
    });
    await sendNotificationToSingleUser(
      expo_token.token,
      `Congratulations ${updateKYC?.name} your KYC Has been approved by admin`,
      "Kyc Aprrove",
      "kyc"
    );

    await createNotification(
      updateKYC.user_id,
      "kyc Approved",
      `Congratulations ${updateKYC?.name} your KYC Has been approved by admin`,
      "kyc"
    );
    return res.status(200).json({
      success: true,
      message: "KYC approved and advocate assigned",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
//
exports.getAllKycDetails = async (req, res) => {
  try {
    const fetchKYCUsers = await KYCmodel.find({}).populate("user_id");
    if (!fetchKYCUsers || fetchKYCUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No KYC details found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: fetchKYCUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//  get single kyc details
exports.getSingleKycDetails = async (req, res, next) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const fetchSingleKyc = await KYCmodel.findOne({ user_id });
    if (!fetchSingleKyc) {
      return res.status(404).json({
        success: false,
        message: "No KYC details found for the user",
      });
    }
    return res.status(200).json({
      success: true,
      data: fetchSingleKyc,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.CompleteKYC = async (req, res, next) => {
  try {
    const imageResults = [];
    const pdfResults = [];
    const { user_id } = req;
    const { name, lastname, email, gender, phone } = req.body;

    // Validate required fields
    if (!name || !user_id) {
      return res
        .status(400)
        .json({ message: "Please fill all fields", success: false });
    }

    // Check if user exists
    const isUser = await User.findById(user_id);
    if (!isUser) {
      return res.status(400).json({ message: "Invalid User", success: false });
    }

    // Check for duplicate email
    if (isUser.email === email) {
      return res
        .status(400)
        .json({ success: false, message: "Email Already Registered" });
    }

    // Check if KYC already exists
    const isKyc = await KYCmodel.findOne({ $or: [{ user_id }, { phone }] });
    if (isKyc) {
      if (isKyc.status === "pending") {
        return res.status(400).json({
          message: "KYC already submitted. Awaiting approval",
          success: false,
        });
      }
      if (isKyc.status === "approve") {
        return res
          .status(200)
          .json({ message: "KYC already approved", success: true });
      }
    }

    // Function to upload to Cloudinary
    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Kyc Documents" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    // Function to upload to Supabase
    const uploadToSupabase = async (fileBuffer, filename) => {
      try {
        const uniqueFilename = `pdfs/${Date.now()}-${filename}`;
        // Upload file to Supabase
        const { data, error } = await superbase.storage
          .from("kyc-pdfs")
          .upload(uniqueFilename, fileBuffer, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (error) {
          return res
            .status(400)
            .json({ success: false, message: error.message, error });
        }
        // Get public URL
        const { data: urlData, error: urlError } = superbase.storage
          .from("kyc-pdfs")
          .getPublicUrl(data.path);

        if (urlError) {
          return res
            .status(400)
            .json({ success: false, message: error.message, error });
        }

        if (!urlData || !urlData.publicUrl) {
          return res
            .status(400)
            .json({ success: false, message: error.message, error });
        }

        return urlData.publicUrl;
      } catch (error) {
        return res
          .status(500)
          .json({ success: false, message: error.message, error });
      }
    };

    // Process uploaded files
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const ext = file.originalname.split(".").pop().toLowerCase();

        if (ext === "pdf") {
          const pdfUrl = await uploadToSupabase(file.buffer, file.originalname);
          pdfResults.push(pdfUrl);
        } else {
          const imageUrl = await uploadToCloudinary(file.buffer);
          imageResults.push(imageUrl);
        }
      }
    } else {
      // console.warn("No files found in req.files");
    }

    // Create KYC payload
    const payload = {
      user_id,
      profile: imageResults[0],
      name,
      lastname,
      email,
      gender,
      phone,
      image: imageResults.length > 0 ? imageResults : [],
      pdf: pdfResults.length > 0 ? pdfResults : [],
    };
    // Save to database
    const uploadKyc = await KYCmodel.create(payload);

    if (!uploadKyc) {
      return res
        .status(400)
        .json({ message: "Failed to upload KYC", success: false });
    }
    const expoToken = await fcmTokenModel.findOne({ userId: user_id });
    await sendNotificationToSingleUser(
      expoToken.token,
      `Dear ${uploadKyc.name} Your KYC documents have been sumbmitted.`,
      "Debt Relief India",
      "kyc"
    );
    await createNotification(
      expoToken.userId,
      "Debt Relief India",
      `Dear ${uploadKyc.name} Your KYC documents have been sumbmitted.`,
      "kyc"
    );

    return res.status(200).json({
      success: true,
      message:
        "Your documents have been submitted. Admin will approve within 24 hours.",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};
