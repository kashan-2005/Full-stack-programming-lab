'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import API from '@/lib/axios';

export default function Topbar({ title, subtitle }) {
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/notifications');
        setNotifications(res.data.data?.slice(0, 8) || []);
        setUnread(res.data.data?.filter(n => !n.isRead).length || 0);
      } catch {}
    };
    if (user) fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
      setUnread(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return d.toLocaleDateString();
  };

  const typeIcon = { appointment: '📅', medication: '💊', followup: '🩺', general: 'ℹ️', alert: '⚠️' };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="topbar-right">
        <div style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
            🔔
            {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
          </button>

          {showNotif && (
            <div className="notif-panel">
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '.9rem' }}>Notifications</span>
                {unread > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '.78rem', cursor: 'pointer', fontWeight: 600 }}>Mark all read</button>}
              </div>
              {notifications.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 20px' }}>
                  <div>🔔</div>
                  <p style={{ fontSize: '.85rem', marginTop: 8 }}>No notifications yet</p>
                </div>
              ) : notifications.map(n => (
                <div key={n._id} className={`notif-item ${!n.isRead ? 'unread' : ''}`}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: '1.1rem' }}>{typeIcon[n.type] || 'ℹ️'}</span>
                    <div>
                      <div className="notif-title">{n.title}</div>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{formatTime(n.createdAt)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', borderRadius: 10, padding: '8px 14px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.875rem' }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '.8rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '.7rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
