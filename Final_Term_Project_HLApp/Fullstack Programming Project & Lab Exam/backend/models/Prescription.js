const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  treatment: { type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true }, // e.g. "twice daily"
    duration: { type: String, required: true },  // e.g. "7 days"
    instructions: { type: String },
    reminderTimes: [String], // e.g. ["08:00", "20:00"]
  }],
  diagnosis: { type: String },
  notes: { type: String },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
