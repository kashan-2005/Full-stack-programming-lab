'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    API.get('/prescriptions').then(r => setPrescriptions(r.data.data || [])).catch(() => toast('Error loading', 'error')).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this prescription?')) return;
    try { await API.delete(`/prescriptions/${id}`); toast('Deleted', 'success'); const r = await API.get('/prescriptions'); setPrescriptions(r.data.data || []); }
    catch { toast('Delete failed', 'error'); }
  };

  return (
    <DashboardLayout title="Prescriptions" subtitle="All prescriptions issued by doctors" requiredRole="admin">
      <div className="page-header">
        <div><h1>💊 Prescriptions ({prescriptions.length})</h1><p>View and manage all issued prescriptions</p></div>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Medications</th><th>Date</th><th>Valid Until</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>⏳ Loading...</td></tr>
                : prescriptions.length === 0 ? <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No prescriptions</td></tr>
                : prescriptions.map(p => (
                  <tr key={p._id}>
                    <td><b>{p.patient?.name || 'N/A'}</b></td>
                    <td>{p.doctor?.name || '—'}</td>
                    <td>{p.diagnosis || '—'}</td>
                    <td>
                      {p.medications?.map((m, i) => (
                        <div key={i} style={{ fontSize: '.75rem' }}>💊 <b>{m.name}</b> — {m.dosage} — {m.frequency}</div>
                      ))}
                    </td>
                    <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>{p.validUntil ? new Date(p.validUntil).toLocaleDateString() : '—'}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>🗑️</button></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
