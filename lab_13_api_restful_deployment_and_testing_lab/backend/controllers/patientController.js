/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: controllers/patientController.js - CRUD controller logic for Patient records
 */

const Patient = require("../models/Patient");

/* CREATE */
exports.createPatient = async (req, res) => {
    try {
        const { name, age, disease, contact } = req.body;

        // Basic validation
        if (!name || !age || !disease || !contact) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields: name, age, disease, contact."
            });
        }

        const patient = await Patient.create({ name, age, disease, contact });
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create patient record.",
            error: error.message
        });
    }
};

/* GET ALL */
exports.getPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient records.",
            error: error.message
        });
    }
};

/* GET ONE BY ID */
exports.getPatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found."
            });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch patient record.",
            error: error.message
        });
    }
};

/* UPDATE BY ID */
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found to update."
            });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update patient record.",
            error: error.message
        });
    }
};

/* DELETE BY ID */
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found to delete."
            });
        }
        res.status(200).json({
            success: true,
            message: "Patient deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete patient record.",
            error: error.message
        });
    }
};
