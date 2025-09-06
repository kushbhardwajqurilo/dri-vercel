const multer = require("multer");

// Memory storage
const storage = multer.memoryStorage();

// Accept images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
  ];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and PDFs are allowed"));
};

// Limit size to 10MB
// const limits = { fileSize: 10 * 1024 * 1024 };

// Multer middleware
const cloudinaryUploader = multer({ storage, fileFilter }).array("file", 20);

module.exports = { cloudinaryUploader };
