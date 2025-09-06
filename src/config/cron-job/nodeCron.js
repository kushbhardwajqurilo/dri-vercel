const cron = require("node-cron");
const DrisModel = require("../../models/DriUserModel");

// Run every 1 minute for testing
exports.cronJob = cron.schedule("*/1 * * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pendingEmis = await DrisModel.find({ status: "Pending" });
    if (pendingEmis.length === 0) {
      console.log("✅ No pending EMI found.");
      return;
    }
    for (let emi of pendingEmis) {
      const dueDate = new Date(emi.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 2) {
        console.log(
          `⏰ Reminder: Hello ${emi.name}, your EMI of ₹${
            emi.monthlyEmi
          } is due on ${dueDate.toDateString()} (2 days left)`
        );
      } else if (diffDays < 0) {
        console.log(
          `⚠️ Alert: Hello ${emi.name}, your EMI of ₹${
            emi.monthlyEmi
          } was due on ${dueDate.toDateString()} but not paid yet!`
        );
      }
    }
  } catch (error) {
    console.error("❌ Error in EMI reminder cron:", error);
  }
});
