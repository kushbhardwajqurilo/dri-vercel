const multer = require("multer");
const path = require("path");

const isProduction = process.env.VERCEL_ENV === "production";

// Use memory storage on Vercel (no disk access)
const storage = isProduction
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, "../../public/uploads");
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const unisuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unisuffix + path.extname(file.originalname));
      },
    });

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDFs allowed"), false);
  }
};

const InvoiceMiddleware = multer({ storage, fileFilter });

module.exports = InvoiceMiddleware;
