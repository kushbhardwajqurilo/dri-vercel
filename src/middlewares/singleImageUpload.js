const multer = require("multer");
const path = require("path");

const UploadSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath =
      process.env.VERCEL_ENV === "production"
        ? "/tmp"
        : path.join(__dirname, "../../public/uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const unisuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unisuffix + "-" + file.originalname);
  },
});

const UploadSingleImage = multer({ storage: UploadSingle });

module.exports = UploadSingleImage;
