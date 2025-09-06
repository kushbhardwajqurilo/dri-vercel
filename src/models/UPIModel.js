const mongoose = require('mongoose');
const UpiSchema = new mongoose.Schema({
    upi_id:{
        type:String,
        required:[true ,'UPI ID is required'],
    },
    qrCode :{
        type:String,
        required:[true ,'QR Code is required'],
    },
    qrCodePublic_key:{
        type:String,
        required:true
    }
});


module.exports = mongoose.model('upiandQrcode',UpiSchema);