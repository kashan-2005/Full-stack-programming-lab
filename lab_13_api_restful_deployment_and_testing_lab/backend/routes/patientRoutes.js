/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: routes/patientRoutes.js - Patient management endpoints (protected by JWT)
 */

const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const controller = require("../controllers/patientController");

/* CREATE A PATIENT RECORD (ADMIN ONLY) */
router.post(
    "/",
    auth("admin"),
    controller.createPatient
);

/* GET ALL PATIENTS (ALL AUTHENTICATED USERS) */
router.get(
    "/",
    auth(),
    controller.getPatients
);

/* GET SINGLE PATIENT BY ID (ALL AUTHENTICATED USERS) */
router.get(
    "/:id",
    auth(),
    controller.getPatient
);

/* UPDATE A PATIENT RECORD (ADMIN ONLY) */
router.put(
    "/:id",
    auth("admin"),
    controller.updatePatient
);

/* DELETE A PATIENT RECORD (ADMIN ONLY) */
router.delete(
    "/:id",
    auth("admin"),
    controller.deletePatient
);

module.exports = router;
