'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function PatientDashboard() {
  const [stats, setStats] = useState({ appointments: 0, pending: 0, prescriptions: 0, treatments: 0 });
  const [recent, setRecent] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, pRes, tRes, nRes] = await Promise.all([
          API.get('/appointments'), API.get('/prescriptions'), API.get('/treatments'), API.get('/notifications')
        ]);
        const apps = aRes.data.data || [];
        setStats({ appointments: apps.length, pending: apps.filter(a => a.status === 'pending').length, prescriptions: pRes.data.count || 0, treatments: tRes.data.count || 0 });
        setRecent(apps.slice(0, 4));
        setNotifications((nRes.data.data || []).slice(0, 5));
      } catch {}
    };
    load();
  }, []);

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;
  const typeIcon = { appointment: '📅', medication: '💊', followup: '🩺', general: 'ℹ️', alert: '⚠️' };

  return (
    <DashboardLayout title="My Dashboard" subtitle="Track your health journey">
      <div className="stats-grid">
        {[
          { label: 'My Appointments', value: stats.appointments, icon: '📅', cls: 'stat-blue' },
          { label: 'Pending', value: stats.pending, icon: '⏳', cls: 'stat-yellow' },
          { label: 'Prescriptions', value: stats.prescriptions, icon: '💊', cls: 'stat-green' },
          { label: 'Treatments', value: stats.treatments, icon: '🩺', cls: 'stat-purple' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">📅 My Appointments</span>
            <a href="/patient/appointments" style={{ color: '#2563eb', fontSize: '.85rem', fontWeight: 600 }}>View All →</a>
          </div>
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Doctor</th><th>Date</th><th>Type</th><th>Status</th></tr></thead>
              <tbody>
                {recent.length === 0 ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>No appointments yet. <a href="/patient/book" style={{ color: '#2563eb' }}>Book now →</a></td></tr>
                  : recent.map(a => (
                    <tr key={a._id}>
                      <td>{a.doctor?.name || <em style={{ color: '#94a3b8' }}>Not assigned</em>}</td>
                      <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                      <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                      <td>{statusBadge(a.status)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
            <a href="/patient/book" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>📅 Book New Appointment</a>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🔔 Notifications</span>
            <a href="/patient/notifications" style={{ color: '#2563eb', fontSize: '.85rem', fontWeight: 600 }}>View All →</a>
          </div>
          <div>
            {notifications.length === 0 ? (
              <div className="empty-state" style={{ padding: '30px' }}><div className="empty-state-icon">🔔</div><p>No new notifications</p></div>
            ) : notifications.map(n => (
              <div key={n._id} style={{ padding: '12px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.1rem' }}>{typeIcon[n.type] || '🔔'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '.85rem' }}>{n.title}</div>
                  <div style={{ fontSize: '.78rem', color: '#64748b', marginTop: 2 }}>{n.message}</div>
                </div>
                {!n.isRead && <div style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%', marginTop: 4, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
