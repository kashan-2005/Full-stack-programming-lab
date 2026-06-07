'use client';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import API from '@/lib/axios';

export default function DoctorTreatments() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showCheckup, setShowCheckup] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [checkupForm, setCheckupForm] = useState({ weight: '', bloodPressure: '', temperature: '', heartRate: '', notes: '' });
  const [followUpForm, setFollowUpForm] = useState({ scheduledDate: '', notes: '' });
  const { toast } = useToast();

  const fetch = async () => {
    try { const r = await API.get('/treatments'); setTreatments(r.data.data || []); }
    catch { toast('Error loading', 'error'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCheckup = async () => {
    try { await API.post(`/treatments/${selected._id}/checkup`, checkupForm); toast('Checkup recorded!', 'success'); setShowCheckup(false); fetch(); }
    catch { toast('Error', 'error'); }
  };

  const handleFollowUp = async () => {
    try { await API.post(`/treatments/${selected._id}/followup`, followUpForm); toast('Follow-up scheduled!', 'success'); setShowFollowUp(false); fetch(); }
    catch { toast('Error', 'error'); }
  };

  const updateDiagnosis = async (id, diagnosis) => {
    try { await API.put(`/treatments/${id}`, { diagnosis }); toast('Updated!', 'success'); fetch(); }
    catch {}
  };

  const statusBadge = (s) => <span className={`badge badge-${s}`}>{s}</span>;

  return (
    <DashboardLayout title="Treatments" subtitle="Manage patient treatment records" requiredRole="doctor">
      <div className="page-header">
        <div><h1>🩺 My Treatments ({treatments.length})</h1></div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 60 }}>⏳ Loading...</div>
        : treatments.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🩺</div><h3>No treatments yet</h3><p>Treatments appear automatically when appointments are confirmed.</p></div>
        ) : treatments.map(t => (
          <div key={t._id} className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div style={{ fontWeight: 700 }}>🧑‍⚕️ {t.patient?.name}</div>
                <div style={{ fontSize: '.8rem', color: '#64748b', marginTop: 4 }}>Diagnosis: {t.diagnosis} | Started: {new Date(t.startDate || t.createdAt).toLocaleDateString()}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {statusBadge(t.status)}
                <button className="btn btn-outline btn-sm" onClick={() => { setSelected(t); setCheckupForm({ weight: '', bloodPressure: '', temperature: '', heartRate: '', notes: '' }); setShowCheckup(true); }}>🩺 Add Checkup</button>
                <button className="btn btn-primary btn-sm" onClick={() => { setSelected(t); setFollowUpForm({ scheduledDate: '', notes: '' }); setShowFollowUp(true); }}>📅 Follow-up</button>
              </div>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '.875rem' }}>📋 Recent Checkups ({t.checkups?.length || 0})</div>
                  {t.checkups?.slice(-3).map((c, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: '.8rem' }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{new Date(c.date).toLocaleDateString()}</div>
                      {c.weight && <div>Weight: {c.weight} kg</div>}
                      {c.bloodPressure && <div>BP: {c.bloodPressure}</div>}
                      {c.temperature && <div>Temp: {c.temperature}°C</div>}
                      {c.heartRate && <div>HR: {c.heartRate} bpm</div>}
                      {c.notes && <div style={{ color: '#64748b', marginTop: 4 }}>{c.notes}</div>}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 8, fontSize: '.875rem' }}>📅 Follow-up Visits ({t.followUps?.length || 0})</div>
                  {t.followUps?.map((f, i) => (
                    <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: '.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{new Date(f.scheduledDate).toLocaleDateString()}</div>
                        {f.notes && <div style={{ color: '#64748b' }}>{f.notes}</div>}
                      </div>
                      <span className={`badge badge-${f.status}`}>{f.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

      <Modal isOpen={showCheckup} onClose={() => setShowCheckup(false)} title="Add Physical Checkup"
        footer={<><button className="btn btn-outline" onClick={() => setShowCheckup(false)}>Cancel</button><button className="btn btn-primary" onClick={handleCheckup}>Save Checkup</button></>}>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Weight (kg)</label><input type="number" className="form-control" value={checkupForm.weight} onChange={e => setCheckupForm({ ...checkupForm, weight: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Blood Pressure</label><input className="form-control" placeholder="120/80" value={checkupForm.bloodPressure} onChange={e => setCheckupForm({ ...checkupForm, bloodPressure: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Temperature (°C)</label><input type="number" step="0.1" className="form-control" value={checkupForm.temperature} onChange={e => setCheckupForm({ ...checkupForm, temperature: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Heart Rate (bpm)</label><input type="number" className="form-control" value={checkupForm.heartRate} onChange={e => setCheckupForm({ ...checkupForm, heartRate: e.target.value })} /></div>
        </div>
        <div className="form-group"><label className="form-label">Clinical Notes</label><textarea className="form-control" value={checkupForm.notes} onChange={e => setCheckupForm({ ...checkupForm, notes: e.target.value })} /></div>
      </Modal>

      <Modal isOpen={showFollowUp} onClose={() => setShowFollowUp(false)} title="Schedule Follow-up Visit"
        footer={<><button className="btn btn-outline" onClick={() => setShowFollowUp(false)}>Cancel</button><button className="btn btn-primary" onClick={handleFollowUp}>Schedule</button></>}>
        <div className="form-group"><label className="form-label">Follow-up Date *</label><input type="date" className="form-control" value={followUpForm.scheduledDate} onChange={e => setFollowUpForm({ ...followUpForm, scheduledDate: e.target.value })} required /></div>
        <div className="form-group"><label className="form-label">Notes</label><textarea className="form-control" value={followUpForm.notes} onChange={e => setFollowUpForm({ ...followUpForm, notes: e.target.value })} /></div>
      </Modal>
    </DashboardLayout>
  );
}
