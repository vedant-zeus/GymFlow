import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Nutrition from './pages/Nutrition';
import PRVault from './pages/PRVault';
import Gymflow from './pages/Gymflow';
import Settings from './pages/Settings';
import LoadingScreen from './components/LoadingScreen';
import './App.css';

import Auth from './pages/Auth';

// Only show the intro once per browser session
const hasSeenIntro = sessionStorage.getItem('gf_intro_done') === 'true';

function App() {
  const [loading, setLoading] = useState(!hasSeenIntro);

  const handleLoadingDone = () => {
    sessionStorage.setItem('gf_intro_done', 'true');
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen onDone={handleLoadingDone} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/pr-vault" element={<PRVault />} />
          <Route path="/gymflow" element={<Gymflow />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

