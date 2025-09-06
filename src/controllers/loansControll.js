const mongoose = require("mongoose");
const personalLoanModel = require("../models/personalLoan");

exports.createPersonalLoan = async (req, res) => {
  try {
    const valdation = {
      loanType: "",
      principleAmount: "",
      estimatedSettlement: "",
      savings: "",
      bank: "",
      phone: "",
      user_id: "",
    };

    const {
      loanType,
      principleAmount,
      estimatedSettlement,
      savings,
      bank,
      phone,
      user_id,
    } = req.body;
    for (let val of Object.keys(valdation)) {
      if (
        req.body[val] === undefined ||
        req.body[val] == "" ||
        req.body[val].length === 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: `${val} is required` });
      }
    }
    const payload = {
      user_id,
      phone,
      bank,
      principleAmount,
      estimatedSettlement,
      saving: savings,
      loanType,
    };

    const loan = await personalLoanModel.create(payload);
    if (!loan) {
      return res
        .status(400)
        .json({ success: false, message: "Faild to add loan" });
    }
    return res.status(201).json({ success: true, message: "Loan added" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message, error: err });
  }
};

// Get all loans for a user.
exports.getAllLoans = async (req, res) => {
  try {
    const { user_id } = req;
    const personalloan = await personalLoanModel
      .find({ user_id })
      .populate("bank");

    if (personalloan.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No personal loans found" });
    }
    return res.status(201).json({ success: true, data: personalloan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
exports.getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid loan ID" });
    }
    const loan = await personalLoanModel.findById(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
    return res.status(200).json({ success: true, data: loan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid loan ID" });
    }
    const loan = await personalLoanModel.findByIdAndUpdate(loanId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
    return res.status(200).json({ success: true, data: loan });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid loan ID" });
    }
    const loan = await personalLoanModel.findByIdAndDelete(loanId);
    if (!loan) {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Loan deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// get for single user

// exports.getAllLoanUser = async(req , res)=>{
//   try{

//   }
// }
