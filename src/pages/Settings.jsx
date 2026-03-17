import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Dumbbell, Ruler, LogOut, Trash2, Lock,
  Target, Scale, ChevronRight, Save, Check, AlertTriangle
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; }
  });

  // Profile State
  const [displayName, setDisplayName] = useState(user.username || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Fitness Goals State
  const [goal, setGoal] = useState(localStorage.getItem('gf_goal') || 'BUILD_MUSCLE');
  const [targetWeight, setTargetWeight] = useState(localStorage.getItem('gf_targetWeight') || '');
  const [workoutDays, setWorkoutDays] = useState(localStorage.getItem('gf_workoutDays') || '4');
  const [goalSaved, setGoalSaved] = useState(false);

  // Units State
  const [weightUnit, setWeightUnit] = useState(localStorage.getItem('gf_weightUnit') || 'kg');
  const [heightUnit, setHeightUnit] = useState(localStorage.getItem('gf_heightUnit') || 'cm');
  const [unitsSaved, setUnitsSaved] = useState(false);

  // Account State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const showSaved = (setter) => {
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleSaveProfile = () => {
    const updated = { ...user, username: displayName };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    showSaved(setProfileSaved);
  };

  const handleSaveGoals = () => {
    localStorage.setItem('gf_goal', goal);
    localStorage.setItem('gf_targetWeight', targetWeight);
    localStorage.setItem('gf_workoutDays', workoutDays);
    showSaved(setGoalSaved);
  };

  const handleSaveUnits = () => {
    localStorage.setItem('gf_weightUnit', weightUnit);
    localStorage.setItem('gf_heightUnit', heightUnit);
    showSaved(setUnitsSaved);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword) {
      setPasswordError('Both fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    // Call API
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.message || 'Failed to change password.'); return; }
      showSaved(setPasswordSaved);
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch {
      setPasswordError('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const goals = [
    { id: 'LOSE_WEIGHT', label: 'Lose Weight', emoji: '🔥' },
    { id: 'BUILD_MUSCLE', label: 'Build Muscle', emoji: '💪' },
    { id: 'MAINTAIN', label: 'Maintain', emoji: '⚖️' },
  ];

  const initials = (displayName || user.username || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="settings-page">

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="settings-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="settings-modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Change Password</h3>
            <div className="modal-fields">
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="settings-input"
              />
              <input
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="settings-input"
              />
              {passwordError && <p className="error-msg">{passwordError}</p>}
            </div>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="modal-save-btn" onClick={handleChangePassword}>
                {passwordSaved ? <><Check size={14} /> Saved!</> : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="settings-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="settings-modal danger-modal" onClick={e => e.stopPropagation()}>
            <div className="danger-icon-wrap"><AlertTriangle size={32} /></div>
            <h3 className="modal-title">Delete Account?</h3>
            <p className="modal-desc">This action is permanent and cannot be undone. All your data will be lost.</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="modal-delete-btn" onClick={handleLogout}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="settings-header">
        <h1 className="settings-title">SETTINGS</h1>
        <p className="settings-subtitle">Manage your profile, goals and account preferences</p>
      </div>

      <div className="settings-grid">

        {/* ── PROFILE ── */}
        <section className="settings-card">
          <div className="card-heading">
            <div className="card-icon"><User size={18} /></div>
            <h2 className="card-title">PROFILE</h2>
          </div>

          <div className="avatar-row">
            <div className="avatar-circle">{initials}</div>
            <div className="avatar-meta">
              <span className="avatar-name">{displayName || 'Your Name'}</span>
              <span className="pro-badge">PRO MEMBER</span>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">DISPLAY NAME</label>
            <input
              type="text"
              className="settings-input"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="field-group">
            <label className="field-label">EMAIL</label>
            <input
              type="text"
              className="settings-input disabled-input"
              value={user.email || '—'}
              readOnly
            />
          </div>

          <button className="save-btn" onClick={handleSaveProfile}>
            {profileSaved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Profile</>}
          </button>
        </section>

        {/* ── FITNESS GOALS ── */}
        <section className="settings-card">
          <div className="card-heading">
            <div className="card-icon"><Target size={18} /></div>
            <h2 className="card-title">FITNESS GOALS</h2>
          </div>

          <div className="field-group">
            <label className="field-label">PRIMARY GOAL</label>
            <div className="goal-pills">
              {goals.map(g => (
                <button
                  key={g.id}
                  className={`goal-pill ${goal === g.id ? 'active' : ''}`}
                  onClick={() => setGoal(g.id)}
                >
                  <span>{g.emoji}</span> {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">TARGET WEIGHT (kg)</label>
            <input
              type="number"
              className="settings-input"
              value={targetWeight}
              onChange={e => setTargetWeight(e.target.value)}
              placeholder="e.g. 80"
              min="30"
              max="300"
            />
          </div>

          <div className="field-group">
            <label className="field-label">WORKOUT DAYS / WEEK</label>
            <div className="days-row">
              {[1,2,3,4,5,6,7].map(d => (
                <button
                  key={d}
                  className={`day-chip ${parseInt(workoutDays) === d ? 'active' : ''}`}
                  onClick={() => setWorkoutDays(String(d))}
                >{d}</button>
              ))}
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveGoals}>
            {goalSaved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Goals</>}
          </button>
        </section>

        {/* ── UNITS & PREFERENCES ── */}
        <section className="settings-card">
          <div className="card-heading">
            <div className="card-icon"><Ruler size={18} /></div>
            <h2 className="card-title">UNITS & PREFERENCES</h2>
          </div>

          <div className="field-group">
            <label className="field-label">WEIGHT UNIT</label>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${weightUnit === 'kg' ? 'active' : ''}`}
                onClick={() => setWeightUnit('kg')}
              >kg</button>
              <button
                className={`toggle-btn ${weightUnit === 'lbs' ? 'active' : ''}`}
                onClick={() => setWeightUnit('lbs')}
              >lbs</button>
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">HEIGHT UNIT</label>
            <div className="toggle-group">
              <button
                className={`toggle-btn ${heightUnit === 'cm' ? 'active' : ''}`}
                onClick={() => setHeightUnit('cm')}
              >cm</button>
              <button
                className={`toggle-btn ${heightUnit === 'ft' ? 'active' : ''}`}
                onClick={() => setHeightUnit('ft')}
              >ft / in</button>
            </div>
          </div>

          <button className="save-btn" onClick={handleSaveUnits}>
            {unitsSaved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Preferences</>}
          </button>
        </section>

        {/* ── ACCOUNT ── */}
        <section className="settings-card">
          <div className="card-heading">
            <div className="card-icon"><Lock size={18} /></div>
            <h2 className="card-title">ACCOUNT</h2>
          </div>

          <button className="account-action-btn" onClick={() => setShowPasswordModal(true)}>
            <div className="action-left">
              <Lock size={16} />
              <div>
                <span className="action-title">Change Password</span>
                <span className="action-sub">Update your login credentials</span>
              </div>
            </div>
            <ChevronRight size={16} className="action-chevron" />
          </button>

          <button className="account-action-btn" onClick={handleLogout}>
            <div className="action-left">
              <LogOut size={16} />
              <div>
                <span className="action-title">Logout</span>
                <span className="action-sub">Sign out of your account</span>
              </div>
            </div>
            <ChevronRight size={16} className="action-chevron" />
          </button>

          <div className="danger-zone">
            <span className="danger-label">DANGER ZONE</span>
            <button className="delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 size={14} /> Delete Account
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
