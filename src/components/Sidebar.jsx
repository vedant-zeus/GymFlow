import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Utensils, Trophy, Settings, Zap } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Zap className="logo-icon" fill="var(--accent-green)" />
          <div className="logo-text">
            <h2>GYMFLOW</h2>
            <span>ELITE PERFORMANCE</span>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/gymflow" className="nav-item" activeclassname="active">
          <Dumbbell size={20} />
          <span>Workouts</span>
        </NavLink>
        <NavLink to="/nutrition" className="nav-item" activeclassname="active">
          <Utensils size={20} />
          <span>Nutrition</span>
        </NavLink>
        <NavLink to="/pr-vault" className="nav-item" activeclassname="active">
          <Trophy size={20} />
          <span>PR Vault</span>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="streak-card">
          <div className="streak-title">CURRENT STREAK</div>
          <div className="streak-value">
            12 DAYS <Zap size={16} fill="var(--accent-green)" color="var(--accent-green)" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
