const multer = require("multer");
const path = require("path");

const UploadSingle = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const UploadSingleImage = multer({ storage: UploadSingle });

module.exports = UploadSingleImage;
