const mongoose = require('mongoose');
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image:{
        type:String,
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
        },
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, "password missing"],
        validate: {
            validator: (e) => {
                if (e.length <= 8) {
                    return "Password should be more than 8 character";
                }
            }
        }
    },
    role:{
        type: String,
        required: true,
    },
    barcode:{
        type:String,
        default:".png"
    },
    upi:{
        type:String
    }
    ,
    failedAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    }
});

const adminModel = new mongoose.model('admin', adminSchema);
module.exports = adminModel;