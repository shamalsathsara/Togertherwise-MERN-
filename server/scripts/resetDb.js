require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

const uri = process.env.MONGODB_URI;
if (!uri) { console.error("MONGODB_URI not found in .env"); process.exit(1); }

mongoose.connect(uri).then(async () => {
  console.log("✅ Connected to MongoDB");

  // Collections to wipe (everything except users — keeps admin account)
  const toClear = [
    "projects",
    "donations",
    "messages",
    "subscribers",
    "volunteers",
    "successstories",
    "newsupdates",
  ];

  for (const col of toClear) {
    try {
      const result = await mongoose.connection.db.collection(col).deleteMany({});
      console.log(`🗑  Cleared '${col}': ${result.deletedCount} document(s) removed`);
    } catch (err) {
      console.log(`ℹ️  Skip '${col}': ${err.message}`);
    }
  }

  console.log("\n✨ Database reset complete. Admin user preserved.");
  process.exit(0);
}).catch((err) => {
  console.error("Connection failed:", err.message);
  process.exit(1);
});
