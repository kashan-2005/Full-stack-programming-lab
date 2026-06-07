'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({ appointments: 0, pending: 0, patients: 0, treatments: 0 });
  const [recentApps, setRecentApps] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, tRes] = await Promise.all([API.get('/appointments'), API.get('/treatments')]);
        const apps = aRes.data.data || [];
        const treats = tRes.data.data || [];
        const patientSet = new Set(apps.map(a => a.patient?._id).filter(Boolean));
        setStats({ appointments: apps.length, pending: apps.filter(a => a.status === 'pending').length, patients: patientSet.size, treatments: treats.length });
        setRecentApps(apps.slice(0, 5));
      } catch {}
    };
    load();
  }, []);

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="Doctor Dashboard" subtitle="Manage your appointments and patients" requiredRole="doctor">
      <div className="stats-grid">
        {[
          { label: 'My Appointments', value: stats.appointments, icon: '📅', cls: 'stat-blue' },
          { label: 'Pending Review', value: stats.pending, icon: '⏳', cls: 'stat-yellow' },
          { label: 'My Patients', value: stats.patients, icon: '🧑‍⚕️', cls: 'stat-green' },
          { label: 'Active Treatments', value: stats.treatments, icon: '🩺', cls: 'stat-purple' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📅 My Recent Appointments</span>
          <a href="/doctor/appointments" style={{ color: '#2563eb', fontSize: '.85rem', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Type</th><th>Reason</th><th>Status</th></tr></thead>
            <tbody>
              {recentApps.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No appointments yet</td></tr>
                : recentApps.map(a => (
                  <tr key={a._id}>
                    <td><b>{a.patient?.name}</b></td>
                    <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                    <td>{a.appointmentTime}</td>
                    <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                    <td style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.reason}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
