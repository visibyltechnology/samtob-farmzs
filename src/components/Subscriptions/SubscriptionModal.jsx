import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Star } from 'lucide-react';
import { useSubscription } from '../../context/SubscriptionContext';
import './SubscriptionModal.css';

export default function SubscriptionModal({ isOpen, onClose }) {
  const { plans } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [step, setStep] = useState(1);
  const [subscribed, setSubscribed] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setStep(1);
      setSelectedPlan(null);
      setVehicle('');
      setEmail('');
      onClose();
    }, 2500);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedPlan(null);
    setSubscribed(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div
        className="glass-card sub-modal"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="close-modal-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {!subscribed ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              
              {step === 1 && (
                <>
                  <div className="sub-header">
                    <h2>Maintenance <span className="text-primary">Subscriptions</span></h2>
                    <p>Choose a plan that keeps your vehicle in peak condition year-round.</p>
                  </div>

                  <div className="plans-grid">
                    {plans.map(plan => (
                      <div
                        key={plan.id}
                        className={`plan-card glass-card ${selectedPlan?.id === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        {plan.popular && <div className="popular-badge"><Star size={12} /> Most Popular</div>}
                        <h3 className="plan-name">{plan.name}</h3>
                        <div className="plan-price">
                          <span className="price-amount">₦{Number(plan.price).toLocaleString()}</span>
                          <span className="price-period">{plan.period}</span>
                        </div>
                        <p className="plan-desc">{plan.description}</p>
                        <ul className="plan-features">
                          {plan.features.map((f, i) => (
                            <li key={i}><CheckCircle size={14} /> {f}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <button
                    className="btn-primary w-full mt-4"
                    onClick={() => setStep(2)}
                    disabled={!selectedPlan}
                    style={{ opacity: selectedPlan ? 1 : 0.5 }}
                  >
                    Continue with {selectedPlan?.name || 'a Plan'}
                  </button>
                </>
              )}

              {step === 2 && (
                <form onSubmit={handleSubscribe} className="sub-form">
                  <div className="sub-header">
                    <h2>Your Details</h2>
                    <p>Plan: <strong className="text-primary">{selectedPlan?.name}</strong> — ₦{Number(selectedPlan?.price).toLocaleString()}{selectedPlan?.period}</p>
                  </div>
                  <div className="form-group">
                    <label>Vehicle Make & Model</label>
                    <input type="text" placeholder="e.g. Honda Accord 2015" value={vehicle} onChange={e => setVehicle(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                  <div className="form-row">
                    <button type="button" className="btn-outline" onClick={() => setStep(1)}>← Back</button>
                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Subscribe Now</button>
                  </div>
                </form>
              )}

            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sub-success">
              <CheckCircle size={64} className="text-primary" />
              <h3>Subscribed Successfully!</h3>
              <p>You will receive a confirmation email shortly with your subscription details.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
