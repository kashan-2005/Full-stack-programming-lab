const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['appointment', 'medication', 'followup', 'general', 'alert'], default: 'general' },
  isRead: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedModel: { type: String },
  scheduledFor: { type: Date },
  sentAt: { type: Date },
  channel: { type: String, enum: ['in-app', 'email', 'sms'], default: 'in-app' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
