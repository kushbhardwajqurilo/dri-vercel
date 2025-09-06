const mongoose = require("mongoose");
const whatsappSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, "whatsapp number requried"],
  },
});
module.exports = mongoose.model("whatsappservice", whatsappSchema);
