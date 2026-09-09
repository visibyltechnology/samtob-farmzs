import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, Truck, Home, Star, ArrowRight } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef   = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  useLenis(({ scroll }) => {
    if (bgRef.current) {
      bgRef.current.style.transform = 'translate3d(0,' + (scroll * 0.35) + 'px,0)';
    }
  });

  const scrollDown = () => {
    const s = document.getElementById('how-it-works');
    if (s) s.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={'hero-section' + (mounted ? ' hero-mounted' : '')} ref={heroRef}>
      {/* Parallax background */}
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-overlay" />

      {/* Animated particles */}
      <div className="hero-particles">
        {[...Array(18)].map((_, i) => <div key={i} className={'hero-particle p' + (i % 6)} />)}
      </div>

      {/* Animated rings */}
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
        {/* LEFT — content */}
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge hero-anim-1">
            <span className="badge-pulse" />
            <Star size={12} fill="currentColor" />
            <span>Limited Season Offer — Book Now!</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title hero-anim-2">
            <span className="hero-tag-line">Join the</span>
            <span className="hero-rush-word december-rush-animate">December Rush</span>
            <span className="hero-sub-line">Installment Plan</span>
          </h1>

          {/* Sub */}
          <p className="hero-subtitle hero-anim-3">
            Book your Christmas chickens early and pay in small weekly installments.
            Healthy, hormone-free birds raised on our farm — delivered to your door
            in Ibadan. Farm pickup always free.
          </p>

          {/* CTAs */}
          <div className="hero-ctas hero-anim-4">
            <Link to="/shop" className="hero-btn-primary">
              <ShoppingBag size={20} />
              <span>Order Now</span>
              <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <button onClick={scrollDown} className="hero-btn-outline">
              How It Works
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="hero-trust hero-anim-5">
            <div className="trust-chip">✅ No Hormones</div>
            <div className="trust-chip">✅ Farm Raised</div>
            <div className="trust-chip">✅ Same-Day Processing</div>
            <div className="trust-chip">✅ Ibadan Delivery</div>
          </div>
        </div>

        {/* RIGHT — image + stats */}
        <div className="hero-visual hero-anim-2">
          {/* Main image card */}
          <div className="hero-image-card">
            <img
              src="/products/live_chicken.jpg"
              alt="Fresh farm chickens ready for Christmas"
              className="hero-img"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1548550023-2bf3c49b338c?w=800&q=80'; }}
            />
            <div className="hero-img-overlay" />
            {/* Floating tag on image */}
            <div className="hero-img-tag">
              <span className="img-tag-dot" />
              <span>Farm Fresh • Hormone-Free</span>
            </div>
            {/* Price ribbon */}
            <div className="hero-price-ribbon">
              <div className="ribbon-label">Starting from</div>
              <div className="ribbon-price">₦1,500<span>/wk</span></div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="hero-stats">
            <div className="stat-card hero-anim-stat-1">
              <div className="stat-icon">🐔</div>
              <div className="stat-value">100%</div>
              <div className="stat-label">Farm Raised</div>
            </div>
            <div className="stat-card hero-anim-stat-2">
              <div className="stat-icon"><Truck size={22} /></div>
              <div className="stat-value">₦2,000</div>
              <div className="stat-label">Ibadan Delivery</div>
            </div>
            <div className="stat-card hero-anim-stat-3">
              <div className="stat-icon"><Home size={22} /></div>
              <div className="stat-value">FREE</div>
              <div className="stat-label">Farm Pickup</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <button onClick={scrollDown} className="hero-scroll-cue">
        <ChevronDown size={20} />
      </button>
    </section>
  );
}
