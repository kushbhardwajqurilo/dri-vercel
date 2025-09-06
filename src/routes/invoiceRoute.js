const {
  uploadInvoice,
  viewInvoice,
  testingInvoice,
  getInvoices,
  getInvoicesByMonthYear,
} = require("../controllers/invoce/insertInvoiceController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");
const { roleAuthenticaton } = require("../middlewares/roleBaseAuthentication");
const UploadSingleImage = require("../middlewares/singleImageUpload");

const InvoiceRouter = require("express").Router();
InvoiceRouter.get("/invoice-by-month", getInvoicesByMonthYear);
InvoiceRouter.post(
  "/",
  AuthMiddleWare,
  roleAuthenticaton("admin"),
  UploadSingleImage.single("pdf"),
  uploadInvoice
);
InvoiceRouter.post("/get-invoice", getInvoices);
InvoiceRouter.get("/", viewInvoice);

module.exports = InvoiceRouter;
