import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import './InstantQuoteBuilder.css';

export default function InstantQuoteBuilder({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    service: ''
  });

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  const handleClose = () => {
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <motion.div 
        className="glass-card quote-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        <button className="close-modal-btn" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <h2>Instant Quote Builder</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="modal-body">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-step">
                <h3>Step 1: Vehicle Details</h3>
                <div className="form-group">
                  <label>Make</label>
                  <select value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})}>
                    <option value="">Select Make</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Lexus">Lexus</option>
                    <option value="Mercedes">Mercedes Benz</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input type="text" placeholder="e.g. Camry" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <input type="number" placeholder="e.g. 2018" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-step">
                <h3>Step 2: Required Service/Parts</h3>
                <div className="services-grid">
                  {['Full Service', 'Oil Change', 'Tyre Replacement', 'Brake Pads', 'Diagnostics'].map(svc => (
                    <div 
                      key={svc} 
                      className={`service-option ${formData.service === svc ? 'selected' : ''}`}
                      onClick={() => setFormData({...formData, service: svc})}
                    >
                      {svc}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="form-step text-center">
                <CheckCircle size={64} className="text-primary mx-auto mb-4" style={{ margin: '0 auto 1rem' }} />
                <h3>Quote Generated!</h3>
                <div className="quote-summary glass-card mt-4">
                  <p><strong>Vehicle:</strong> {formData.year} {formData.make} {formData.model}</p>
                  <p><strong>Service:</strong> {formData.service}</p>
                  <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }} />
                  <h4>Estimated Cost: <span className="text-primary">₦25,000 - ₦45,000</span></h4>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="modal-footer">
          {step > 1 && step < 3 && (
            <button className="btn-outline" onClick={handlePrev}><ChevronLeft size={20} /> Back</button>
          )}
          {step < 3 ? (
            <button className="btn-primary" onClick={handleNext} style={{ marginLeft: 'auto' }}>
              Next <ChevronRight size={20} />
            </button>
          ) : (
            <button className="btn-primary w-full" onClick={handleClose}>Finish & Send to WhatsApp</button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
