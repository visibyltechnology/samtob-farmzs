import React from 'react';
import { CheckCircle, Star, Wrench } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useSubscription } from '../../context/SubscriptionContext';
import './MaintenanceSubscription.css';

export default function MaintenanceSubscription() {
  const { openSub } = useModal();
  const { plans } = useSubscription();

  return (
    <section className="sub-section section-padding">
      <div className="container">
        {/* Section Header */}
        <div className="sub-section-header">
          <div className="sub-badge">
            <Wrench size={14} />
            <span>Car Maintenance Plans</span>
          </div>
          <h2 className="sub-section-title">
            Keep Your Vehicle in <span className="text-primary">Peak Condition</span>
          </h2>
          <p className="sub-section-subtitle">
            Choose a subscription plan and let Akilapa &amp; Sons handle your routine maintenance — so you never miss an oil change, brake check, or service again.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="sub-plans-row">
          {plans.map((plan) => (
            <div key={plan.id} className={`sub-plan-card ${plan.popular ? 'sub-plan-card--popular' : ''}`}>
              {plan.popular && (
                <div className="sub-popular-badge">
                  <Star size={12} fill="currentColor" /> Most Popular
                </div>
              )}
              <div className="sub-plan-header">
                <h3 className="sub-plan-name">{plan.name}</h3>
                <div className="sub-plan-price">
                  <span className="sub-plan-amount">₦{(plan.price || 0).toLocaleString()}</span>
                  <span className="sub-plan-period">{plan.period}</span>
                </div>
              </div>
              <p className="sub-plan-desc">{plan.description}</p>
              <ul className="sub-plan-features">
                {(plan.features || []).map((f, i) => (
                  <li key={i}>
                    <CheckCircle size={14} className="sub-check-icon" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`sub-plan-btn ${plan.popular ? 'sub-plan-btn--primary' : 'sub-plan-btn--outline'}`}
                onClick={openSub}
              >
                {plan.popular ? 'Get Started' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div className="sub-cta-strip">
          <div>
            <p className="sub-cta-title">Not sure which plan fits you?</p>
            <p className="sub-cta-sub">Our experts are happy to recommend the right plan for your vehicle and budget.</p>
          </div>
          <button className="btn-outline" onClick={openSub}>View All Plans</button>
        </div>
      </div>
    </section>
  );
}
