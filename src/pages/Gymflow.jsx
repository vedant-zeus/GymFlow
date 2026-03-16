import React, { useState, useRef } from 'react';
import { ArrowRight, Maximize2, CheckCircle2, Music, SkipBack, Play, Pause, Check, Flame, Clock, Activity, ArrowUpRight, X, Plus } from 'lucide-react';
import './Gymflow.css';

const initialMuscleGroups = {
  'CHEST': ['Bench Press', 'Incline DB Press', 'Cable Crossovers', 'Dips'],
  'BACK': ['Pull-ups', 'Barbell Rows', 'Lat Pulldowns', 'Deadlifts'],
  'LEGS': ['Squats', 'Leg Press', 'Romanian Deadlifts', 'Calf Raises'],
  'SHOULDERS': ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls'],
  'BICEPS': ['Barbell Curls', 'Dumbbell Curls', 'Hammer Curls', 'Preacher Curls'],
  'TRICEPS': ['Tricep Pushdowns', 'Overhead Extensions', 'Skull Crushers', 'Close-Grip Bench']
};

const Gymflow = () => {
  // --- Modals and Exercises State ---
  const [muscleGroups, setMuscleGroups] = useState(initialMuscleGroups);
  const [activeMuscle, setActiveMuscle] = useState(null); // 'CHEST', 'BACK', etc.
  const [newExerciseName, setNewExerciseName] = useState('');
  
  // --- Daily Tracking State ---
  const [selectedForToday, setSelectedForToday] = useState([]);
  // Let's pretend today is the 12th as mocked in the UI
  const [dailyWorkouts, setDailyWorkouts] = useState({
    // Mocking past dates
    26: ['Pushups'], 27: [], 28: [], 29: [], 30: [],
    1: ['Squats', 'Leg Press'], 2: ['Bench Press'], 3: ['Pull-ups'], 
    5: ['Deadlifts'], 6: ['Bicep Curls'], 8: ['Lunges'], 9: ['Overhead Press'], 10: ['Dips'], 11: ['Lat Pulldowns']
  });

  // --- Music Player State ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [songTitle, setSongTitle] = useState('Phonk Pre-workout ...');
  const [songDesc, setSongDesc] = useState('95 BPM • High Energy');
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  // -- Handlers for Modal --
  const openModal = (muscle) => setActiveMuscle(muscle);
  const closeModal = () => {
    setActiveMuscle(null);
    setNewExerciseName('');
  };

  const handleAddExercise = () => {
    if (newExerciseName.trim()) {
      setMuscleGroups({
        ...muscleGroups,
        [activeMuscle]: [...muscleGroups[activeMuscle], newExerciseName.trim()]
      });
      setNewExerciseName('');
    }
  };

  const toggleExerciseSelection = (exercise) => {
    if (selectedForToday.includes(exercise)) {
      setSelectedForToday(selectedForToday.filter(ex => ex !== exercise));
    } else {
      setSelectedForToday([...selectedForToday, exercise]);
    }
  };

  const finishWorkout = () => {
    if (selectedForToday.length > 0) {
      setDailyWorkouts({
        ...dailyWorkouts,
        12: selectedForToday // Save selection for today (12)
      });
      // Optionally clear for a new session, but we can leave it to keep the tracker active
      // setSelectedForToday([]);
      alert('Workout Completed! Calendar Updated.');
    } else {
      alert('Select exercises first by clicking on a muscle group!');
    }
  };

  // -- Music Player Handlers --
  const handleMusicUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSongTitle(file.name);
      setSongDesc('Local Audio File');
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Playback failed:", e));
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !audioRef.current.src) {
       // Auto click upload if no song selected
       handleMusicUploadClick();
       return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error(e));
    }
    setIsPlaying(!isPlaying);
  };

  const renderCalendarDay = (day, isToday = false) => {
    const isCompleted = dailyWorkouts[day] && dailyWorkouts[day].length > 0;
    const isMissed = dailyWorkouts[day] && dailyWorkouts[day].length === 0;
    
    // Tooltip text using native JS title prop
    const titleText = isCompleted ? `Completed: ${dailyWorkouts[day].join(', ')}` : isMissed ? 'Missed Workout' : '';

    let className = "cal-day ";
    if (isToday) className += "today border-active ";
    if (isCompleted) className += "checked ";
    if (isMissed) className += "missed ";
    if (!isCompleted && !isMissed && !isToday) className += "empty ";
    if (!isCompleted && !isMissed && day < 12 && day > 0) className = "cal-day num";

    return (
      <div className={className} title={titleText} key={day}>
        {isCompleted ? <Check size={14} strokeWidth={4} /> : (day < 12 || isToday ? day : '')}
      </div>
    );
  };

  return (
    <div className="gymflow-page">
      {/* Hidden Audio and File Inputs */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      <input type="file" accept="audio/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />

      {/* Floating Modal for Exercises */}
      {activeMuscle && (
        <div className="muscle-modal-overlay" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="muscle-modal" onClick={e => e.stopPropagation()} style={{ background: '#0a0c0a', padding: '24px', borderRadius: '12px', border: '1px solid var(--accent-green)', minWidth: '400px'}}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
              <h2 style={{ fontSize: '18px', fontStyle: 'italic', color: '#fff' }}>{activeMuscle} EXERCISES</h2>
              <button className="close-btn" onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'}}><X size={20} /></button>
            </div>
            
            <div className="exercise-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', maxHeight: '300px', overflowY: 'auto' }}>
              {muscleGroups[activeMuscle].map((ex, index) => (
                <div 
                  key={index} 
                  className={`exercise-item ${selectedForToday.includes(ex) ? 'selected' : ''}`}
                  onClick={() => toggleExerciseSelection(ex)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: selectedForToday.includes(ex) ? 'rgba(57, 255, 20, 0.1)' : '#121813', borderRadius: '8px', cursor: 'pointer', border: selectedForToday.includes(ex) ? '1px solid var(--accent-green)' : '1px solid transparent' }}
                >
                  <div className="ex-checkbox" style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selectedForToday.includes(ex) ? 'var(--accent-green)' : 'transparent' }}>
                    {selectedForToday.includes(ex) && <Check size={14} strokeWidth={4} color="#000" />}
                  </div>
                  <span style={{ color: selectedForToday.includes(ex) ? '#fff' : 'var(--text-muted)', fontWeight: selectedForToday.includes(ex) ? 'bold' : 'normal' }}>{ex}</span>
                </div>
              ))}
            </div>

            <div className="add-exercise-form" style={{ display: 'flex', gap: '8px', marginBottom: '24px'}}>
              <input 
                type="text" 
                placeholder="Add new exercise..." 
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
                style={{ flex: 1, padding: '12px', background: '#121813', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }}
              />
              <button className="add-btn" onClick={handleAddExercise} style={{ padding: '12px', background: 'var(--accent-green)', border: 'none', color: '#000', borderRadius: '6px', cursor: 'pointer' }}><Plus size={18} /></button>
            </div>

            <button className="modal-done-btn" onClick={closeModal} style={{ width: '100%', padding: '14px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>DONE</button>
          </div>
        </div>
      )}

      {/* Left Column */}
      <div className="gymflow-main">
        {/* Muscle Groups */}
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">CHOOSE YOUR MUSCLE GROUP</h2>
            <a href="#" className="view-all">View All <ArrowRight size={14} /></a>
          </div>
          
          <div className="muscle-grid">
            <div className="card muscle-card chest-bg" onClick={() => openModal('CHEST')}>
              <div className="muscle-info">
                <h3 className="muscle-name">CHEST</h3>
                <span className="exercise-count">{muscleGroups['CHEST'].length} EXERCISES</span>
              </div>
            </div>
            
            <div className="card muscle-card back-bg" onClick={() => openModal('BACK')}>
              <div className="muscle-info">
                <h3 className="muscle-name">BACK</h3>
                <span className="exercise-count">{muscleGroups['BACK'].length} EXERCISES</span>
              </div>
            </div>

            <div className="card muscle-card legs-bg" onClick={() => openModal('LEGS')}>
              <div className="muscle-info">
                <h3 className="muscle-name">LEGS</h3>
                <span className="exercise-count">{muscleGroups['LEGS'].length} EXERCISES</span>
              </div>
            </div>

            <div className="card muscle-card shoulders-bg" onClick={() => openModal('SHOULDERS')}>
              <div className="muscle-info">
                <h3 className="muscle-name">SHOULDERS</h3>
                <span className="exercise-count">{muscleGroups['SHOULDERS'].length} EXERCISES</span>
              </div>
            </div>

            <div className="card muscle-card biceps-bg" onClick={() => openModal('BICEPS')}>
              <div className="muscle-info">
                <h3 className="muscle-name">BICEPS</h3>
                <span className="exercise-count">{muscleGroups['BICEPS'].length} EXERCISES</span>
              </div>
            </div>

            <div className="card muscle-card triceps-bg" onClick={() => openModal('TRICEPS')}>
              <div className="muscle-info">
                <h3 className="muscle-name">TRICEPS</h3>
                <span className="exercise-count">{muscleGroups['TRICEPS'].length} EXERCISES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Tracker & Music */}
        <div className="active-row">
          <div className="card live-tracker">
            <div className="tracker-top">
              <div className="tracker-title">
                <Maximize2 size={16} className="expand-icon" />
                <h3>LIVE WORKOUT:<br/>TODAY'S SPLIT</h3>
              </div>
              <div className="recording-dot"></div>
            </div>

            <div className="tracker-stats">
              <div className="tracker-stat" style={{ maxWidth: '60%' }}>
                <span className="label">SELECTED EXERCISES</span>
                <span className="value" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {selectedForToday.length > 0 
                    ? selectedForToday.join(', ')
                    : 'None Selected'}
                </span>
              </div>
              <div className="tracker-stat align-right">
                <span className="label">TOTAL COUNT</span>
                <span className="value highlight">{selectedForToday.length} Exercises</span>
              </div>
            </div>

            <div className="tracker-next">
              <span className="label">CLICK ON MUSCLE CARDS TO START</span>
            </div>

            <button className="finish-btn" onClick={finishWorkout}>
              FINISH WORKOUT <CheckCircle2 size={16} />
            </button>
          </div>

          <div className="card music-player">
            <div className="player-top">
              <div className="music-icon-wrapper" onClick={handleMusicUploadClick} style={{ cursor: 'pointer' }}>
                <Music size={20} />
              </div>
              <div className="track-info" onClick={handleMusicUploadClick} style={{ cursor: 'pointer' }} title="Click to upload local .mp3">
                <h4 className="track-name">{songTitle}</h4>
                <p className="track-desc">{songDesc}</p>
              </div>
              <div className="playback-controls">
                <button className="control-btn" onClick={() => { if(audioRef.current){ audioRef.current.currentTime = 0; } }}><SkipBack size={18} /></button>
                <button className="play-btn" onClick={togglePlayPause}>
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                </button>
              </div>
            </div>

            <div className={`equalizer ${isPlaying ? 'animated' : ''}`}>
              {[4, 6, 8, 3, 5, 9, 2, 4, 7, 5, 8, 3, 4, 6, 2].map((height, i) => (
                <div 
                  key={i} 
                  className="eq-bar" 
                  style={{ height: `${isPlaying ? height * 10 : 10}%`, transition: 'height 0.2s ease' }}
                ></div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Right Column (Sidebar metrics) */}
      <div className="gymflow-sidebar">
        
        {/* Consistency */}
        <div className="sidebar-section">
          <div className="sidebar-header">
            <h3 className="sidebar-title">CONSISTENCY</h3>
            <span className="sidebar-subtitle">OCTOBER 2023</span>
          </div>

          <div className="calendar-grid">
            <div className="cal-header">M</div>
            <div className="cal-header">T</div>
            <div className="cal-header">W</div>
            <div className="cal-header">T</div>
            <div className="cal-header">F</div>
            <div className="cal-header">S</div>
            <div className="cal-header">S</div>

            {/* Row 1 */}
            {renderCalendarDay(26)}
            {renderCalendarDay(27)}
            {renderCalendarDay(28)}
            {renderCalendarDay(29)}
            {renderCalendarDay(30)}
            {renderCalendarDay(1)}
            {renderCalendarDay(2)}

            {/* Row 2 */}
            {renderCalendarDay(3)}
            {renderCalendarDay(4)}
            {renderCalendarDay(5)}
            {renderCalendarDay(6)}
            {renderCalendarDay(7)}
            {renderCalendarDay(8)}
            {renderCalendarDay(9)}

            {/* Row 3 */}
            {renderCalendarDay(10)}
            {renderCalendarDay(11)}
            {renderCalendarDay(12, true)} {/* Today */}
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            
            {/* Row 4 */}
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
            <div className="cal-day empty"></div>
          </div>

          <div className="completion-bar-container">
            <div className="completion-labels">
              <span>Monthly Completion</span>
              <span className="highlight-text">{(Object.keys(dailyWorkouts).filter(k => dailyWorkouts[k].length > 0).length / 31 * 100).toFixed(0)}%</span>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${(Object.keys(dailyWorkouts).filter(k => dailyWorkouts[k].length > 0).length / 31 * 100).toFixed(0)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Today's Stats */}
        <div className="sidebar-section">
          <h3 className="sidebar-title margin-bottom">TODAY'S STATS</h3>
          <div className="stats-list">
            
            <div className="card stat-row">
              <div className="stat-icon flame">
                <Flame size={20} fill="currentColor" />
              </div>
              <div className="stat-info">
                <span className="stat-label">CALORIES BURNED</span>
                <span className="stat-value">642 <span className="unit">kcal</span></span>
              </div>
            </div>

            <div className="card stat-row">
              <div className="stat-icon clock">
                <Clock size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">TIME SPENT</span>
                <span className="stat-value">48 <span className="unit">min</span></span>
              </div>
            </div>

            <div className="card stat-row">
              <div className="stat-icon activity">
                <Activity size={20} />
              </div>
              <div className="stat-info">
                <span className="stat-label">INTENSITY LEVEL</span>
                <span className="stat-value italic">HIGH</span>
              </div>
            </div>

          </div>
        </div>

        {/* Upsell Card */}
        <div className="card upsell-card">
          <h3 className="upsell-title">PUSH YOUR LIMITS</h3>
          <p className="upsell-desc">Unlock custom hypertrophy plans and advanced analytics.</p>
          <button className="upsell-btn">UPGRADE NOW</button>
        </div>

      </div>
    </div>
  );
};

export default Gymflow;
