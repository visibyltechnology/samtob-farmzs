import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, Truck, Home, Star, ArrowRight } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
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

const WORDS = ['December', 'Rush'];

export default function Hero() {
  const heroRef  = useRef(null);
  const bgRef    = useRef(null);
  const [phase, setPhase] = useState(0); // 0=hidden,1=badge,2=tagline,3=word0,4=word1,5=subline,6=sub,7=ctas,8=trust,9=done

  // stagger entrance phases
  useEffect(() => {
    const delays = [120, 380, 680, 900, 1120, 1350, 1600, 1850];
    const timers = delays.map((d, i) => setTimeout(() => setPhase(i + 1), d));
    return () => timers.forEach(clearTimeout);
  }, []);

  useLenis(({ scroll }) => {
    if (bgRef.current) bgRef.current.style.transform = 'translate3d(0,' + (scroll * 0.35) + 'px,0)';
  });

  const scrollDown = () => {
    const s = document.getElementById('how-it-works');
    if (s) s.scrollIntoView({ behavior: 'smooth' });
  };

  // helpers
  const revealed = (n) => phase >= n;

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
          <div className={'hero-badge' + (revealed(1) ? ' txt-reveal' : ' txt-hidden')}>
            <span className="badge-pulse" />
            <Star size={12} fill="currentColor" />
            <span>Limited Season Offer — Book Now!</span>
          </div>

          {/* Title */}
          <h1 className="hero-title">
            <span className={'hero-tag-line' + (revealed(2) ? ' line-slide-up' : ' txt-hidden')}>
              Join the
            </span>

            <span className="hero-rush-row">
              {WORDS.map((word, wi) => (
                <span
                  key={word}
                  className={'rush-word december-rush-animate' + (revealed(3 + wi) ? ' word-pop' : ' txt-hidden')}
                  style={{ animationDelay: wi === 0 ? '0ms' : '220ms' }}
                >
                  {word}
                </span>
              ))}
            </span>

            <span className={'hero-sub-line' + (revealed(5) ? ' line-slide-right' : ' txt-hidden')}>
              <span className="underline-draw">Installment Plan</span>
            </span>
          </h1>

          {/* Subtitle — word-by-word */}
          <p className={'hero-subtitle' + (revealed(6) ? ' words-fade-in' : ' txt-hidden')}>
            {['Book your Christmas chickens early and', 'pay in small weekly installments.', 'Hormone-free birds raised on our farm —', 'delivered to your door in Ibadan.', 'Farm pickup always free.'].map((chunk, i) => (
              <span key={i} className="sub-word" style={{ animationDelay: (i * 140) + 'ms' }}>
                {chunk}{' '}
              </span>
            ))}
          </p>

          {/* CTAs */}
          <div className={'hero-ctas' + (revealed(7) ? ' ctas-rise' : ' txt-hidden')}>
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
          <div className={'hero-trust' + (revealed(8) ? ' chips-stagger' : ' txt-hidden')}>
            {['✅ No Hormones', '✅ Farm Raised', '✅ Same-Day Processing', '✅ Ibadan Delivery'].map((t, i) => (
              <div key={i} className="trust-chip" style={{ animationDelay: (i * 100) + 'ms' }}>{t}</div>
            ))}
          </div>
        </div>

        {/* ─── RIGHT VISUAL ─── */}
        <div className={'hero-visual' + (revealed(3) ? ' visual-reveal' : ' txt-hidden')}>
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
              <div className="ribbon-price">₦1,500<span>/wk</span></div>
            </div>
          </div>

          <div className="hero-stats">
            {[
              { icon: '🐔', value: '100%', label: 'Farm Raised' },
              { icon: <Truck size={22} />, value: '₦2,000', label: 'Ibadan Delivery' },
              { icon: <Home size={22} />, value: 'FREE', label: 'Farm Pickup' },
            ].map((s, i) => (
              <div key={i} className="stat-card" style={{ animationDelay: (i * 150) + 'ms' }}>
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
