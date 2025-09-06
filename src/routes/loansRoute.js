const {
  createPersonalLoan,
  getAllLoans,
} = require("../controllers/loansControll");
const { UserAuthMiddleWare } = require("../middlewares/userMiddleware");

const loanRouter = require("express").Router();
loanRouter.post("/create", createPersonalLoan);
loanRouter.get("/", UserAuthMiddleWare, getAllLoans);
module.exports = loanRouter;
