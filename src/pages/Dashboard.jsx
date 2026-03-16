import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, LogOut } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div 
      className="dashboard-container"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePos.x}px`,
        '--mouse-y': `${mousePos.y}px`
      }}
    >
      {/* Top Navigation Pills */}
      <nav className="dash-nav">
        <div className="nav-group">
          <button className="pill-btn active" onClick={() => navigate('/gymflow')}>GET STARTED</button>
          <button className="pill-btn" onClick={() => navigate('/gymflow')}>WORKOUTS</button>
          <button className="pill-btn" onClick={() => navigate('/nutrition')}>NUTRITION</button>
          <button className="pill-btn" onClick={() => navigate('/pr-vault')}>PR VAULT</button>
        </div>
        <div className="nav-group align-right-nav">
          <button className="icon-btn"><Plus size={20} /></button>
          <button className="primary-btn" onClick={() => navigate('/gymflow')}>GYM TIME</button>
          
          {/* Profile Dropdown Widget */}
          <div className="dash-profile-widget" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className="profile-info">
              <span className="profile-name">{user?.username || 'Guest'}</span>
              <span className="profile-status">PRO MEMBER</span>
            </div>
            <div className="profile-avatar">
              <User size={20} />
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout} className="dropdown-item text-danger">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Hero Content */}
      <main className="hero-content">
        <div className="neon-net-bg"></div>
        {/* Decorative Floating Elements */}
        

        <h1 className="hero-title">
          {'GYMFLOW'.split('').map((letter, index) => (
            <span key={index} className="animated-letter" style={{ animationDelay: `${index * 0.1}s` }}>
              {letter}
            </span>
          ))}
        </h1>
        <h2 className="hero-subtitle">Your fitness. Unstuck.</h2>

        <div className="hero-ctas">
          <button className="hero-btn light" onClick={() => navigate('/gymflow')}>LAUNCH GYM APP</button>
          <button className="hero-btn with-icon" onClick={() => navigate('/nutrition')}>
            <span className="icon-circle">🍏</span> NUTRITION LOG
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
