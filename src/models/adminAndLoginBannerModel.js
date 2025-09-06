const mongoose = require('mongoose');
const AdminAndLoginSchema = new mongoose.Schema({
    loginBanner:{
        type:String,
    },
    loginBanner_public_key:{
        type:String
    },
    adminBanner:{
        type:String,
    },
    adminBanner_public_key:{
        type:String
    }
});
module.exports = mongoose.model('loginbanner',AdminAndLoginSchema);