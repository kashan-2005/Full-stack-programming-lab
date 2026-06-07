const Patient = require('../models/Patient');
const User = require('../models/User');

// @desc  Get all patients
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('user', 'name email').populate('assignedDoctor', 'name specialization');
    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single patient
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('user', 'name email').populate('assignedDoctor', 'name specialization department');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get patient by user ID
exports.getPatientByUser = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('assignedDoctor', 'name specialization department phone');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create patient
exports.createPatient = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, allergies, insuranceId } = req.body;
    if (!name || !email || !phone) return res.status(400).json({ success: false, message: 'Name, email, phone required' });
    const password = 'Patient@123';
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, password, role: 'patient', phone });
    const patient = await Patient.create({ user: user._id, name, email, phone, dateOfBirth, gender, bloodGroup, address, emergencyContact, allergies, insuranceId });
    res.status(201).json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update patient
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete patient
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Assign doctor to patient
exports.assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patient = await Patient.findByIdAndUpdate(req.params.id, { assignedDoctor: doctorId }, { new: true }).populate('assignedDoctor', 'name specialization');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.json({ success: true, data: patient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
