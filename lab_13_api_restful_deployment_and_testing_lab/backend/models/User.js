/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: models/User.js - Mongoose Schema for Users
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model("User", userSchema);
