const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodGroup: { type: String },
  address: { type: String },
  emergencyContact: { name: String, phone: String, relation: String },
  medicalHistory: [{ condition: String, diagnosedDate: Date, notes: String }],
  allergies: [String],
  assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  insuranceId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
