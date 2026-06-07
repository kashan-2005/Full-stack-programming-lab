const express = require('express');
const router = express.Router();
const { getPrescriptions, getPrescription, createPrescription, updatePrescription, deletePrescription } = require('../controllers/prescriptionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescription);
router.post('/', protect, authorize('doctor', 'admin'), createPrescription);
router.put('/:id', protect, authorize('doctor', 'admin'), updatePrescription);
router.delete('/:id', protect, authorize('admin', 'doctor'), deletePrescription);

module.exports = router;
