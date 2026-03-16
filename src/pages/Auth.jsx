import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Please fill in both fields.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/signup';
      const res = await axios.post(`http://localhost:5000${endpoint}`, formData);
      
      // Save token and user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Redirect to app
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication completely failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background overlay */}
      <div className="auth-bg"></div>
      
      {/* Split Layout Container */}
      <div className="auth-container">
        
        {/* Left Branding Side */}
        <div className="auth-branding">
          <h1 className="auth-logo">Gymflow</h1>
          <p className="auth-tagline">
            Next-generation intelligence platform for real-time fitness monitoring, analytics, and automated tracking.
          </p>
        </div>

        {/* Right Form Card Side */}
        <div className="auth-card-container">
          <div className="auth-card">
            <h2 className="auth-title">{isLogin ? 'Welcome back' : 'Create Account'}</h2>
            <p className="auth-subtitle">{isLogin ? 'Sign in to continue' : 'Register to get started'}</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  className="auth-input"
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-toggle">
              {isLogin ? (
                <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign Up</span></p>
              ) : (
                <p>Already have an account? <span onClick={() => setIsLogin(true)}>Sign In</span></p>
              )}
            </div>

            <div className="demo-credentials">
              <p className="demo-title">Example details</p>
              <p>User &rarr; <span className="demo-highlight">test_user</span></p>
              <p>Pass &rarr; <span className="demo-highlight">password123</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;
