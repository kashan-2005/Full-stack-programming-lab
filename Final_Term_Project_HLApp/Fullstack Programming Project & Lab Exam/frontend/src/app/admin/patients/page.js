'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [selected, setSelected] = useState(null);
  const [assignDoctorId, setAssignDoctorId] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', gender: 'male', bloodGroup: '', address: '', dateOfBirth: '' });
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      const [pRes, dRes] = await Promise.all([API.get('/patients'), API.get('/doctors')]);
      setPatients(pRes.data.data || []);
      setDoctors(dRes.data.data || []);
    } catch { toast('Failed to load data', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) await API.put(`/patients/${selected._id}`, form);
      else await API.post('/patients', form);
      toast(selected ? 'Patient updated!' : 'Patient added!', 'success');
      setShowModal(false); fetchAll();
    } catch (err) { toast(err.response?.data?.message || 'Error', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this patient?')) return;
    try { await API.delete(`/patients/${id}`); toast('Patient deleted', 'success'); fetchAll(); }
    catch { toast('Delete failed', 'error'); }
  };

  const handleAssign = async () => {
    try { await API.put(`/patients/${selected._id}/assign-doctor`, { doctorId: assignDoctorId }); toast('Doctor assigned!', 'success'); setShowAssign(false); fetchAll(); }
    catch { toast('Assignment failed', 'error'); }
  };

  const filtered = patients.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Manage Patients" subtitle="View and manage all patient records" requiredRole="admin">
      <div className="page-header">
        <div><h1>🧑‍⚕️ Patients ({patients.length})</h1><p>Manage patient records and assignments</p></div>
        <button className="btn btn-primary" onClick={() => { setSelected(null); setForm({ name: '', email: '', phone: '', gender: 'male', bloodGroup: '', address: '', dateOfBirth: '' }); setShowModal(true); }}>+ Add Patient</button>
      </div>

      <div className="card">
        <div className="card-header">
          <input className="form-control" style={{ maxWidth: 280 }} placeholder="🔍 Search patients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Gender</th><th>Blood</th><th>Phone</th><th>Assigned Doctor</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>⏳ Loading...</td></tr>
                : filtered.map(p => (
                  <tr key={p._id}>
                    <td><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '.75rem', color: '#64748b' }}>{p.email}</div></td>
                    <td style={{ textTransform: 'capitalize' }}>{p.gender || '—'}</td>
                    <td>{p.bloodGroup || '—'}</td>
                    <td>{p.phone}</td>
                    <td>{p.assignedDoctor ? <span style={{ color: '#2563eb', fontWeight: 600 }}>{p.assignedDoctor.name}</span> : <span style={{ color: '#94a3b8' }}>Unassigned</span>}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => { setSelected(p); setForm({ name: p.name, email: p.email, phone: p.phone, gender: p.gender || 'male', bloodGroup: p.bloodGroup || '', address: p.address || '', dateOfBirth: p.dateOfBirth?.split('T')[0] || '' }); setShowModal(true); }}>✏️</button>
                        <button className="btn btn-primary btn-sm" onClick={() => { setSelected(p); setAssignDoctorId(''); setShowAssign(true); }}>👨‍⚕️ Assign</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selected ? 'Edit Patient' : 'Add Patient'}
        footer={<><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" form="pat-form" type="submit">{selected ? 'Update' : 'Add'}</button></>}>
        <form id="pat-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Name *</label><input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Date of Birth</label><input type="date" className="form-control" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Gender</label><select className="form-control" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div className="form-group"><label className="form-label">Blood Group</label><select className="form-control" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}><option value="">Select</option>{['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => <option key={b} value={b}>{b}</option>)}</select></div>
          </div>
          <div className="form-group"><label className="form-label">Address</label><input className="form-control" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
        </form>
      </Modal>

      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title={`Assign Doctor to ${selected?.name}`}
        footer={<><button className="btn btn-outline" onClick={() => setShowAssign(false)}>Cancel</button><button className="btn btn-primary" onClick={handleAssign}>Assign</button></>}>
        <div className="form-group">
          <label className="form-label">Select Doctor</label>
          <select className="form-control" value={assignDoctorId} onChange={e => setAssignDoctorId(e.target.value)}>
            <option value="">-- Choose a Doctor --</option>
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialization}</option>)}
          </select>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
