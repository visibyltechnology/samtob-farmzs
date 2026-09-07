import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import './VisualDiagnosticTool.css';

const hotspots = [
  {
    id: 'engine',
    x: 32,
    y: 38,
    title: 'Engine & Fluids',
    services: ['Oil Change', 'Filter Replacement', 'Engine Diagnostics'],
  },
  {
    id: 'front-wheel',
    x: 17,
    y: 68,
    title: 'Front Wheel & Brakes',
    services: ['Brake Pads', 'Wheel Alignment', 'Tyre Fitting'],
  },
  {
    id: 'rear-wheel',
    x: 76,
    y: 68,
    title: 'Rear Wheel & Suspension',
    services: ['Tyre Balancing', 'Suspension Check', 'Brake Shoes'],
  },
  {
    id: 'cabin',
    x: 53,
    y: 30,
    title: 'Cabin & Electrics',
    services: ['AC Recharge', 'Battery Check', 'Electrical Scan'],
  }
];

// Isometric 3D wireframe car SVG
function WireframeCar({ activeSpot }) {
  const glowColor = 'rgba(211, 47, 47, 0.8)';
  const baseColor = 'rgba(100, 180, 255, 0.35)';
  const activeColor = '#D32F2F';

  return (
    <svg viewBox="0 0 900 480" className="car-svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="hotGlow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* ── BODY – bottom face ── */}
      <polygon points="160,340 740,340 780,380 120,380" fill="rgba(30,40,70,0.6)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── BODY – front face (bonnet side) ── */}
      <polygon points="120,380 160,340 160,240 120,280" fill="rgba(20,30,60,0.5)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── BODY – rear face ── */}
      <polygon points="780,380 740,340 740,240 780,280" fill="rgba(20,30,60,0.4)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── BODY – top face ── */}
      <polygon points="160,240 740,240 780,280 120,280" fill="rgba(30,50,90,0.4)" stroke={baseColor} strokeWidth="1.5" />

      {/* ── CABIN – bottom ── */}
      <polygon points="280,240 620,240 650,280 250,280" fill="rgba(20,35,65,0.5)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── CABIN – front slope ── */}
      <polygon points="250,280 280,240 300,180 270,215" fill="rgba(20,30,60,0.45)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── CABIN – rear slope ── */}
      <polygon points="650,280 620,240 600,180 630,215" fill="rgba(20,30,60,0.4)" stroke={baseColor} strokeWidth="1.5" />
      {/* ── CABIN – roof ── */}
      <polygon points="270,215 300,180 600,180 630,215" fill="rgba(40,70,120,0.5)" stroke={baseColor} strokeWidth="1.5" />

      {/* ── WINDOWS ── */}
      {/* Front windscreen */}
      <polygon points="278,238 302,182 322,182 295,238" fill="rgba(100,200,255,0.08)" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
      {/* Rear windscreen */}
      <polygon points="598,182 618,182 640,238 617,238" fill="rgba(100,200,255,0.08)" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
      {/* Side window left */}
      <polygon points="302,182 430,182 430,238 295,238" fill="rgba(100,200,255,0.06)" stroke="rgba(100,200,255,0.3)" strokeWidth="1" />
      {/* Side window right */}
      <polygon points="430,182 598,182 617,238 430,238" fill="rgba(100,200,255,0.06)" stroke="rgba(100,200,255,0.3)" strokeWidth="1" />

      {/* ── BONNET – lines ── */}
      <line x1="160" y1="240" x2="280" y2="240" stroke={baseColor} strokeWidth="1.5" />
      <line x1="160" y1="280" x2="250" y2="280" stroke={baseColor} strokeWidth="1" strokeDasharray="4,4" />
      <line x1="160" y1="340" x2="160" y2="240" stroke={baseColor} strokeWidth="1.5" />
      <line x1="220" y1="240" x2="220" y2="340" stroke={baseColor} strokeWidth="1" strokeDasharray="4,4" />

      {/* ── BOOT – lines ── */}
      <line x1="740" y1="240" x2="620" y2="240" stroke={baseColor} strokeWidth="1.5" />
      <line x1="740" y1="280" x2="650" y2="280" stroke={baseColor} strokeWidth="1" strokeDasharray="4,4" />
      <line x1="740" y1="340" x2="740" y2="240" stroke={baseColor} strokeWidth="1.5" />
      <line x1="680" y1="240" x2="680" y2="340" stroke={baseColor} strokeWidth="1" strokeDasharray="4,4" />

      {/* ── GRILLE DETAIL ── */}
      <rect x="128" y="295" width="28" height="30" rx="2" fill="none" stroke="rgba(100,180,255,0.5)" strokeWidth="1" />
      <line x1="128" y1="305" x2="156" y2="305" stroke="rgba(100,180,255,0.4)" strokeWidth="0.8" />
      <line x1="128" y1="315" x2="156" y2="315" stroke="rgba(100,180,255,0.4)" strokeWidth="0.8" />

      {/* ── HEADLIGHTS ── */}
      <ellipse cx="143" cy="265" rx="14" ry="8" fill="rgba(255,240,150,0.1)" stroke="rgba(255,240,150,0.6)" strokeWidth="1.2" filter="url(#glow)" />
      <ellipse cx="757" cy="265" rx="14" ry="8" fill="rgba(255,100,100,0.1)" stroke="rgba(255,100,100,0.5)" strokeWidth="1.2" filter="url(#glow)" />

      {/* ── ENGINE HIGHLIGHT ── */}
      <rect
        x="162" y="242" width="115" height="95"
        rx="4"
        fill={activeSpot?.id === 'engine' ? 'rgba(211,47,47,0.12)' : 'transparent'}
        stroke={activeSpot?.id === 'engine' ? activeColor : 'transparent'}
        strokeWidth="1.5"
        filter={activeSpot?.id === 'engine' ? "url(#hotGlow)" : "none"}
      />
      {/* Engine detail lines */}
      <line x1="185" y1="250" x2="255" y2="250" stroke={activeSpot?.id === 'engine' ? activeColor : baseColor} strokeWidth="0.8" strokeDasharray="3,3" />
      <line x1="185" y1="262" x2="255" y2="262" stroke={activeSpot?.id === 'engine' ? activeColor : baseColor} strokeWidth="0.8" strokeDasharray="3,3" />
      <rect x="195" y="268" width="55" height="30" rx="3" fill="rgba(30,50,90,0.5)" stroke={activeSpot?.id === 'engine' ? activeColor : baseColor} strokeWidth="1" />
      <circle cx="222" cy="283" r="8" fill="none" stroke={activeSpot?.id === 'engine' ? activeColor : baseColor} strokeWidth="1" />

      {/* ── CABIN HIGHLIGHT ── */}
      <rect
        x="270" y="182" width="360" height="97"
        rx="4"
        fill={activeSpot?.id === 'cabin' ? 'rgba(211,47,47,0.12)' : 'transparent'}
        stroke={activeSpot?.id === 'cabin' ? activeColor : 'transparent'}
        strokeWidth="1.5"
        filter={activeSpot?.id === 'cabin' ? "url(#hotGlow)" : "none"}
      />

      {/* ── FRONT WHEEL ── */}
      <g filter={activeSpot?.id === 'front-wheel' ? "url(#hotGlow)" : "url(#glow)"}>
        {/* Outer tyre */}
        <ellipse cx="220" cy="370" rx="55" ry="20"
          fill="rgba(20,20,30,0.8)"
          stroke={activeSpot?.id === 'front-wheel' ? activeColor : baseColor}
          strokeWidth="2" />
        {/* Inner rim */}
        <ellipse cx="220" cy="365" rx="42" ry="15"
          fill="rgba(15,15,25,0.9)"
          stroke={activeSpot?.id === 'front-wheel' ? activeColor : 'rgba(100,180,255,0.5)'}
          strokeWidth="1.5" />
        {/* Hub */}
        <ellipse cx="220" cy="363" rx="18" ry="8"
          fill="rgba(30,40,70,0.9)"
          stroke={activeSpot?.id === 'front-wheel' ? activeColor : baseColor}
          strokeWidth="1.2" />
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return <line key={angle}
            x1={220} y1={363}
            x2={220 + Math.cos(rad) * 14} y2={363 + Math.sin(rad) * 6}
            stroke={activeSpot?.id === 'front-wheel' ? activeColor : baseColor}
            strokeWidth="1" />;
        })}
      </g>

      {/* ── REAR WHEEL ── */}
      <g filter={activeSpot?.id === 'rear-wheel' ? "url(#hotGlow)" : "url(#glow)"}>
        <ellipse cx="680" cy="370" rx="55" ry="20"
          fill="rgba(20,20,30,0.8)"
          stroke={activeSpot?.id === 'rear-wheel' ? activeColor : baseColor}
          strokeWidth="2" />
        <ellipse cx="680" cy="365" rx="42" ry="15"
          fill="rgba(15,15,25,0.9)"
          stroke={activeSpot?.id === 'rear-wheel' ? activeColor : 'rgba(100,180,255,0.5)'}
          strokeWidth="1.5" />
        <ellipse cx="680" cy="363" rx="18" ry="8"
          fill="rgba(30,40,70,0.9)"
          stroke={activeSpot?.id === 'rear-wheel' ? activeColor : baseColor}
          strokeWidth="1.2" />
        {[0, 60, 120, 180, 240, 300].map(angle => {
          const rad = (angle * Math.PI) / 180;
          return <line key={angle}
            x1={680} y1={363}
            x2={680 + Math.cos(rad) * 14} y2={363 + Math.sin(rad) * 6}
            stroke={activeSpot?.id === 'rear-wheel' ? activeColor : baseColor}
            strokeWidth="1" />;
        })}
      </g>

      {/* ── SUSPENSION STRUTS ── */}
      <line x1="220" y1="340" x2="220" y2="352" stroke={baseColor} strokeWidth="2" />
      <line x1="680" y1="340" x2="680" y2="352" stroke={baseColor} strokeWidth="2" />

      {/* ── EXHAUST DETAIL ── */}
      <ellipse cx="775" cy="375" rx="8" ry="5" fill="rgba(20,20,30,0.8)" stroke={baseColor} strokeWidth="1.2" />

      {/* Blueprint grid lines (subtle) */}
      {[200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700].map(x => (
        <line key={`vg-${x}`} x1={x} y1="170" x2={x} y2="400" stroke="rgba(100,180,255,0.04)" strokeWidth="1" />
      ))}
      {[200, 250, 300, 350, 400].map(y => (
        <line key={`hg-${y}`} x1="100" y1={y} x2="800" y2={y} stroke="rgba(100,180,255,0.04)" strokeWidth="1" />
      ))}
    </svg>
  );
}

