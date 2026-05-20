/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: routes/weatherRoutes.js - Weather API routing
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/weatherController");

// Endpoint to fetch weather details for a specific city
// Example: GET /api/weather/london
router.get("/:city", controller.getWeather);

module.exports = router;
