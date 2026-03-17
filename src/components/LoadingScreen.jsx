import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onDone }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 4200);
    const doneTimer = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div className={`ls-root ${fading ? 'ls-fade-out' : ''}`}>

      {/* ── Cropped background video ── */}
      <video
        className="ls-bg-video"
        src="/loadingscreen.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* ── Dark + gradient overlay ── */}
      <div className="ls-overlay" />

      {/* ── Content layer ── */}
      <div className="ls-content">

        {/* Brand name */}
        <div className="ls-brand">
          <span className="ls-brand-gym">GYM</span>
          <span className="ls-brand-flow">FLOW</span>
        </div>

        {/* Tagline */}
        <p className="ls-tagline">Track. Lift. Dominate.</p>

        {/* Loading dots */}
        <div className="ls-dots">
          <span className="ls-dot" style={{ animationDelay: '0s' }} />
          <span className="ls-dot" style={{ animationDelay: '0.2s' }} />
          <span className="ls-dot" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Progress bar */}
        <div className="ls-progress-track">
          <div className="ls-progress-bar" />
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;
