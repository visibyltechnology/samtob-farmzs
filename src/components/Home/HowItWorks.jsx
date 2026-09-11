import React from 'react';
import { Link } from 'react-router-dom';
import { MousePointerClick, Weight, ShoppingCart, Truck, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './HowItWorks.css';

export default function HowItWorks() {
  const { siteSettings } = useApp();
  
  const steps = [
  {
    icon: <MousePointerClick size={32} />,
    number: '01',
    title: 'Visit Our Shop',
    desc: 'Browse our selection of farm-raised chickens. Click on any product to view details, available weights, and pricing.',
  },
  {
    icon: <Weight size={32} />,
    number: '02',
    title: 'Pick Weight & Quantity',
    desc: 'Choose your preferred weight range (3.8kg – 5.5kg+) and how many birds you need. Prices are auto-calculated.',
  },
  {
    icon: <Truck size={32} />,
    number: '03',
    title: 'Choose Delivery Option',
    desc: `Farm Pickup is always FREE. Delivery within Ibadan is ₦${Number(siteSettings?.ibadan ?? 5000).toLocaleString('en-NG')}. Outside Ibadan? Contact us for rates.`,
  },
  {
    icon: <ShoppingCart size={32} />,
    number: '04',
    title: 'Select Processing',
    desc: 'Tell us how you want your chicken — Live, Slaughtered, Dressed, or Frozen. All done on request at no extra charge.',
  },
  {
    icon: <CheckCircle size={32} />,
    number: '05',
    title: 'Pay & Confirm',
    desc: 'Transfer to Samtob p&c Ltd · 0127186331 · Wema Bank, upload your receipt, and we\'ll confirm your order right away.',
  },
];

  return (
    <section className="how-section section-padding" id="how-it-works">
      <div className="container">
        <div className="how-header text-center">
          <span className="badge badge-green">Simple Process</span>
          <h2 className="how-title">
            How It <span className="title-accent">Works</span>
          </h2>
          <p className="how-subtitle">
            Ordering fresh farm chickens from Samtob Farms is quick, transparent, and easy — just 5 steps.
          </p>
        </div>

        <div className="how-steps">
          {steps.map((step, i) => (
            <div key={i} className="how-step glass-card">
              <div className="how-step-number">{step.number}</div>
              <div className="how-step-icon">{step.icon}</div>
              <h3 className="how-step-title">{step.title}</h3>
              <p className="how-step-desc">{step.desc}</p>
              {i < steps.length - 1 && <div className="how-step-connector" />}
            </div>
          ))}
        </div>

        <div className="how-cta text-center">
          <Link to="/shop" className="btn-primary" style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}>
            Start Your Order
          </Link>
          <a
            href="https://wa.me/2347055310766"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
            style={{ fontSize: '1.05rem', padding: '0.9rem 2.5rem' }}
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
