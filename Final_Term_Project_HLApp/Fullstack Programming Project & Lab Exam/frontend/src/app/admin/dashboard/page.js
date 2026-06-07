'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, pending: 0, confirmed: 0, treatments: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docRes, patRes, appRes, treatRes] = await Promise.all([
          API.get('/doctors'), API.get('/patients'), API.get('/appointments'), API.get('/treatments')
        ]);
        const apps = appRes.data.data || [];
        setStats({
          doctors: docRes.data.count || 0,
          patients: patRes.data.count || 0,
          appointments: apps.length,
          pending: apps.filter(a => a.status === 'pending').length,
          confirmed: apps.filter(a => a.status === 'confirmed').length,
          treatments: treatRes.data.count || 0,
        });
        setRecentAppointments(apps.slice(0, 6));
      } catch {} finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Overview of the entire healthcare system" requiredRole="admin">
      <div className="stats-grid">
        {[
          { label: 'Total Doctors', value: stats.doctors, icon: '👨‍⚕️', cls: 'stat-blue' },
          { label: 'Total Patients', value: stats.patients, icon: '🧑‍⚕️', cls: 'stat-green' },
          { label: 'Total Appointments', value: stats.appointments, icon: '📅', cls: 'stat-yellow' },
          { label: 'Pending Approval', value: stats.pending, icon: '⏳', cls: 'stat-red' },
          { label: 'Confirmed', value: stats.confirmed, icon: '✅', cls: 'stat-green' },
          { label: 'Active Treatments', value: stats.treatments, icon: '🩺', cls: 'stat-purple' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div>
              <div className="stat-value">{loading ? '...' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <div className="stat-icon">{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">📅 Recent Appointments</span>
          <a href="/admin/appointments" style={{ color: '#2563eb', fontSize: '.85rem', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No appointments yet</td></tr>
              ) : recentAppointments.map(a => (
                <tr key={a._id}>
                  <td><b>{a.patient?.name || 'N/A'}</b></td>
                  <td>{a.doctor?.name || <span style={{ color: '#94a3b8' }}>Unassigned</span>}</td>
                  <td>{new Date(a.appointmentDate).toLocaleDateString()}</td>
                  <td>{a.appointmentTime}</td>
                  <td><span style={{ textTransform: 'capitalize', fontSize: '.8rem' }}>{a.type}</span></td>
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
