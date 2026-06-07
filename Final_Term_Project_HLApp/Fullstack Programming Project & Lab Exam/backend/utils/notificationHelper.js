const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EMAIL SIMULATED] To: ${to} | Subject: ${subject}`);
      return { success: true, simulated: true };
    }
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error('Email error:', err.message);
    return { success: false, error: err.message };
  }
};

exports.createNotification = async ({ recipientId, title, message, type, relatedId, relatedModel, channel = 'in-app' }) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      relatedId,
      relatedModel,
      channel,
      sentAt: new Date(),
    });
    return notification;
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
};

exports.sendAppointmentConfirmation = async (user, appointment) => {
  await exports.createNotification({
    recipientId: user._id,
    title: 'Appointment Confirmed',
    message: `Your appointment on ${new Date(appointment.appointmentDate).toDateString()} at ${appointment.appointmentTime} has been confirmed.`,
    type: 'appointment',
    relatedId: appointment._id,
    relatedModel: 'Appointment',
  });
  await exports.sendEmail({
    to: user.email,
    subject: 'Appointment Confirmed – MediCare',
    html: `<h2>Appointment Confirmed</h2><p>Dear ${user.name},</p><p>Your appointment on <b>${new Date(appointment.appointmentDate).toDateString()}</b> at <b>${appointment.appointmentTime}</b> has been confirmed.</p>`,
  });
};

exports.sendMedicationReminder = async (user, medication) => {
  await exports.createNotification({
    recipientId: user._id,
    title: 'Medication Reminder',
    message: `Time to take your medication: ${medication.name} - ${medication.dosage}`,
    type: 'medication',
  });
};

exports.sendFollowUpReminder = async (user, followUp) => {
  await exports.createNotification({
    recipientId: user._id,
    title: 'Follow-up Visit Reminder',
    message: `You have a follow-up visit scheduled for ${new Date(followUp.scheduledDate).toDateString()}.`,
    type: 'followup',
  });
};
