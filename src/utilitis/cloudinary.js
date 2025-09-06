const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CloudName,
  api_key: process.env.CloudinaryApiKey,
  api_secret: process.env.CloudinarySecretKey,
});
module.exports = cloudinary;
