const multer = require("multer");
const path = require("path");

// Define storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath =
      process.env.VERCEL_ENV === "production"
        ? "/temp"
        : path.join(__dirname, "../../public/uploads/");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const unisuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unisuffix + "-" + file.originalname); // use original file name
  },
});

// File filter (optional: only allow .csv files)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".csv") {
    return cb(new Error("Only .csv files are allowed"), false);
  }
  cb(null, true);
};

const csvUpload = multer({ storage, fileFilter });

module.exports = csvUpload;
