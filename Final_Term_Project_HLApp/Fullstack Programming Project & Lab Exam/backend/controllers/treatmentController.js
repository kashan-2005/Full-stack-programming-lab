const Treatment = require('../models/Treatment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { createNotification, sendFollowUpReminder } = require('../utils/notificationHelper');

// @desc  Get all treatments
exports.getTreatments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) query.patient = patient._id;
    }
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (doctor) query.doctor = doctor._id;
    }
    const treatments = await Treatment.find(query)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'appointmentDate appointmentTime type')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: treatments.length, data: treatments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single treatment
exports.getTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id)
      .populate('patient', 'name email phone gender bloodGroup allergies')
      .populate('doctor', 'name specialization department')
      .populate('appointment');
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.json({ success: true, data: treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update treatment
exports.updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    res.json({ success: true, data: treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add physical checkup to treatment
exports.addCheckup = async (req, res) => {
  try {
    const { weight, bloodPressure, temperature, heartRate, notes } = req.body;
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    const doctor = await Doctor.findOne({ user: req.user.id });
    treatment.checkups.push({ weight, bloodPressure, temperature, heartRate, notes, conductedBy: doctor?._id, date: new Date() });
    await treatment.save();
    res.json({ success: true, data: treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add follow-up visit
exports.addFollowUp = async (req, res) => {
  try {
    const { scheduledDate, notes } = req.body;
    const treatment = await Treatment.findById(req.params.id).populate('patient');
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    treatment.followUps.push({ scheduledDate, notes, status: 'scheduled' });
    await treatment.save();
    // Notify patient
    const patient = await Patient.findById(treatment.patient._id).populate('user');
    if (patient?.user) {
      await sendFollowUpReminder(patient.user, { scheduledDate });
    }
    res.json({ success: true, data: treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update follow-up status
exports.updateFollowUp = async (req, res) => {
  try {
    const { followUpId, status, completedDate, notes } = req.body;
    const treatment = await Treatment.findById(req.params.id);
    if (!treatment) return res.status(404).json({ success: false, message: 'Treatment not found' });
    const followUp = treatment.followUps.id(followUpId);
    if (!followUp) return res.status(404).json({ success: false, message: 'Follow-up not found' });
    followUp.status = status;
    if (completedDate) followUp.completedDate = completedDate;
    if (notes) followUp.notes = notes;
    await treatment.save();
    res.json({ success: true, data: treatment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
