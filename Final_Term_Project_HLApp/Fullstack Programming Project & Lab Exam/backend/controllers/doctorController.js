const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc  Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email role');
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single doctor
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create doctor (admin)
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, phone, specialization, department, experience, consultationFee, qualifications, bio, availability } = req.body;
    if (!name || !email || !phone || !specialization || !department) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }
    // Create user account for doctor
    const password = 'Doctor@123'; // default password
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, password, role: 'doctor', phone });
    }
    const doctor = await Doctor.create({ user: user._id, name, email, phone, specialization, department, experience, consultationFee, qualifications, bio, availability });
    res.status(201).json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
