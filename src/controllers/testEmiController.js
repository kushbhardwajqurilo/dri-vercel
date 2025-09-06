// controller/emiController.js
const fs = require("fs");
const cron = require('node-cron');
const csv = require("csv-parser");
const User = require("../models/userModel");
const EMI = require('../models/testingModel');
const DrisModel = require("../models/DriUserModel");
exports.uploadEMICSV = async (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (let row of results) {
        const { phoneNumber, emiTotal, dueDate, totalEmi } = row;
        console.log({phoneNumber , emiTotal ,dueDate,totalEmi})
        const user = await DrisModel.findOne({ phone: phoneNumber.trim() });
        if (!user) {
          console.log(`User with phone ${phoneNumber} not found.`);
          continue;
        }

        await EMI.create({
          phone: user.phone,
          totalEmis: totalEmi,
          emiAmount:emiTotal,
          dueDate: dueDate
        });
      }

      fs.unlinkSync(req.file.path);
      res.json({ message: "EMI records created successfully from CSV" });
    });
};

exports.payEmi = async (req, res) => {
  const { userId } = req.params;
  const plan = await EMI.findOne({ user: userId });

  if (!plan) return res.status(404).json({ message: "EMI plan not found" });

  const nextUnpaid = plan.emis.find(emi => !emi.isPaid);
  if (!nextUnpaid) return res.status(400).json({ message: "All EMIs are paid" });

  nextUnpaid.isPaid = true;
  nextUnpaid.paidDate = new Date();
  await plan.save();

  const paidCount = plan.emis.filter(e => e.isPaid).length;

  res.json({ message: "EMI paid", status: `${paidCount}/${plan.totalEmis}` });
};

exports.getEmiStatus = async (req, res) => {
  const { userId } = req.params;
  const plan = await EMI.findOne({ user: userId });

  if (!plan) return res.status(404).json({ message: "EMI plan not found" });

  const paid = plan.emis.filter(e => e.isPaid).length;
  const total = plan.totalEmis;

  res.json({ status: `${paid}/${total}`, emiAmount: plan.emiAmount, nextDueDate: plan.emis.find(e => !e.isPaid)?.dueDate });
};

cron.schedule("0 10 * * *", async () => {
  const today = new Date();
  const target = new Date(today);
  target.setDate(today.getDate() + 2);
  const formatted = target.toISOString().split("T")[0];

  const plans = await EMI.find({
    emis: {
      $elemMatch: {
        dueDate: { $gte: new Date(formatted), $lt: new Date(formatted + "T23:59:59Z") },
        isPaid: false
      }
    }
  }).populate("user");

  plans.forEach(plan => {
    const emi = plan.emis.find(e => !e.isPaid && new Date(e.dueDate).toDateString() === target.toDateString());
    if (emi) {
      console.log(`Notify ${plan.user.phoneNumber}: EMI of ₹${plan.emiAmount} due on ${emi.dueDate.toDateString()}`);
    }
  });
});