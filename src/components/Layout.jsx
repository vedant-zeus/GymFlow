import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Entirely bypass layout wraps for Login and Dashboard so they take up 100% of screen
  if (location.pathname === '/login' || location.pathname === '/dashboard') {
    return <>{children}</>;
  }

  let title = "";
  if (location.pathname === '/nutrition') title = "NUTRITION TRACKER";
  if (location.pathname === '/gymflow') title = "GYMFLOW PROTOCOL";
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={title} />
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
