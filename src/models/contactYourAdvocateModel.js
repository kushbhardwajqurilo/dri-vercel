const mongoose = require("mongoose");
const customeNotificatin = mongoose.Schema({
  kyc_approve: {
    type: String,
    required: true,
  },
  kyc_submit: {
    type: String,
    required: true,
  },
  invoice: {
    type: String,
    required: true,
  },
});
const customeNoticationModel = new mongoose.model(
  "customeNotification",
  customeNotificatin
);
const conctYourAdvocateSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
});
const contatYourAdvocateModel = new mongoose.model(
  "contactmessage",
  conctYourAdvocateSchema
);
module.exports = { contatYourAdvocateModel, customeNoticationModel };