export default function VisualDiagnosticTool() {
  const [activeSpot, setActiveSpot] = useState(null);
  const { openQuote } = useModal();

  return (
    <section className="section-padding visual-tool-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Interactive <span className="text-primary">Diagnostics</span></h2>
          <p className="section-subtitle">Click on a vehicle area to explore related services.</p>
        </div>

        <div className="visual-tool-container">
          <div className="car-schematic">
            <WireframeCar activeSpot={activeSpot} />

            {hotspots.map((spot) => (
              <div
                key={spot.id}
                className={`hotspot ${activeSpot?.id === spot.id ? 'active' : ''}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onClick={() => setActiveSpot(activeSpot?.id === spot.id ? null : spot)}
                title={spot.title}
              >
                <div className="hotspot-pulse"></div>
                <div className="hotspot-core"></div>
              </div>
            ))}
          </div>

          <div className="hotspot-details glass-card">
            <AnimatePresence mode="wait">
              {activeSpot ? (
                <motion.div
                  key={activeSpot.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="details-content"
                >
                  <h3>{activeSpot.title}</h3>
                  <ul className="service-list">
                    {activeSpot.services.map((svc, i) => (
                      <li key={i}>{svc}</li>
                    ))}
                  </ul>
                  <button className="btn-primary mt-4 w-full" onClick={openQuote}>
                    Get Quote <ChevronRight size={18} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="details-empty"
                >
                  <div className="empty-icon">🔍</div>
                  <p>Select a highlighted area on the vehicle to see available services and parts.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
