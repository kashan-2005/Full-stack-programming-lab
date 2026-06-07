'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [statusForm, setStatusForm] = useState({ status: '', notes: '' });
  const { toast } = useToast();

  const fetch = async () => {
    try { const r = await API.get('/appointments'); setAppointments(r.data.data || []); }
    catch { toast('Error loading', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleUpdate = async () => {
    try {
      await API.put(`/appointments/${selected._id}/status`, statusForm);
      toast('Updated!', 'success'); setShowModal(false); fetch();
    } catch { toast('Error', 'error'); }
  };

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;
  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <DashboardLayout title="My Appointments" subtitle="View and update patient appointments" requiredRole="doctor">
      <div className="page-header">
        <div><h1>📅 Appointments</h1></div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'confirmed', 'completed'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Type</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>⏳</td></tr>
                : filtered.map(a => (
                  <tr key={a._id}>
                    <td><b>{a.patient?.name}</b><div style={{ fontSize: '.75rem', color: '#64748b' }}>{a.patient?.phone}</div></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>{a.appointmentTime}</td>
                    <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => { setSelected(a); setStatusForm({ status: a.status, notes: a.notes || '' }); setShowModal(true); }}>⚙️ Update</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Update Appointment"
        footer={<><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleUpdate}>Update</button></>}>
        {selected && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '.875rem' }}>
              <b>Patient:</b> {selected.patient?.name} | <b>Date:</b> {new Date(selected.appointmentDate).toLocaleDateString()} {selected.appointmentTime}
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                {['confirmed', 'completed', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Notes</label>
              <textarea className="form-control" value={statusForm.notes} onChange={e => setStatusForm({ ...statusForm, notes: e.target.value })} placeholder="Add clinical notes..." />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
