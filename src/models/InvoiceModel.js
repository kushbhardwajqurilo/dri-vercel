const mongoose = require("mongoose");
const InvoiceSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: [true, "phone number required"],
    },
    InvoiceDate: {
      type: Date,
    },
    ServiceName: {
      type: String,
    },
    TotalAmount: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  { strict: false }
);

const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);
module.exports = InvoiceModel;
