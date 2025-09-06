const {
  addWhatsApp,
  getWhatsappNumber,
  updateWhatsappNumber,
} = require("../controllers/whatsAppController");
const { AuthMiddleWare } = require("../middlewares/adminMiddleware");

const whatsAppRouter = require("express").Router();

whatsAppRouter.post("/", AuthMiddleWare, addWhatsApp);
whatsAppRouter.get("/", getWhatsappNumber);
whatsAppRouter.put("/", AuthMiddleWare, updateWhatsappNumber);

module.exports = whatsAppRouter;
