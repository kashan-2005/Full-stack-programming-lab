const express = require('express');
const router = express.Router();
const { getAppointments, getAppointment, bookAppointment, updateAppointmentStatus, cancelAppointment, deleteAppointment } = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointment);
router.post('/', protect, authorize('patient'), bookAppointment);
router.put('/:id/status', protect, authorize('admin', 'doctor'), updateAppointmentStatus);
router.put('/:id/cancel', protect, authorize('patient'), cancelAppointment);
router.delete('/:id', protect, authorize('admin'), deleteAppointment);

module.exports = router;
