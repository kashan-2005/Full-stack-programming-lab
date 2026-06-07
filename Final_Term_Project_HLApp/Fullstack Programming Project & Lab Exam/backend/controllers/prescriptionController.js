const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { createNotification, sendMedicationReminder } = require('../utils/notificationHelper');

// @desc  Get all prescriptions
exports.getPrescriptions = async (req, res) => {
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
    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .populate('appointment', 'appointmentDate')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: prescriptions.length, data: prescriptions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single prescription
exports.getPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone dateOfBirth bloodGroup')
      .populate('doctor', 'name specialization department')
      .populate('appointment');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create prescription (doctor)
exports.createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, treatmentId, medications, diagnosis, notes, validUntil } = req.body;
    if (!patientId || !medications || medications.length === 0) {
      return res.status(400).json({ success: false, message: 'Patient and at least one medication required' });
    }
    const doctor = await Doctor.findOne({ user: req.user.id });
    const prescription = await Prescription.create({
      patient: patientId,
      doctor: doctor?._id || req.body.doctorId,
      appointment: appointmentId,
      treatment: treatmentId,
      medications,
      diagnosis,
      notes,
      validUntil,
    });
    // Send medication reminders
    const patient = await Patient.findById(patientId).populate('user');
    if (patient?.user) {
      for (const med of medications) {
        await sendMedicationReminder(patient.user, med);
      }
    }
    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update prescription
exports.updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.json({ success: true, data: prescription });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete prescription
exports.deletePrescription = async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Prescription deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
