const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq:{
        type:Number,
        default:111,
    }
});
module.exports = mongoose.model('counter',counterSchema);