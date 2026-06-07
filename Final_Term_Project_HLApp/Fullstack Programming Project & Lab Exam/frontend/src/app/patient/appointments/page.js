'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = async () => {
    try { const r = await API.get('/appointments'); setAppointments(r.data.data || []); }
    catch { toast('Error loading', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try { await API.put(`/appointments/${id}/cancel`); toast('Appointment cancelled', 'success'); fetch(); }
    catch { toast('Cannot cancel', 'error'); }
  };

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="My Appointments" subtitle="Track all your appointment history">
      <div className="page-header">
        <div><h1>📅 My Appointments ({appointments.length})</h1></div>
        <a href="/patient/book" className="btn btn-primary">+ Book New</a>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>⏳</td></tr>
                : appointments.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No appointments. <a href="/patient/book" style={{ color: '#2563eb' }}>Book one →</a></td></tr>
                : appointments.map(a => (
                  <tr key={a._id}>
                    <td>{a.doctor?.name || <em style={{ color: '#94a3b8' }}>Not assigned</em>}<div style={{ fontSize: '.75rem', color: '#64748b' }}>{a.doctor?.specialization}</div></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>{a.appointmentTime}</td>
                    <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td>
                      {(a.status === 'pending' || a.status === 'confirmed') && (
                        <button className="btn btn-danger btn-sm" onClick={() => handleCancel(a._id)}>❌ Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
