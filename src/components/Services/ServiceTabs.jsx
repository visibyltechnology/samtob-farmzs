import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Wrench, Droplet, Zap } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import './ServiceTabs.css';

const services = [
  {
    id: 'diagnostics',
    title: 'Vehicle Diagnostics',
    icon: <Zap size={24} />,
    description: 'We use a state-of-the-art vehicle diagnostics machine during the maintenance process to accurately identify engine faults, sensor failures, and electrical issues — ensuring precise repairs every time.',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'wheel',
    title: 'Digital Wheel Alignment & Balancing',
    icon: <Settings size={24} />,
    description: 'Our digital wheel alignment and balancing service corrects uneven tyre wear, steering pull, and vehicle vibration — extending tyre life and improving handling for a smoother, safer drive.',
    image: 'https://images.unsplash.com/photo-1615437893116-2c9388339178?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fluid',
    title: 'Oil Draining & Fluid Service',
    icon: <Droplet size={24} />,
    description: 'We use a professional oil draining machine for a clean, complete, and efficient oil change during every maintenance service — paired with original, high-quality engine oils and filters.',
    image: 'https://images.unsplash.com/photo-1605333856230-08c34fbc4db0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fitting',
    title: 'Machine Tyre Fitting',
    icon: <Wrench size={24} />,
    description: 'Tyres are fitted and removed using a dedicated tyre fitting machine — safe, fast, and scratch-free. Ideal for all tyre sizes including standard and alloy wheel fitments.',
    image: 'https://images.unsplash.com/photo-1590401826012-70b86a34791a?auto=format&fit=crop&q=80&w=600'
  }
];

export default function ServiceTabs() {
  const [activeTab, setActiveTab] = useState(services[0]);
  const { openQuote } = useModal();

  return (
    <section className="section-padding services-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Expert <span className="text-primary">Services</span></h2>
          <p className="section-subtitle">Advanced machinery for ultimate precision.</p>
        </div>

        <div className="services-container glass-card">
          <div className="services-tabs">
            {services.map(service => (
              <button
                key={service.id}
                className={`tab-btn ${activeTab.id === service.id ? 'active' : ''}`}
                onClick={() => setActiveTab(service)}
              >
                <span className="tab-icon">{service.icon}</span>
                <span className="tab-title">{service.title}</span>
                {activeTab.id === service.id && (
                  <motion.div
                    className="tab-indicator"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="services-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="service-panel"
              >
                <div className="service-info">
                  <h3>{activeTab.title}</h3>
                  <p>{activeTab.description}</p>
                  <button className="btn-primary mt-4" onClick={openQuote}>Book Service</button>
                </div>
                <div className="service-image-wrapper">
                  <img src={activeTab.image} alt={activeTab.title} className="service-image" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
