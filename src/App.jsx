import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Nutrition from './pages/Nutrition';
import PRVault from './pages/PRVault';
import Gymflow from './pages/Gymflow';
import './App.css';

import Auth from './pages/Auth';

function App() {
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
