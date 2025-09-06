const mongoose = require('mongoose');
const privacyPolicySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    points:[String]  
});

module.exports = mongoose.model('PrivacyAndPolicy',privacyPolicySchema);