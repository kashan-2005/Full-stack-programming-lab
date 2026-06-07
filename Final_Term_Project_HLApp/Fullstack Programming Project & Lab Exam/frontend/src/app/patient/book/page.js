'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ doctorId: '', appointmentDate: '', appointmentTime: '', type: 'consultation', reason: '', symptoms: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    API.get('/doctors').then(r => setDoctors(r.data.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/appointments', { ...form, symptoms: form.symptoms ? form.symptoms.split(',').map(s => s.trim()) : [] });
      setSuccess(true);
      toast('Appointment booked successfully! Waiting for confirmation.', 'success');
      setTimeout(() => router.push('/patient/appointments'), 2000);
    } catch (err) { toast(err.response?.data?.message || 'Booking failed', 'error'); }
    finally { setLoading(false); }
  };

  const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM'];
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (success) {
    return (
      <DashboardLayout title="Book Appointment" subtitle="Schedule a visit with a doctor">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Appointment Booked!</h2>
            <p style={{ color: '#64748b' }}>Your appointment is pending confirmation from the admin. Redirecting...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Book Appointment" subtitle="Schedule a visit with a doctor">
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="card">
          <div className="card-header"><span className="card-title">📅 New Appointment Request</span></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Doctor</label>
                <select className="form-control" value={form.doctorId} onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                  <option value="">-- Any Available Doctor --</option>
                  {doctors.map(d => (
                    <option key={d._id} value={d._id}>{d.name} — {d.specialization} (Fee: PKR {d.consultationFee?.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Appointment Date *</label>
                  <input type="date" className="form-control" required min={minDate} value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time *</label>
                  <select className="form-control" required value={form.appointmentTime} onChange={e => setForm({ ...form, appointmentTime: e.target.value })}>
                    <option value="">-- Select Time --</option>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Appointment Type</label>
                <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option value="consultation">🩺 Consultation</option>
                  <option value="followup">📋 Follow-up Visit</option>
                  <option value="checkup">🔬 Physical Checkup</option>
                  <option value="emergency">🚨 Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit *</label>
                <textarea className="form-control" required rows={3} placeholder="Describe your symptoms or reason for the appointment..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">Symptoms (comma-separated)</label>
                <input className="form-control" placeholder="e.g. fever, headache, fatigue" value={form.symptoms} onChange={e => setForm({ ...form, symptoms: e.target.value })} />
              </div>

              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '.85rem', color: '#1e40af' }}>
                ℹ️ Your appointment request will be reviewed by admin and confirmed. You'll receive a notification once confirmed.
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
                {loading ? '⏳ Booking...' : '📅 Book Appointment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
