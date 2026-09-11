import React from 'react';
import { Leaf, Zap, Shield, MapPin, Heart, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './WhyChooseUs.css';

export default function WhyChooseUs() {
  const { siteSettings } = useApp();
  const ibadanFee = Number(siteSettings?.ibadan ?? 5000).toLocaleString('en-NG');

  const features = [
    {
      icon: <Leaf size={14} />,
      title: '100% Farm Raised',
      desc: 'Our chickens are raised on our own farm with no artificial hormones, antibiotics, or additives. Pure, natural poultry.',
      color: 'green',
    },
    {
      icon: <Shield size={14} />,
      title: 'Quality Guaranteed',
      desc: 'Every bird is inspected before dispatch. We stand behind the freshness and quality of everything we sell.',
      color: 'gold',
    },
    {
      icon: <Zap size={14} />,
      title: 'Same-Day Processing',
      desc: 'Order slaughtered, dressed, or frozen — processing is done same day so your chicken arrives in perfect condition.',
      color: 'green',
    },
    {
      icon: <MapPin size={14} />,
      title: 'Ibadan Delivery',
      desc: `We deliver within Ibadan for just ₦${ibadanFee}. Outside Ibadan? Reach us on WhatsApp and we'll sort out the logistics.`,
      color: 'gold',
    },
    {
      icon: <Heart size={14} />,
      title: 'Farm Pickup Free',
      desc: 'Want to come pick up your order yourself? Farm pickup is always completely FREE — no hidden charges.',
      color: 'green',
    },
    {
      icon: <Clock size={14} />,
      title: 'Easy Bank Transfer',
      desc: 'Simple payment — transfer to Samtob p&c Ltd · 0127186331 · Wema Bank, upload receipt, order confirmed.',
      color: 'gold',
    },
  ];
  return (
    <section className="why-section section-padding">
      <div className="container">
        <div className="why-header text-center">
          <span className="badge badge-gold">Why Samtob Farms</span>
          <h2 className="why-title">
            Fresh From the <span className="title-accent-gold">Farm</span> to Your Table
          </h2>
          <p className="why-subtitle">
            We cut out the middleman. Directly from our farm in Ibadan to your door — fresher, healthier, and better value.
          </p>
        </div>

        <div className="why-grid">
          {features.map((f, i) => (
            <div key={i} className={`why-card glass-card why-card--${f.color}`}>
              <div className={`why-icon why-icon--${f.color}`}>{f.icon}</div>
              <h3 className="why-card-title">{f.title}</h3>
              <p className="why-card-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing snapshot from flyer */}
        <div className="price-snapshot glass-card">
          <div className="price-snapshot-header">
            <h3>Weight Ranges & Pricing</h3>
            <p>Live bird prices — processing options available on request</p>
          </div>
          <div className="price-table">
            {[
              { range: '3.8kg – 4.1kg', note: 'Small Bird' },
              { range: '4.2kg – 4.5kg', note: 'Medium Bird' },
              { range: '4.6kg – 5.0kg', note: 'Large Bird' },
              { range: '5.1kg – 5.5kg+', note: 'Extra Large' },
            ].map((row, i) => (
              <div key={i} className="price-row">
                <span className="price-range">🐔 {row.range}</span>
                <span className="price-note">{row.note}</span>
                <span className="price-action">See Shop →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
