'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const adminNav = [
  { label: 'Overview', href: '/admin/dashboard', icon: '📊' },
  { label: 'Doctors', href: '/admin/doctors', icon: '👨‍⚕️' },
  { label: 'Patients', href: '/admin/patients', icon: '🧑‍⚕️' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Treatments', href: '/admin/treatments', icon: '🩺' },
  { label: 'Prescriptions', href: '/admin/prescriptions', icon: '💊' },
];

const doctorNav = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: '📊' },
  { label: 'My Appointments', href: '/doctor/appointments', icon: '📅' },
  { label: 'Treatments', href: '/doctor/treatments', icon: '🩺' },
  { label: 'Prescriptions', href: '/doctor/prescriptions', icon: '💊' },
  { label: 'Patients', href: '/doctor/patients', icon: '🧑‍⚕️' },
];

const patientNav = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: '📊' },
  { label: 'Book Appointment', href: '/patient/book', icon: '📅' },
  { label: 'My Appointments', href: '/patient/appointments', icon: '🗓️' },
  { label: 'My Treatments', href: '/patient/treatments', icon: '🩺' },
  { label: 'Prescriptions', href: '/patient/prescriptions', icon: '💊' },
  { label: 'Notifications', href: '/patient/notifications', icon: '🔔' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = user?.role === 'admin' ? adminNav : user?.role === 'doctor' ? doctorNav : patientNav;
  const roleLabel = user?.role === 'admin' ? '🛡️ Admin Panel' : user?.role === 'doctor' ? '👨‍⚕️ Doctor Portal' : '🏥 Patient Portal';

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🏥</div>
        <div>
          <h1>MediCare</h1>
          <span>{roleLabel}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">Navigation</div>
          {navItems.map(item => (
            <button key={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              onClick={() => router.push(item.href)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-label">Account</div>
          <button className="nav-item" onClick={() => router.push('/notifications')}>
            <span className="icon">🔔</span> Notifications
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.1rem' }} title="Logout">🚪</button>
        </div>
      </div>
    </aside>
  );
}
