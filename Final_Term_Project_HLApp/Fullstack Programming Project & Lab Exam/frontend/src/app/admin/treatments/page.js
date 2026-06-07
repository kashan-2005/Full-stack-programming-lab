'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function AdminTreatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    API.get('/treatments').then(r => setTreatments(r.data.data || [])).catch(() => toast('Error loading treatments', 'error')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try { await API.put(`/treatments/${id}`, { status }); toast('Status updated!', 'success'); const r = await API.get('/treatments'); setTreatments(r.data.data || []); }
    catch { toast('Update failed', 'error'); }
  };

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="Treatments" subtitle="Track all patient treatment progress" requiredRole="admin">
      <div className="page-header">
        <div><h1>🩺 Treatments ({treatments.length})</h1><p>Monitor ongoing and completed treatment cycles</p></div>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Diagnosis</th><th>Status</th><th>Start Date</th><th>Checkups</th><th>Follow-ups</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40 }}>⏳ Loading...</td></tr>
                : treatments.length === 0 ? <tr><td colSpan="8" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No treatments found</td></tr>
                : treatments.map(t => (
                  <tr key={t._id}>
                    <td><b>{t.patient?.name || 'N/A'}</b></td>
                    <td>{t.doctor?.name || '—'}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.diagnosis}</td>
                    <td>{statusBadge(t.status)}</td>
                    <td>{new Date(t.startDate || t.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'center' }}>{t.checkups?.length || 0}</td>
                    <td style={{ textAlign: 'center' }}>{t.followUps?.length || 0}</td>
                    <td>
                      <select className="form-control" style={{ padding: '4px 8px', fontSize: '.78rem', width: 'auto' }} value={t.status}
                        onChange={e => updateStatus(t._id, e.target.value)}>
                        {['ongoing','completed','paused','referred'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
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
