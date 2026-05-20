/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: routes/authRoutes.js - Authentication endpoints (register, login, get users)
 */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

/* 👤 REGISTER USER */
router.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken."
            });
        }

        // Hash the password with bcryptjs
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the user record
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || "user"
        });

        // Hide password in response
        const userResponse = {
            _id: user._id,
            username: user.username,
            role: user.role
        };

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
});

/* 🔑 LOGIN USER */
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Compare password hashes
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            });
        }

        // Sign access token with JWT
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m" // Expires in 15 minutes as per manual
            }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
});

/* 🔐 GET ALL USERS (ADMIN ONLY) */
router.get("/users", auth("admin"), async (req, res) => {
    try {
        // Fetch all users and omit password hashes
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
            error: error.message
        });
    }
});

module.exports = router;
