/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: server.js - Backend server entry point
 */

const app = require("./app");
const connectDB = require("./config/db");

// Establish connection to MongoDB database
connectDB();

// Fetch server listening port
const PORT = process.env.PORT || 5000;

// Listen on configured port
app.listen(PORT, () => {
    console.log("=================================================");
    console.log(`🚀 REST Server initialized on port: ${PORT}`);
    console.log(`🌍 Base URL: http://localhost:${PORT}`);
    console.log(`📝 Submitted by: Hammad Shahzad (232071)`);
    console.log(`📝 Context: Kashan Zafar (232051)`);
    console.log("=================================================");
});
