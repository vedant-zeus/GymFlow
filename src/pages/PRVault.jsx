import React, { useState, useEffect } from 'react';
import { PenSquare, ChevronDown, Trophy, Medal, Award, MoveDown, MoveUp, Dumbbell, Activity, Check, Lock } from 'lucide-react';
import axios from 'axios';
import { convertWeight, toKg, weightLabel } from '../utils/unitConversion';
import './PRVault.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const initialLifts = [
  { id: 'Deadlift', name: 'DEADLIFT', weight: 0, date: '-', iconType: 'Dumbbell', notes: '' },
  { id: 'Squat', name: 'SQUAT', weight: 0, date: '-', iconType: 'MoveDown', notes: '' },
  { id: 'Bench Press', name: 'BENCH PRESS', weight: 0, date: '-', iconType: 'Activity', notes: '' },
  { id: 'Overhead Press', name: 'OVERHEAD PRESS', weight: 0, date: '-', iconType: 'MoveUp', notes: '' }
];

const iconMap = {
  'Dumbbell': Dumbbell,
  'MoveDown': MoveDown,
  'Activity': Activity,
  'MoveUp': MoveUp
};

const badgeMilestones = [
  { id: 'squat_100', exerciseId: 'Squat', weight: 100, name: 'CENTURION', desc: '100KG Squat Club', icon: Trophy },
  { id: 'dl_140', exerciseId: 'Deadlift', weight: 140, name: 'IRON GRIP', desc: '140KG Deadlift Club', icon: Medal },
  { id: 'bench_100', exerciseId: 'Bench Press', weight: 100, name: 'PLATE MASTER', desc: '100KG Bench Press', icon: Award },
  { id: 'ohp_60', exerciseId: 'Overhead Press', weight: 60, name: 'TITAN SHOULDER', desc: '60KG Overhead Press', icon: Activity },
  { id: 'dl_200', exerciseId: 'Deadlift', weight: 200, name: 'BEAST MODE', desc: '200KG+ Deadlift', icon: Trophy }
];

