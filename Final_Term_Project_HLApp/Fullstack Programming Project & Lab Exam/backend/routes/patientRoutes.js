const express = require('express');
const router = express.Router();
const { getPatients, getPatient, getPatientByUser, createPatient, updatePatient, deletePatient, assignDoctor } = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin', 'doctor'), getPatients);
router.get('/me', protect, authorize('patient'), getPatientByUser);
router.get('/:id', protect, getPatient);
router.post('/', protect, authorize('admin'), createPatient);
router.put('/:id', protect, authorize('admin', 'doctor'), updatePatient);
router.put('/:id/assign-doctor', protect, authorize('admin'), assignDoctor);
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;
