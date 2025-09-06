const mongoose = require("mongoose");
const bannerSchema = mongoose.Schema({
  bannerImage: {
    type: String,
    default: ".png",
  },
  bannerTitle: {
    type: String,
    required: [true, "title required..."],
  },
  public_id: {
    type: String,
  },
  hyperLink: {
    type: String,
    required: [true, "HyperLink required"],
  },
});
const bannerWithTitle = new mongoose.model("bannerwithtitle", bannerSchema);
module.exports = bannerWithTitle;
