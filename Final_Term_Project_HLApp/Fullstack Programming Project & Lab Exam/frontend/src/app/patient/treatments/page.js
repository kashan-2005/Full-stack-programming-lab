'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function PatientTreatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/treatments').then(r => setTreatments(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="My Treatments" subtitle="View your complete treatment history">
      <div className="page-header">
        <div><h1>🩺 My Treatments ({treatments.length})</h1></div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}>⏳ Loading...</div>
        : treatments.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🩺</div><h3>No treatments yet</h3><p>Treatments begin after your appointment is confirmed and a doctor is assigned.</p></div>
        ) : treatments.map(t => (
          <div key={t._id} className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>Diagnosis: {t.diagnosis}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: 4 }}>
                  Doctor: <b>{t.doctor?.name}</b> ({t.doctor?.specialization}) | Started: {new Date(t.startDate || t.createdAt).toLocaleDateString()}
                </div>
              </div>
              {statusBadge(t.status)}
            </div>
            <div className="card-body">
              {t.treatmentPlan && <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '.875rem' }}><b>Treatment Plan:</b> {t.treatmentPlan}</div>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '.9rem' }}>🔬 Physical Checkups ({t.checkups?.length || 0})</div>
                  {t.checkups?.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '.85rem' }}>No checkups recorded</p>
                    : t.checkups?.map((c, i) => (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontSize: '.82rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>📅 {new Date(c.date).toLocaleDateString()}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                          {c.weight && <div>⚖️ {c.weight} kg</div>}
                          {c.bloodPressure && <div>❤️ {c.bloodPressure}</div>}
                          {c.temperature && <div>🌡️ {c.temperature}°C</div>}
                          {c.heartRate && <div>💓 {c.heartRate} bpm</div>}
                        </div>
                        {c.notes && <div style={{ color: '#64748b', marginTop: 6 }}>{c.notes}</div>}
                      </div>
                    ))}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '.9rem' }}>📅 Follow-up Schedule ({t.followUps?.length || 0})</div>
                  {t.followUps?.length === 0 ? <p style={{ color: '#94a3b8', fontSize: '.85rem' }}>No follow-ups scheduled</p>
                    : t.followUps?.map((f, i) => (
                      <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', marginBottom: 10, fontSize: '.82rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>📅 {new Date(f.scheduledDate).toLocaleDateString()}</div>
                          {f.notes && <div style={{ color: '#64748b', marginTop: 4 }}>{f.notes}</div>}
                        </div>
                        {statusBadge(f.status)}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ))}
    </DashboardLayout>
  );
}
