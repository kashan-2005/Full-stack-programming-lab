/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: routes/newsRoutes.js - News API routing
 */

const express = require("express");
const router = express.Router();
const controller = require("../controllers/newsController");

// Endpoint to fetch news headlines for a specific country code
// Example: GET /api/news/us
router.get("/:country", controller.getNews);

module.exports = router;
