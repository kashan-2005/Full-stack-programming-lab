'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: '', doctorId: '', rejectionReason: '', notes: '' });
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      const [aRes, dRes] = await Promise.all([API.get('/appointments'), API.get('/doctors')]);
      setAppointments(aRes.data.data || []);
      setDoctors(dRes.data.data || []);
    } catch { toast('Error loading data', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const openManage = (a) => {
    setSelected(a);
    setStatusForm({ status: a.status, doctorId: a.doctor?._id || '', rejectionReason: '', notes: '' });
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/appointments/${selected._id}/status`, statusForm);
      toast('Appointment updated!', 'success');
      setShowModal(false); fetchAll();
    } catch (err) { toast(err.response?.data?.message || 'Error', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this appointment?')) return;
    try { await API.delete(`/appointments/${id}`); toast('Deleted', 'success'); fetchAll(); }
    catch { toast('Delete failed', 'error'); }
  };

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;
  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <DashboardLayout title="Appointments" subtitle="Manage all appointment bookings" requiredRole="admin">
      <div className="page-header">
        <div><h1>📅 Appointments ({appointments.length})</h1><p>Approve, reject and manage appointments</p></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', 'pending', 'confirmed', 'rejected', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter(s)} style={{ textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Type</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>⏳ Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No appointments</td></tr>
                : filtered.map(a => (
                  <tr key={a._id}>
                    <td><b>{a.patient?.name || 'N/A'}</b><div style={{ fontSize: '.75rem', color: '#64748b' }}>{a.patient?.phone}</div></td>
                    <td>{a.doctor?.name || <em style={{ color: '#94a3b8' }}>Unassigned</em>}</td>
                    <td><div>{new Date(a.appointmentDate).toLocaleDateString()}</div><div style={{ fontSize: '.75rem', color: '#64748b' }}>{a.appointmentTime}</div></td>
                    <td><span style={{ textTransform: 'capitalize', fontSize: '.8rem' }}>{a.type}</span></td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openManage(a)}>⚙️ Manage</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Manage Appointment"
        footer={<><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" onClick={handleUpdate}>Update</button></>}>
        {selected && (
          <div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '.875rem' }}>
              <div><b>Patient:</b> {selected.patient?.name}</div>
              <div><b>Date:</b> {new Date(selected.appointmentDate).toLocaleDateString()} at {selected.appointmentTime}</div>
              <div><b>Reason:</b> {selected.reason}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-control" value={statusForm.status} onChange={e => setStatusForm({ ...statusForm, status: e.target.value })}>
                {['pending','confirmed','rejected','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Doctor</label>
              <select className="form-control" value={statusForm.doctorId} onChange={e => setStatusForm({ ...statusForm, doctorId: e.target.value })}>
                <option value="">-- Select Doctor --</option>
                {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
              </select>
            </div>
            {statusForm.status === 'rejected' && (
              <div className="form-group">
                <label className="form-label">Rejection Reason</label>
                <textarea className="form-control" value={statusForm.rejectionReason} onChange={e => setStatusForm({ ...statusForm, rejectionReason: e.target.value })} placeholder="Reason for rejection..." />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea className="form-control" value={statusForm.notes} onChange={e => setStatusForm({ ...statusForm, notes: e.target.value })} placeholder="Additional notes..." />
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}
