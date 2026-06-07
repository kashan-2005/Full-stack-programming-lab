const express = require('express');
const router = express.Router();
const { getTreatments, getTreatment, updateTreatment, addCheckup, addFollowUp, updateFollowUp } = require('../controllers/treatmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getTreatments);
router.get('/:id', protect, getTreatment);
router.put('/:id', protect, authorize('admin', 'doctor'), updateTreatment);
router.post('/:id/checkup', protect, authorize('doctor'), addCheckup);
router.post('/:id/followup', protect, authorize('admin', 'doctor'), addFollowUp);
router.put('/:id/followup', protect, authorize('admin', 'doctor'), updateFollowUp);

module.exports = router;
