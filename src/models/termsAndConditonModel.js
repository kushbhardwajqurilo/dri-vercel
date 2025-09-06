const mongoose = require('mongoose');
const termsAndConditionSchema = new mongoose.Schema({
    content:{
        type:String,
        required:[true,'content requried']
    }
});
module.exports = mongoose.model('TermsAndCondition',termsAndConditionSchema);