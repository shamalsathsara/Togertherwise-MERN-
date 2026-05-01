/**
 * adminSeed.js — Creates default admin user for first-time setup.
 * Run with: npm run seed
 *
 * ⚠️  IMPORTANT: Change the admin credentials immediately after first login!
 * Default: admin@Togertherwerise.org / Admin@123
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("🌱 Running admin seed...");

    // ── Fix: email must be lowercase to match login's .toLowerCase() lookup ──
    const ADMIN_EMAIL = "admin@togertherwerise.org"; // all lowercase
    const ADMIN_PASSWORD = "Admin@123456!"; // 13 chars — meets 12-char minimum

    // Check if an admin already exists (any case)
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      // If email is wrong case, fix it in place
      if (existingAdmin.email !== ADMIN_EMAIL) {
        existingAdmin.email = ADMIN_EMAIL;
        await existingAdmin.save({ validateBeforeSave: false });
        console.log(`🔧 Fixed admin email to lowercase: ${ADMIN_EMAIL}`);
      } else {
        console.log(`✅ Admin already exists: ${existingAdmin.email}`);
        console.log("   Skipping seed to avoid duplicates.");
      }
      return;
    }

    // Create the default admin user
    // Password is automatically hashed by the User model's pre-save hook
    const admin = await User.create({
      name: "Togertherwerise Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     ${admin.role}`);
    console.log("   ⚠️  Please change the password immediately after login!");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
};

seedAdmin();
