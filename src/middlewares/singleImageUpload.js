const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UploadSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (process.env.VERCEL_ENV === "production") {
      // ✅ On Vercel, only /tmp is writable
      uploadPath = "/tmp";
    } else {
      // ✅ Local uploads
      uploadPath = path.join(__dirname, "../../public/uploads");

      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const UploadSingleImage = multer({ storage: UploadSingle });

module.exports = UploadSingleImage;
