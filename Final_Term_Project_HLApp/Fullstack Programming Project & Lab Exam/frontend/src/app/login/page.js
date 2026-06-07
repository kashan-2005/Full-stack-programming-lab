'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'doctor') router.push('/doctor/dashboard');
      else router.push('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@medicare.com', password: 'Admin@123' });
    if (role === 'doctor') setForm({ email: 'ahmed.khan@medicare.com', password: 'Doctor@123' });
    if (role === 'patient') setForm({ email: 'ali.hassan@patient.com', password: 'Patient@123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div className="logo-icon" style={{ width: 48, height: 48, fontSize: '1.4rem' }}>🏥</div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>MediCare</span>
        </div>
        <h1>Your Health, <span>Our Priority</span></h1>
        <p>A complete healthcare management platform. Book appointments, track treatments, and manage prescriptions all in one place.</p>
        <div className="auth-features">
          {[['🔒', 'Secure JWT Authentication', 'Role-based access for Admin, Doctor & Patient'],
            ['📅', 'Smart Appointment Booking', 'Book, approve, and track appointments easily'],
            ['💊', 'Prescription Management', 'Digital prescriptions with medication reminders'],
            ['🔔', 'Real-time Notifications', 'Instant alerts for appointments and medications']].map(([icon, title, desc]) => (
            <div key={title} className="auth-feature">
              <div className="auth-feature-icon">{icon}</div>
              <div>
                <div style={{ fontWeight: 600, color: '#fff', fontSize: '.9rem' }}>{title}</div>
                <div style={{ fontSize: '.78rem', color: '#94a3b8', marginTop: 2 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Sign in to your MediCare account</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: '.875rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="••••••••" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
              {loading ? '⏳ Signing in...' : '🔐 Sign In'}
            </button>
          </form>

          <div className="auth-divider"><span>Quick Demo Access</span></div>

          <div style={{ display: 'flex', gap: 8 }}>
            {[['admin', '🛡️ Admin', '#ffe4e6', '#9f1239'], ['doctor', '👨‍⚕️ Doctor', '#dbeafe', '#1d4ed8'], ['patient', '🧑 Patient', '#dcfce7', '#166534']].map(([role, label, bg, color]) => (
              <button key={role} onClick={() => fillDemo(role)} style={{ flex: 1, padding: '8px', background: bg, color, border: 'none', borderRadius: 8, fontSize: '.78rem', fontWeight: 600, cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '.875rem', color: '#64748b' }}>
            Don't have an account? <Link href="/register" style={{ color: '#2563eb', fontWeight: 600 }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
