import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut } from 'lucide-react';
import './Topbar.css';

const Topbar = ({ title }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Close dropdown when clicking outside
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

  return (
    <header className="topbar">
      <div className="topbar-left">
        {title && <h1 className="page-title">{title}</h1>}
      </div>
      
      <div className="topbar-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search exercises, routines..." />
      </div>

      <div className="topbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <div className="profile-widget" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
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
    </header>
  );
};

export default Topbar;
