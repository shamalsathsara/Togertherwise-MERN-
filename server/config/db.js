/**
 * db.js — MongoDB Connection
 * Uses Mongoose to connect to MongoDB.
 * Connection string comes from MONGODB_URI in .env
 */

const mongoose = require("mongoose");

/**
 * connectDB — Establishes the database connection.
 * Called once on server startup in server.js.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Modern Mongoose 8+ doesn't need these flags, but included for clarity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure so we don't run a broken server
    process.exit(1);
  }
};

module.exports = connectDB;
