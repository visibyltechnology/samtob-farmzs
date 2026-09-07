import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, CreditCard } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">

          {/* Brand & Contact */}
          <div className="footer-brand">
            <div className="footer-logo-wrap">
              <img src="/logo.jpeg" alt="Samtob Farmzs" className="footer-logo-img" />
              <div>
                <h2 className="footer-logo-text">Samtob<span className="footer-accent">Farmzs</span></h2>
                <p className="footer-tagline">Healthy Chickens • Fresh Future</p>
              </div>
            </div>
            <p className="footer-desc">
              A premier poultry farm based in Ibadan, Nigeria. We raise healthy, hormone-free chickens 
              and deliver them fresh to your door. Quality you can taste, pricing you can afford.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin size={18} className="contact-icon" />
                <span>Ibadan, Oyo State, Nigeria</span>
              </div>
              <div className="contact-item">
                <Phone size={18} className="contact-icon" />
                <a href="tel:+2347055310766" style={{ color: 'inherit' }}>+234 705 531 0766</a>
              </div>
              <div className="contact-item">
                {/* WhatsApp */}
                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="currentColor" className="contact-icon" style={{ color: '#25D366' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/2347055310766" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
                  WhatsApp: +234 705 531 0766
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3 className="footer-title">Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">Shop Chickens</Link></li>
              <li><a href="/#how-it-works">How It Works</a></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/profile">My Orders</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Payment & Delivery Info */}
          <div className="footer-payment">
            <h3 className="footer-title">Payment & Delivery</h3>

            <div className="payment-block">
              <div className="payment-block-label">
                <CreditCard size={16} />
                Bank Transfer
              </div>
              <div className="bank-details">
                <div className="bank-name">Samtob p&c Ltd</div>
                <div className="bank-acct">0127186331</div>
                <div className="bank-bank">Wema Bank</div>
              </div>
            </div>

            <div className="delivery-block">
              <h4>Delivery Options</h4>
              <div className="delivery-item">
                <span>🚚 Within Ibadan</span>
                <span className="delivery-price">₦2,000</span>
              </div>
              <div className="delivery-item">
                <span>📍 Outside Ibadan</span>
                <span className="delivery-price delivery-price--muted">Contact Us</span>
              </div>
              <div className="delivery-item">
                <span>🏡 Farm Pickup</span>
                <span className="delivery-price delivery-price--free">FREE</span>
              </div>
            </div>

            <div className="processing-block">
              <h4>Processing Options</h4>
              <p>Live · Slaughtered · Dressed · Frozen — all available on request</p>
            </div>
          </div>

        </div>

        {/* Social + Bottom */}
        <div className="footer-bottom-row">
          <div className="footer-socials">
            <a href="https://wa.me/2347055310766" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-btn social-btn--whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a href="#" aria-label="Facebook" className="social-btn social-btn--fb">Facebook</a>
            <a href="#" aria-label="Instagram" className="social-btn social-btn--ig">Instagram</a>
          </div>
          <div className="footer-bottom-copy">
            <p>© {new Date().getFullYear()} Samtob p&c Ltd (Samtob Farmzs). All Rights Reserved.</p>
            <p className="footer-sub-copy">Quality Chicken ★ Happy Families ★ A Healthier Tomorrow</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
