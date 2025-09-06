const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/'); // Make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const ExcleUpload = multer({ storage });
module.exports = ExcleUpload;