'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/patients').then(r => setPatients(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Patients" subtitle="View patients assigned to you" requiredRole="doctor">
      <div className="page-header"><div><h1>🧑‍⚕️ Patients ({patients.length})</h1></div></div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Patient</th><th>Gender</th><th>Blood Group</th><th>Phone</th><th>Allergies</th><th>Address</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>⏳</td></tr>
                : patients.length === 0 ? <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No patients assigned yet</td></tr>
                : patients.map(p => (
                  <tr key={p._id}>
                    <td><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: '.75rem', color: '#64748b' }}>{p.email}</div></td>
                    <td style={{ textTransform: 'capitalize' }}>{p.gender || '—'}</td>
                    <td>{p.bloodGroup || '—'}</td>
                    <td>{p.phone}</td>
                    <td>{p.allergies?.length > 0 ? p.allergies.join(', ') : <span style={{ color: '#94a3b8' }}>None</span>}</td>
                    <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address || '—'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
