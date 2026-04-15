/**
 * adminSeed.js — Creates default admin user for first-time setup.
 * Run with: npm run seed
 *
 * ⚠️  IMPORTANT: Change the admin credentials immediately after first login!
 * Default: admin@Togertherwerise.org / Admin@123
 */

require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const User = require("../models/User");
const connectDB = require("../config/db");

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("🌱 Running admin seed...");

    // Check if admin already exists to prevent duplicates
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log(`✅ Admin already exists: ${existingAdmin.email}`);
      console.log("   Skipping seed to avoid duplicates.");
      return;
    }

    // Create the default admin user
    // Password is automatically hashed by the User model's pre-save hook
    const admin = await User.create({
      name: "Togertherwerise Admin",
      email: "admin@Togertherwerise.org",
      password: "Admin@123",   // ⚠️ Change immediately after first login!
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);
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