const PRVault = () => {
  const [lifts, setLifts] = useState(initialLifts);
  const [history, setHistory] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const [logLift, setLogLift] = useState('Deadlift');
  const [logWeight, setLogWeight] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPRs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/pr`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updatedLifts = initialLifts.map(l => {
        const dbPR = res.data.find(d => d.exercise_id === l.id);
        if (dbPR) {
          return {
            ...l,
            weight: dbPR.weight,
            notes: dbPR.notes,
            date: new Date(dbPR.logged_at).toLocaleDateString()
          };
        }
        return l;
      });
      setLifts(updatedLifts);
    } catch (err) {
      console.error('Error fetching PRs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (exerciseId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/api/pr/history/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    fetchPRs();
    fetchHistory(logLift);
  }, []);

  const handleUpdateClick = (lift) => {
    setEditingCard(lift.id);
    // Show the value in the user's preferred unit for editing
    setEditValue(convertWeight(lift.weight, 0));
  };

  const handleSaveEdit = async (liftId) => {
    try {
      const token = localStorage.getItem('token');
      const lift = lifts.find(l => l.id === liftId);
      // Convert from display unit back to KG for storage
      const weightInKg = toKg(parseFloat(editValue));
      await axios.post(`${API_URL}/api/pr`, {
        exercise_id: liftId,
        exercise_name: lift.name,
        weight: weightInKg,
        notes: ''
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingCard(null);
      fetchPRs();
      if (liftId === logLift) fetchHistory(liftId);
    } catch (err) {
      alert('Failed to save PR');
    }
  };

  const handleLogRecord = async () => {
    if (!logWeight) return;
    try {
      const token = localStorage.getItem('token');
      const lift = lifts.find(l => l.id === logLift);
      // Convert from display unit back to KG for storage
      const weightInKg = toKg(parseFloat(logWeight));
      await axios.post(`${API_URL}/api/pr`, {
        exercise_id: logLift,
        exercise_name: lift.name,
        weight: weightInKg,
        notes: logNotes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLogWeight('');
      setLogNotes('');
      fetchPRs();
      fetchHistory(logLift);
    } catch (err) {
      alert('Failed to log record');
    }
  };

  // totalLifted is always in KG internally for rank calculation
  const totalLiftedKg = lifts.reduce((sum, lift) => sum + Number(lift.weight), 0);
  // Display version in user's preferred unit
  const totalLiftedDisplay = convertWeight(totalLiftedKg, 0);
  const unlockedBadges = badgeMilestones.filter(m => {
    const lift = lifts.find(l => l.id === m.exerciseId);
    return lift && lift.weight >= m.weight; // comparison always in KG
  });

  const getRank = () => {
    if (totalLiftedKg > 800) return 'ELITE';
    if (totalLiftedKg > 500) return 'ADVANCED';
    if (totalLiftedKg > 300) return 'INTERMEDIATE';
    return 'NOVICE';
  };

  return (
    <div className="pr-vault-page">
      {/* Header Section */}
      <div className="vault-header-section">
        <div className="vault-hero">
          <h1 className="vault-title">PEAK PERFORMANCE</h1>
          <p className="vault-subtitle">Recording the iron that forged you. Every plate counts toward the legend.</p>
        </div>
        <div className="vault-stats">
          <div className="stat-box">
            <span className="stat-label">TOTAL LIFTED</span>
            <span className="stat-value">{totalLiftedDisplay.toLocaleString()} {weightLabel()}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">RANK</span>
            <span className="stat-value text-white">{getRank()}</span>
          </div>
        </div>
      </div>

      {/* Major Lifts Cards */}
      <div className="major-lifts-grid">
        {lifts.map(lift => {
          const IconComponent = iconMap[lift.iconType];
          
          return (
            <div className="lift-card" key={lift.id}>
              <IconComponent className="lift-watermark" size={120} />
              <div className="lift-card-content">
                <span className="lift-label">MAJOR LIFT</span>
                <h3 className="lift-name">{lift.name}</h3>

                {editingCard === lift.id ? (
                  <div className="lift-record edit-mode" style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, position: 'relative' }}>
                    <input 
                      type="number" 
                      value={editValue} /* value is in display unit */ 
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ width: '80px', fontSize: '32px', fontWeight: '900', fontStyle: 'italic', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', borderRadius: '4px', padding: '4px' }}
                      autoFocus
                    />
                    <span className="lift-unit">{weightLabel()}</span>
                    <button onClick={() => handleSaveEdit(lift.id)} style={{ background: 'var(--accent-green)', color: '#000', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Check size={20} style={{ strokeWidth: 3 }} />
                    </button>
                  </div>
                ) : (
                  <div className="lift-record">
                    <span className="lift-weight">{convertWeight(lift.weight, 0) || 0}</span>
                    <span className="lift-unit">{weightLabel()}</span>
                  </div>
                )}
                
                {lift.notes && (
                  <p className="lift-notes" style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '12px', zIndex: 10, position: 'relative' }}>
                    "{lift.notes}"
                  </p>
                )}

                <p className="lift-date" style={{ marginTop: lift.notes ? '8px' : '12px' }}>LAST UPDATED: {lift.date}</p>
                
                {editingCard !== lift.id && (
                  <button className="update-btn" onClick={() => handleUpdateClick(lift)}>
                    <PenSquare size={14} /> UPDATE PR
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Chart & Hall of Fame */}
      <div className="middle-section">
        {/* Performance History Chart */}
        <div className="chart-container">
          <div className="section-header">
            <h2 className="section-title">PERFORMANCE HISTORY</h2>
            <select 
              className="dropdown" 
              value={logLift} 
              onChange={(e) => {
                setLogLift(e.target.value);
                fetchHistory(e.target.value);
              }}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--accent-green)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}
            >
              {lifts.map(l => <option key={l.id} value={l.id} style={{ background: '#000' }}>{l.name}</option>)}
            </select>
          </div>
          
          <div className="bar-chart">
            {history.length > 0 ? history.map((h, i) => (
              <div className="bar-column" key={i}>
                <div className="bar" style={{ height: `${(h.max_weight / 300) * 100}%` }} title={`${convertWeight(h.max_weight, 0)} ${weightLabel()}`}></div>
                <span className="bar-label">{h.month}</span>
              </div>
            )) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                LOG DATA TO SEE HISTORY
              </div>
            )}
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="hof-container">
          <h2 className="section-title">HALL OF FAME</h2>
          <div className="hof-list">
            {badgeMilestones.map(badge => {
              const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
              const BadgeIcon = badge.icon;
              return (
                <div className={`hof-item ${isUnlocked ? 'unlocked' : 'locked'}`} key={badge.id}>
                  <div className="hof-icon">
                    {isUnlocked ? <BadgeIcon size={18} /> : <Lock size={18} opacity={0.3} />}
                  </div>
                  <div className="hof-details">
                    <h4 className="hof-title" style={{ color: isUnlocked ? '#fff' : 'var(--text-muted)' }}>{badge.name}</h4>
                    <p className="hof-desc">{badge.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="view-all-btn">VIEW ALL MILESTONES</button>
        </div>
      </div>

      {/* Log Form Section */}
      <div className="log-section">
        <div className="log-form-container">
          <h2 className="section-title">LOG NEW RECORD</h2>
          <div className="form-grid">
            <div className="input-group">
              <label>SELECT LIFT</label>
              <div className="input-with-icon">
                <select value={logLift} onChange={(e) => {
                  setLogLift(e.target.value);
                  fetchHistory(e.target.value);
                }}>
                  {lifts.map(lift => (
                    <option key={lift.id} value={lift.id}>{lift.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="dropdown-icon" />
              </div>
            </div>
            <div className="input-group">
              <label>WEIGHT ({weightLabel()})</label>
              <input type="number" placeholder="0" value={logWeight} onChange={(e) => setLogWeight(e.target.value)} />
            </div>
            <div className="input-group full-width">
              <label>NOTES / RPE</label>
              <input type="text" placeholder="Felt strong, 8/10 RPE" value={logNotes} onChange={(e) => setLogNotes(e.target.value)} />
            </div>
            <div className="input-group full-width">
              <button className="lock-btn" onClick={handleLogRecord}>LOCK IN NEW RECORD</button>
            </div>
          </div>
        </div>

        <div className="standards-container">
          <h4 className="standards-title">STRENGTH STANDARDS</h4>
          
          <div className="standard-item">
            <div className="standard-header">
              <span className="standard-level">Intermediate</span>
              <span className="standard-weight">{convertWeight(120, 0)} {weightLabel()}</span>
            </div>
            <div className="standard-bar-bg">
              <div className="standard-bar-fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="standard-item">
            <div className="standard-header">
              <span className="standard-level">Advanced</span>
              <span className="standard-weight">{convertWeight(160, 0)} {weightLabel()}</span>
            </div>
            <div className="standard-bar-bg">
              <div className="standard-bar-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="standard-item target">
            <div className="standard-header">
              <span className="standard-level">Elite (Target)</span>
              <span className="standard-weight">{convertWeight(200, 0)} {weightLabel()}</span>
            </div>
            <div className="standard-bar-bg">
              <div className="standard-bar-fill" style={{ width: '60%' }}></div>
              <div className="standard-marker" style={{ left: '60%' }}></div>
            </div>
          </div>
          
          {/* Gauge Background Icon */}
          <Activity className="gauge-icon" size={120} />
        </div>
      </div>
    </div>
  );
};

export default PRVault;
