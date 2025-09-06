const mongoose = require("mongoose");
const bannerSchema = mongoose.Schema({
  bannerImage: {
    type: String,
    default: ".png",
  },
  public_id: {
    type: String,
  },
});
const bannerModel = new mongoose.model("banner", bannerSchema);
module.exports = bannerModel;
