import React, { useEffect, useState } from 'react';
import './BrandPreloader.css';

export default function BrandPreloader({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="preloader-overlay">
      <div className="preloader-content">
        <img src="/logo.jpeg" alt="Samtob Farms" className="preloader-logo" />
        <h1 className="preloader-brand">
          Samtob<span className="logo-accent">Farms</span>
        </h1>
        <p className="preloader-tagline">Healthy Chickens • Fresh Future</p>
        <div className="preloader-bar-wrap">
          <div className="preloader-bar" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <div className="preloader-pct">{Math.min(progress, 100)}%</div>
      </div>
    </div>
  );
}
