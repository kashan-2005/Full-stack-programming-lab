/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: config/db.js - Handles MongoDB connection
 */

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI defined in environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected successfully to host: ${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
