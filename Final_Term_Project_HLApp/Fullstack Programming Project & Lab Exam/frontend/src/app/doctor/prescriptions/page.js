'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ patientId: '', diagnosis: '', notes: '', validUntil: '', medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '', reminderTimes: ['08:00'] }] });
  const { toast } = useToast();

  const fetchAll = async () => {
    try {
      const [pRes, patRes] = await Promise.all([API.get('/prescriptions'), API.get('/patients')]);
      setPrescriptions(pRes.data.data || []);
      setPatients(patRes.data.data || []);
    } catch { toast('Error loading', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const addMed = () => setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '', reminderTimes: ['08:00'] }] });
  const removeMed = (i) => setForm({ ...form, medications: form.medications.filter((_, idx) => idx !== i) });
  const updateMed = (i, field, value) => setForm({ ...form, medications: form.medications.map((m, idx) => idx === i ? { ...m, [field]: value } : m) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/prescriptions', { patientId: form.patientId, medications: form.medications, diagnosis: form.diagnosis, notes: form.notes, validUntil: form.validUntil });
      toast('Prescription added!', 'success');
      setShowModal(false); fetchAll();
    } catch (err) { toast(err.response?.data?.message || 'Error', 'error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try { await API.delete(`/prescriptions/${id}`); toast('Deleted', 'success'); fetchAll(); }
    catch { toast('Error', 'error'); }
  };

  return (
    <DashboardLayout title="Prescriptions" subtitle="Issue and manage patient prescriptions" requiredRole="doctor">
      <div className="page-header">
        <div><h1>💊 Prescriptions ({prescriptions.length})</h1></div>
        <button className="btn btn-primary" onClick={() => { setForm({ patientId: '', diagnosis: '', notes: '', validUntil: '', medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }] }); setShowModal(true); }}>+ New Prescription</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Diagnosis</th><th>Medications</th><th>Date Issued</th><th>Valid Until</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>⏳</td></tr>
                : prescriptions.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No prescriptions yet</td></tr>
                : prescriptions.map(p => (
                  <tr key={p._id}>
                    <td><b>{p.patient?.name}</b></td>
                    <td>{p.diagnosis || '—'}</td>
                    <td>{p.medications?.map((m, i) => <div key={i} style={{ fontSize: '.75rem' }}>💊 {m.name} — {m.dosage}</div>)}</td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>{p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="💊 New Prescription"
        footer={<><button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button><button className="btn btn-primary" form="rx-form" type="submit">Issue Prescription</button></>}>
        <form id="rx-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select className="form-control" required value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })}>
              <option value="">-- Select Patient --</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Diagnosis</label><input className="form-control" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Valid Until</label><input type="date" className="form-control" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} /></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, fontSize: '.875rem', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Medications <button type="button" className="btn btn-outline btn-sm" onClick={addMed}>+ Add</button>
            </div>
            {form.medications.map((m, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '14px', marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <b style={{ fontSize: '.85rem' }}>Medication {i + 1}</b>
                  {i > 0 && <button type="button" onClick={() => removeMed(i)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>✕</button>}
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Name *</label><input className="form-control" required value={m.name} onChange={e => updateMed(i, 'name', e.target.value)} placeholder="e.g. Panadol" /></div>
                  <div className="form-group"><label className="form-label">Dosage *</label><input className="form-control" required value={m.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" /></div>
                  <div className="form-group"><label className="form-label">Frequency *</label><input className="form-control" required value={m.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} placeholder="e.g. Twice daily" /></div>
                  <div className="form-group"><label className="form-label">Duration *</label><input className="form-control" required value={m.duration} onChange={e => updateMed(i, 'duration', e.target.value)} placeholder="e.g. 7 days" /></div>
                </div>
                <div className="form-group"><label className="form-label">Instructions</label><input className="form-control" value={m.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)} placeholder="e.g. Take after meals" /></div>
              </div>
            ))}
          </div>
          <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
