/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: app.js - Initializes Express app, configures middleware, and registers routes
 */

const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* MIDDLEWARE SETUP */

// Cross-Origin Resource Sharing configuration to permit frontend communication
app.use(cors({
    origin: "http://localhost:3000", // standard react port
    credentials: true
}));

// Parsers for parsing application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Educational custom logger to log inbound requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] Inbound Request: ${req.method} ${req.originalUrl}`);
    next();
});

/* API ROOT INDEX ROUTE */
app.get("/", (req, res, next) => {
    const acceptHeader = req.headers["accept"] || "";
    if (acceptHeader.includes("application/json")) {
        return res.status(200).json({
            success: true,
            project: "MERN Stack API RESTful Deployment and Testing Lab",
            submittedBy: {
                studentName: "Hammad Shahzad",
                studentId: "232071"
            },
            collaborator: {
                studentName: "Kashan Zafar",
                studentId: "232051"
            },
            endpoints: {
                weather: "GET /api/weather/:city  (Parameters: city name)",
                news: "GET /api/news/:country    (Parameters: 2-letter ISO country code)",
                auth: {
                    register: "POST /api/auth/register",
                    login: "POST /api/auth/login",
                    users: "GET /api/auth/users    (Admin access token required)"
                },
                patients: {
                    create: "POST /api/patients    (Admin access token required)",
                    getAll: "GET /api/patients     (Access token required)",
                    getOne: "GET /api/patients/:id (Access token required)",
                    update: "PUT /api/patients/:id (Admin access token required)",
                    delete: "DELETE /api/patients/:id (Admin access token required)"
                }
            }
        });
    }
    next();
});

// Serve static client-side files
app.use(express.static(path.join(__dirname, "public")));

/* ROUTE REGISTERING */
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const newsRoutes = require("./routes/newsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/news", newsRoutes);

/* GLOBAL ERROR HANDLING MIDDLEWARE */
app.use((err, req, res, next) => {
    console.error("Unhandled server exception:", err.stack);
    res.status(500).json({
        success: false,
        message: "An internal server error occurred.",
        error: err.message
    });
});

module.exports = app;
