'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import API from '@/lib/axios';

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try { const r = await API.get('/notifications'); setNotifications(r.data.data || []); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id) => {
    try { await API.put(`/notifications/${id}/read`); fetchNotifications(); } catch {}
  };

  const markAllRead = async () => {
    try { await API.put('/notifications/mark-all-read'); fetchNotifications(); } catch {}
  };

  const deleteNotif = async (id) => {
    try { await API.delete(`/notifications/${id}`); fetchNotifications(); } catch {}
  };

  const typeIcon = { appointment: '📅', medication: '💊', followup: '🩺', general: 'ℹ️', alert: '⚠️' };
  const typeColor = { appointment: '#eff6ff', medication: '#f0fdf4', followup: '#f5f3ff', general: '#f8fafc', alert: '#fffbeb' };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <DashboardLayout title="Notifications" subtitle="Stay updated with your health alerts">
      <div className="page-header">
        <div><h1>🔔 Notifications ({notifications.length})</h1>{unreadCount > 0 && <p>{unreadCount} unread</p>}</div>
        {unreadCount > 0 && <button className="btn btn-outline" onClick={markAllRead}>✅ Mark All Read</button>}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}>⏳ Loading...</div>
        : notifications.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🔔</div><h3>No notifications</h3><p>You're all caught up!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.map(n => (
              <div key={n._id} style={{ background: n.isRead ? '#fff' : (typeColor[n.type] || '#f8fafc'), border: `1px solid ${n.isRead ? '#e2e8f0' : '#bfdbfe'}`, borderRadius: 12, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'all .2s', cursor: 'pointer' }} onClick={() => !n.isRead && markRead(n._id)}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,.1)' }}>{typeIcon[n.type] || '🔔'}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    {n.title}
                    {!n.isRead && <span style={{ width: 8, height: 8, background: '#2563eb', borderRadius: '50%', display: 'inline-block' }} />}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '.875rem', lineHeight: 1.5 }}>{n.message}</div>
                  <div style={{ marginTop: 8, fontSize: '.75rem', color: '#94a3b8' }}>
                    {new Date(n.createdAt).toLocaleString()} · <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{n.type}</span>
                    {!n.isRead && <span style={{ marginLeft: 8, color: '#2563eb' }}>· Click to mark read</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteNotif(n._id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1rem', padding: 4, borderRadius: 6 }}>✕</button>
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  );
}
