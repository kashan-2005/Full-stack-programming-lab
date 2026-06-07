const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Treatment = require('../models/Treatment');
const { sendAppointmentConfirmation, createNotification } = require('../utils/notificationHelper');

// @desc  Get all appointments (admin) / by doctor / by patient
exports.getAppointments = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (doctor) query.doctor = doctor._id;
    }
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user.id });
      if (patient) query.patient = patient._id;
    }
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization department')
      .sort({ appointmentDate: -1 });
    res.json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single appointment
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone bloodGroup')
      .populate('doctor', 'name specialization department phone');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Book appointment (patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, appointmentTime, reason, type, symptoms } = req.body;
    if (!appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({ success: false, message: 'Date, time, and reason are required' });
    }
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
    const appointment = await Appointment.create({
      patient: patient._id,
      patientUser: req.user.id,
      doctor: doctorId || null,
      appointmentDate,
      appointmentTime,
      reason,
      type: type || 'consultation',
      symptoms: symptoms || [],
    });
    await createNotification({
      recipientId: req.user.id,
      title: 'Appointment Booked',
      message: `Your appointment request for ${new Date(appointmentDate).toDateString()} at ${appointmentTime} has been submitted and is pending confirmation.`,
      type: 'appointment',
      relatedId: appointment._id,
      relatedModel: 'Appointment',
    });
    res.status(201).json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update appointment status (admin/doctor)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, doctorId, rejectionReason, notes } = req.body;
    const appointment = await Appointment.findById(req.params.id).populate('patientUser');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = status;
    if (doctorId) appointment.doctor = doctorId;
    if (notes) appointment.notes = notes;
    if (rejectionReason) appointment.rejectionReason = rejectionReason;
    if (status === 'confirmed') appointment.confirmedAt = new Date();
    if (status === 'completed') appointment.completedAt = new Date();
    await appointment.save();

    // Send notifications
    if (appointment.patientUser) {
      if (status === 'confirmed') {
        await sendAppointmentConfirmation(appointment.patientUser, appointment);
        // Auto-create treatment when confirmed
        if (doctorId) {
          const patient = await Patient.findOne({ user: appointment.patientUser._id });
          await Treatment.create({ patient: patient._id, doctor: doctorId, appointment: appointment._id, diagnosis: 'Pending diagnosis' });
        }
      } else if (status === 'rejected') {
        await createNotification({
          recipientId: appointment.patientUser._id,
          title: 'Appointment Rejected',
          message: `Your appointment on ${new Date(appointment.appointmentDate).toDateString()} has been rejected. Reason: ${rejectionReason || 'Not specified'}`,
          type: 'appointment',
        });
      }
    }
    res.json({ success: true, data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Cancel appointment (patient)
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    appointment.status = 'cancelled';
    await appointment.save();
    res.json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete appointment (admin)
exports.deleteAppointment = async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
