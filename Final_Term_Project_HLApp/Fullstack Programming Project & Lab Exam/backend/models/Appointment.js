const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patientUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  type: { type: String, enum: ['consultation', 'followup', 'checkup', 'emergency'], default: 'consultation' },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'completed', 'cancelled'], default: 'pending' },
  reason: { type: String, required: true },
  notes: { type: String },
  symptoms: [String],
  fee: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  rejectionReason: { type: String },
  confirmedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
