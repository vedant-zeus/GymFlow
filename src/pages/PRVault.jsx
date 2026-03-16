import React, { useState } from 'react';
import { PenSquare, ChevronDown, Trophy, Medal, Award, MoveDown, MoveUp, Dumbbell, Activity, Check } from 'lucide-react';
import './PRVault.css';

const initialLifts = [
  { id: 'Deadlift', name: 'DEADLIFT', weight: 240, unit: 'KG', date: '3 DAYS AGO', iconType: 'Dumbbell', notes: '' },
  { id: 'Squat', name: 'SQUAT', weight: 180, unit: 'KG', date: '1 WEEK AGO', iconType: 'MoveDown', notes: '' },
  { id: 'Bench Press', name: 'BENCH PRESS', weight: 140, unit: 'KG', date: '2 DAYS AGO', iconType: 'Activity', notes: '' },
  { id: 'Overhead Press', name: 'OVERHEAD PRESS', weight: 95, unit: 'KG', date: '2 WEEKS AGO', iconType: 'MoveUp', notes: '' }
];

const iconMap = {
  'Dumbbell': Dumbbell,
  'MoveDown': MoveDown,
  'Activity': Activity,
  'MoveUp': MoveUp
};

const PRVault = () => {
  const [lifts, setLifts] = useState(initialLifts);
  const [editingCard, setEditingCard] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const [logLift, setLogLift] = useState('Deadlift');
  const [logWeight, setLogWeight] = useState(245);
  const [logNotes, setLogNotes] = useState('');

  const totalLifted = lifts.reduce((sum, lift) => sum + Number(lift.weight), 0);

  const handleUpdateClick = (lift) => {
    setEditingCard(lift.id);
    setEditValue(lift.weight);
  };

  const handleSaveEdit = (liftId) => {
    setLifts(lifts.map(l => l.id === liftId ? { ...l, weight: editValue, date: 'JUST NOW' } : l));
    setEditingCard(null);
  };

  const handleLogRecord = () => {
    setLifts(lifts.map(l => l.id === logLift ? { ...l, weight: logWeight, notes: logNotes, date: 'JUST NOW' } : l));
    setLogWeight('');
    setLogNotes('');
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
            <span className="stat-value">{totalLifted.toLocaleString()} KGS</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">RANK</span>
            <span className="stat-value text-white">ELITE</span>
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
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      style={{ width: '80px', fontSize: '32px', fontWeight: '900', fontStyle: 'italic', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', borderRadius: '4px', padding: '4px' }}
                      autoFocus
                    />
                    <span className="lift-unit">{lift.unit}</span>
                    <button onClick={() => handleSaveEdit(lift.id)} style={{ background: 'var(--accent-green)', color: '#000', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <Check size={20} style={{ strokeWidth: 3 }} />
                    </button>
                  </div>
                ) : (
                  <div className="lift-record">
                    <span className="lift-weight">{lift.weight}</span>
                    <span className="lift-unit">{lift.unit}</span>
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
            <div className="dropdown">
              <span>DEADLIFT</span>
              <ChevronDown size={14} />
            </div>
          </div>
          
          <div className="bar-chart">
            <div className="bar-column">
              <div className="bar" style={{ height: '30%' }}></div>
              <span className="bar-label">JAN</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '35%' }}></div>
              <span className="bar-label">FEB</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '32%' }}></div>
              <span className="bar-label">MAR</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '45%' }}></div>
              <span className="bar-label">APR</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '55%' }}></div>
              <span className="bar-label">MAY</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '50%' }}></div>
              <span className="bar-label">JUN</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '70%' }}></div>
              <span className="bar-label">JUL</span>
            </div>
            <div className="bar-column">
              <div className="bar" style={{ height: '90%' }}></div>
              <span className="bar-label">AUG</span>
            </div>
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="hof-container">
          <h2 className="section-title">HALL OF FAME</h2>
          <div className="hof-list">
            <div className="hof-item">
              <div className="hof-icon"><Trophy size={18} /></div>
              <div className="hof-details">
                <h4 className="hof-title">THE 500 CLUB</h4>
                <p className="hof-desc">Deadlifted 500+ lbs in single session</p>
              </div>
            </div>
            <div className="hof-item">
              <div className="hof-icon"><Medal size={18} /></div>
              <div className="hof-details">
                <h4 className="hof-title">IRON TITAN</h4>
                <p className="hof-desc">Squatted 2x Bodyweight</p>
              </div>
            </div>
            <div className="hof-item">
              <div className="hof-icon"><Award size={18} /></div>
              <div className="hof-details">
                <h4 className="hof-title">RELENTLESS</h4>
                <p className="hof-desc">Updated PRs 12 weeks in a row</p>
              </div>
            </div>
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
                <select value={logLift} onChange={(e) => setLogLift(e.target.value)}>
                  {lifts.map(lift => (
                    <option key={lift.id} value={lift.id}>{lift.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="dropdown-icon" />
              </div>
            </div>
            <div className="input-group">
              <label>WEIGHT (KG)</label>
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
              <span className="standard-weight">120 KG</span>
            </div>
            <div className="standard-bar-bg">
              <div className="standard-bar-fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="standard-item">
            <div className="standard-header">
              <span className="standard-level">Advanced</span>
              <span className="standard-weight">160 KG</span>
            </div>
            <div className="standard-bar-bg">
              <div className="standard-bar-fill" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="standard-item target">
            <div className="standard-header">
              <span className="standard-level">Elite (Target)</span>
              <span className="standard-weight">200 KG</span>
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
