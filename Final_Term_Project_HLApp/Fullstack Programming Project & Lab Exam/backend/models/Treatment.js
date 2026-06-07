const mongoose = require('mongoose');

const TreatmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  diagnosis: { type: String, required: true },
  treatmentPlan: { type: String },
  status: { type: String, enum: ['ongoing', 'completed', 'paused', 'referred'], default: 'ongoing' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  checkups: [{
    date: { type: Date, default: Date.now },
    weight: Number,
    bloodPressure: String,
    temperature: Number,
    heartRate: Number,
    notes: String,
    conductedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  }],
  followUps: [{
    scheduledDate: Date,
    completedDate: Date,
    status: { type: String, enum: ['scheduled', 'completed', 'missed'], default: 'scheduled' },
    notes: String,
  }],
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Treatment', TreatmentSchema);
