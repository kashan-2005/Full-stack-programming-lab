const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  qualifications: [String],
  experience: { type: Number, default: 0 },
  department: { type: String, required: true },
  availability: [{
    day: String,
    startTime: String,
    endTime: String,
  }],
  consultationFee: { type: Number, default: 0 },
  bio: { type: String },
  rating: { type: Number, default: 4.5 },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', DoctorSchema);
