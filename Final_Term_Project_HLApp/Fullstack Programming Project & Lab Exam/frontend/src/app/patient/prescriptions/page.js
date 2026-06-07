'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/prescriptions').then(r => setPrescriptions(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Prescriptions" subtitle="View all prescriptions and medication schedules">
      <div className="page-header">
        <div><h1>💊 My Prescriptions ({prescriptions.length})</h1></div>
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 60 }}>⏳ Loading...</div>
        : prescriptions.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💊</div><h3>No prescriptions yet</h3></div>
        ) : prescriptions.map(p => (
          <div key={p._id} className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div>
                <div style={{ fontWeight: 700 }}>Prescribed by Dr. {p.doctor?.name}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b' }}>Date: {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
              {p.isActive ? <span className="badge badge-confirmed">Active</span> : <span className="badge badge-cancelled">Expired</span>}
            </div>
            <div className="card-body">
              {p.diagnosis && <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: '.875rem' }}><b>Diagnosis:</b> {p.diagnosis}</div>}
              <div style={{ fontWeight: 600, marginBottom: 12 }}>💊 Medications</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
                {p.medications?.map((m, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>💊 {m.name}</div>
                    <div style={{ fontSize: '.82rem', display: 'grid', gap: 4 }}>
                      <div>📏 <b>Dosage:</b> {m.dosage}</div>
                      <div>🔁 <b>Frequency:</b> {m.frequency}</div>
                      <div>📅 <b>Duration:</b> {m.duration}</div>
                      {m.instructions && <div style={{ color: '#64748b', fontStyle: 'italic' }}>ℹ️ {m.instructions}</div>}
                      {m.reminderTimes?.length > 0 && (
                        <div style={{ marginTop: 6 }}>⏰ <b>Reminders:</b> {m.reminderTimes.join(', ')}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {p.notes && <div style={{ marginTop: 14, padding: '10px 14px', background: '#fffbeb', borderRadius: 8, fontSize: '.85rem' }}>📝 {p.notes}</div>}
            </div>
          </div>
        ))}
    </DashboardLayout>
  );
}
