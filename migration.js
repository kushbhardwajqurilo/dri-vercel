const mongoose = require("mongoose");

// ---- Bank Schema ----
const bankSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: [true, "bank name require"],
    unique: true,
  },
  icon: {
    type: String,
    required: [true, "bank icon requrie"],
  },
});

async function migrate() {
  try {
    // 1. Source connection
    const sourceConn = await mongoose.createConnection(
      "mongodb+srv://appdri07_db_user:lKXAEOx5y8uaHjAK@debtreliefindia.nermcwk.mongodb.net/DebtReliefIndia",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to Source DB");

    // 2. Destination connection
    const destConn = await mongoose.createConnection(
      "mongodb+srv://kushbhardwaj8800:HpnHxmLhKKYppCYE@kushcluster.hinejtf.mongodb.net/DebtReliefIndia",
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("✅ Connected to Destination DB");

    // 3. Models
    const SourceBank = sourceConn.model("banks", bankSchema, "banks");

    console.log("soure bnk", SourceBank);
    const DestBank = destConn.model("banks", bankSchema, "banks");

    // 4. Fetch all docs from source
    const docs = await SourceBank.find({}).lean();
    console.log(`📦 Found ${docs.length} records in source bank collection`);

    if (docs.length > 0) {
      try {
        // Insert preserving _id, skip duplicates
        await DestBank.insertMany(docs, { ordered: false });
      } catch (err) {
        if (err.writeErrors) {
          console.log(`⚠️ Some duplicates skipped (${err.writeErrors.length})`);
        } else {
          throw err;
        }
      }
    }

    // 5. Close connections
    await sourceConn.close();
    await destConn.close();
  } catch (err) {
    process.exit(1);
  }
}

migrate();
