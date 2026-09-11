import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, Truck, Home, Star, ArrowRight } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useApp } from '../../context/AppContext';
import './Hero.css';

function useCountUp(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}


export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const { siteSettings: globalSiteSettings } = useApp();
  
  const [heroSettings, setHeroSettings] = useState({
    badge: 'Limited Season Offer — Book Now!',
    titlePrefix: 'Join the',
    words: 'December Rush',
    titleSuffix: 'Installment Plan',
    subtitle: 'Book your Christmas chickens early and pay in small weekly installments. Hormone-free birds raised on our farm — delivered to your door in Ibadan. Farm pickup always free.',
    priceRibbon: '₦1,500/wk',
    enabled: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'hero_banner'), (docSnap) => {
      if (docSnap.exists()) {
        setHeroSettings(prev => ({ ...prev, ...docSnap.data() }));
      }
    });
    return () => unsub();
  }, []);

  useLenis(({ scroll }) => {
    if (bgRef.current) bgRef.current.style.transform = 'translate3d(0,' + (scroll * 0.35) + 'px,0)';
  });

  const scrollDown = () => {
    const s = document.getElementById('how-it-works');
    if (s) s.scrollIntoView({ behavior: 'smooth' });
  };

  if (!heroSettings.enabled) return null;

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-overlay" />

      {/* Particles */}
      <div className="hero-particles">
        {[...Array(18)].map((_, i) => <div key={i} className={'hero-particle p' + (i % 6)} />)}
      </div>
      <div className="hero-ring ring-1" />
      <div className="hero-ring ring-2" />
      <div className="hero-ring ring-3" />

      {/* Floating emojis */}
      <div className="hero-float f1">🐔</div>
      <div className="hero-float f2">🌿</div>
      <div className="hero-float f3">🍗</div>
      <div className="hero-float f4">🌾</div>
      <div className="hero-float f5">🥚</div>

      <div className="container hero-container">

        {/* ─── LEFT CONTENT ─── */}
        <div className="hero-content">

          {/* Badge */}
          <div className="hero-badge txt-reveal" style={{ animationDelay: '0.1s' }}>
            <span className="badge-pulse" />
            <Star size={12} fill="currentColor" />
            <span>{heroSettings.badge}</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">
            <span className="hero-tag-line line-slide-up" style={{ animationDelay: '0.3s' }}>
              {heroSettings.titlePrefix}
            </span>

            <span className="hero-rush-row">
              {heroSettings.words.split(' ').map((word, wi) => (
                <span
                  key={wi + word}
                  className="rush-word december-rush-animate word-pop"
                  style={{ animationDelay: wi === 0 ? '0.6s' : '0.8s' }}
                >
                  {word}
                </span>
              ))}
            </span>

            <span className="hero-sub-line line-slide-right" style={{ animationDelay: '1.0s' }}>
              <span className="underline-draw">{heroSettings.titleSuffix}</span>
            </span>
          </h1>

          {/* Subtitle — word-by-word */}
          <p className="hero-subtitle words-fade-in">
            {heroSettings.subtitle.split('. ').map((chunk, i, arr) => (
              <span key={i} className="sub-word" style={{ animationDelay: `${1.2 + (i * 0.15)}s` }}>
                {chunk}{i < arr.length - 1 ? '. ' : ''}
              </span>
            ))}
          </p>

          {/* CTAs */}
          <div className="hero-ctas ctas-rise" style={{ animationDelay: '1.6s' }}>
            <Link to="/shop" className="hero-btn-primary">
              <ShoppingBag size={20} />
              <span>Order Now</span>
              <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <button onClick={scrollDown} className="hero-btn-outline">
              How It Works <ChevronDown size={18} />
            </button>
          </div>

          {/* Trust chips */}
          <div className="hero-trust chips-stagger">
            {['✅ No Hormones', '✅ Farm Raised', '✅ Same-Day Processing', '✅ Ibadan Delivery'].map((t, i) => (
              <div key={i} className="trust-chip" style={{ animationDelay: `${1.8 + (i * 0.1)}s` }}>{t}</div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT VISUAL ─── */}
        <div className="hero-visual visual-reveal" style={{ animationDelay: '0.4s' }}>
          <div className="hero-image-card">
            <img
              src="/products/live_chicken.jpg"
              alt="Fresh farm chickens ready for Christmas"
              className="hero-img"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548550023-2bf3c49b338c?w=800&q=80'; }}
            />
            <div className="hero-img-overlay" />
            <div className="hero-img-tag">
              <span className="img-tag-dot" />
              <span>Farm Fresh • Hormone-Free</span>
            </div>
            <div className="hero-price-ribbon">
              <div className="ribbon-label">Starting from</div>
              <div className="ribbon-price">
                {heroSettings.priceRibbon.split('/')[0]}
                {heroSettings.priceRibbon.includes('/') && <span>/{heroSettings.priceRibbon.split('/')[1]}</span>}
              </div>
            </div>
          </div>

          <div className="hero-stats">
            {[
              { icon: '🐔', value: '100%', label: 'Farm Raised' },
              { icon: <Truck size={22} />, value: `₦${Number(globalSiteSettings?.ibadan ?? 5000).toLocaleString('en-NG')}`, label: 'Ibadan Delivery' },
              { icon: <Home size={22} />, value: 'FREE', label: 'Farm Pickup' },
            ].map((s, i) => (
              <div key={i} className="stat-card hero-anim-stat" style={{ animationDelay: `${1.2 + (i * 0.15)}s` }}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={scrollDown} className="hero-scroll-cue">
        <ChevronDown size={20} />
      </button>
    </section>
  );
}
