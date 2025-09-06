const mongoose = require('mongoose');

const emiSchema = new mongoose.Schema({
  phone: {
    type: String,
    ref: 'user',
    required: true
  },
  totalEmis: {
    type: String,
    required: true
  },
  emiAmount: {
    type: String,
    required: true
  },
  paidEmi:{
    type:Number,
    default:0
  }
}, { timestamps: true });

module.exports = mongoose.model('EMI', emiSchema);
