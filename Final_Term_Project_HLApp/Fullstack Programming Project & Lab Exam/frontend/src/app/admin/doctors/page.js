'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', specialization: '', department: '', experience: '', consultationFee: '', bio: '' });
  const { toast } = useToast();

  const fetch = async () => {
    try { const res = await API.get('/doctors'); setDoctors(res.data.data || []); }
    catch { toast('Failed to load doctors', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditDoc(null); setForm({ name: '', email: '', phone: '', specialization: '', department: '', experience: '', consultationFee: '', bio: '' }); setShowModal(true); };
  const openEdit = (d) => { setEditDoc(d); setForm({ name: d.name, email: d.email, phone: d.phone, specialization: d.specialization, department: d.department, experience: d.experience, consultationFee: d.consultationFee, bio: d.bio || '' }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDoc) { await API.put(`/doctors/${editDoc._id}`, form); toast('Doctor updated!', 'success'); }
      else { await API.post('/doctors', form); toast('Doctor added!', 'success'); }
      setShowModal(false); fetch();
    } catch (err) { toast(err.response?.data?.message || 'Error saving doctor', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this doctor?')) return;
    try { await API.delete(`/doctors/${id}`); toast('Doctor deleted', 'success'); fetch(); }
    catch { toast('Delete failed', 'error'); }
  };

  const filtered = doctors.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()) || d.specialization?.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Manage Doctors" subtitle="Add, update and remove doctor records" requiredRole="admin">
      <div className="page-header">
        <div>
          <h1>👨‍⚕️ Doctors ({doctors.length})</h1>
          <p>Manage all registered doctors in the system</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Doctor</button>
      </div>

      <div className="card">
        <div className="card-header">
          <input className="form-control" style={{ maxWidth: 280 }} placeholder="🔍 Search doctors..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Name</th><th>Specialization</th><th>Department</th><th>Phone</th><th>Experience</th><th>Fee (PKR)</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>⏳ Loading...</td></tr>
                : filtered.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No doctors found</td></tr>
                : filtered.map(d => (
                  <tr key={d._id}>
                    <td><div style={{ fontWeight: 600 }}>{d.name}</div><div style={{ fontSize: '.75rem', color: '#64748b' }}>{d.email}</div></td>
                    <td>{d.specialization}</td>
                    <td>{d.department}</td>
                    <td>{d.phone}</td>
                    <td>{d.experience} yrs</td>
                    <td>{d.consultationFee?.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(d)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d._id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editDoc ? '✏️ Edit Doctor' : '➕ Add New Doctor'}
        footer={<><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" form="doc-form" type="submit">{editDoc ? 'Update' : 'Add Doctor'}</button></>}>
        <form id="doc-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Email *</label><input type="email" className="form-control" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Phone *</label><input className="form-control" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Specialization *</label><input className="form-control" required value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Department *</label><input className="form-control" required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Experience (yrs)</label><input type="number" className="form-control" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Consultation Fee</label><input type="number" className="form-control" value={form.consultationFee} onChange={e => setForm({ ...form, consultationFee: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Bio</label><textarea className="form-control" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
