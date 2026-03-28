
// db.js — MongoDB Connection
// Uses Mongoose to connect to MongoDB.


const mongoose = require("mongoose");

/**
 * connectDB — Establishes the database connection.
 * Called once on server startup in server.js.
 */

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);  //Connection ok
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);  //Connection Error
    // Exit process with failure....
    process.exit(1);
  }
};

module.exports = connectDB;
