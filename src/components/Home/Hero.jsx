import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronDown, Leaf, Truck, Home } from 'lucide-react';
import { useLenis } from '@studio-freight/react-lenis';
import './Hero.css';

export default function Hero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);

  // Parallax tied into Lenis scroll loop
  useLenis(({ scroll }) => {
    if (bgRef.current) {
      bgRef.current.style.transform = `translate3d(0, ${scroll * 0.35}px, 0)`;
    }
  });

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-bg" ref={bgRef}></div>
      <div className="hero-overlay"></div>

      {/* Floating leaf decorations */}
      <div className="hero-leaf hero-leaf--1">🌿</div>
      <div className="hero-leaf hero-leaf--2">🍃</div>

      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Leaf size={14} />
            <span>Save for your X-mas Chicken!</span>
          </div>

          <h1 className="hero-title">
            Join the <span className="hero-title-accent">December Rush</span><br />
            <span className="hero-title-white">12-Week Installment Plan</span>
          </h1>

          <p className="hero-subtitle">
            Book your Christmas chickens early and pay in small weekly installments.
            Healthy, hormone-free chickens raised on our farm delivered right to your door in Ibadan. 
            Farm pickup always free.
          </p>

          <div className="hero-ctas">
            <Link to="/shop" className="btn-primary hero-btn hero-btn-primary">
              <ShoppingBag size={20} />
              Order Now
            </Link>
            <button onClick={scrollToHowItWorks} className="btn-outline hero-btn">
              How It Works
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="hero-trust">
            <div className="trust-item">✅ No Hormones</div>
            <div className="trust-item">✅ Farm Raised</div>
            <div className="trust-item">✅ Same-Day Processing</div>
          </div>
        </div>

        {/* Floating Stat Cards */}
        <div className="hero-stats">
          <div className="glass-card stat-card">
            <div className="stat-icon">🐔</div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Farm Raised</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon"><Truck size={24} /></div>
            <div className="stat-value">₦2,000</div>
            <div className="stat-label">Ibadan Delivery</div>
          </div>
          <div className="glass-card stat-card">
            <div className="stat-icon"><Home size={24} /></div>
            <div className="stat-value">FREE</div>
            <div className="stat-label">Farm Pickup</div>
          </div>
        </div>
      </div>
    </section>
  );
}
