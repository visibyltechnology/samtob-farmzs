import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, CheckCircle, RotateCcw, Shield } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import './AdminDashboard.css';

const ADMIN_PASSWORD = 'akilapa2024'; // In production, replace with Firebase Auth

function PlanForm({ initial = null, onSave, onCancel }) {
  const [form, setForm] = useState(initial || {
    name: '',
    price: '',
    period: '/month',
    description: '',
    features: [''],
    popular: false,
  });

  const updateFeature = (i, val) => {
    const updated = [...form.features];
    updated[i] = val;
    setForm({ ...form, features: updated });
  };

  const addFeature = () => setForm({ ...form, features: [...form.features, ''] });
  const removeFeature = (i) => setForm({ ...form, features: form.features.filter((_, idx) => idx !== i) });

  return (
    <div className="plan-form glass-card">
      <div className="form-group">
        <label>Plan Name</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Monthly Checkup" />
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label>Price (₦)</label>
          <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 15000" />
        </div>
        <div className="form-group">
          <label>Period</label>
          <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
            <option value="/month">/month</option>
            <option value="/quarter">/quarter</option>
            <option value="/year">/year</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Short description of the plan..." />
      </div>
      <div className="form-group">
        <label>Features</label>
        {form.features.map((f, i) => (
          <div key={i} className="feature-row">
            <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder={`Feature ${i + 1}`} />
            <button type="button" className="remove-feature-btn" onClick={() => removeFeature(i)}><X size={16} /></button>
          </div>
        ))}
        <button type="button" className="add-feature-btn" onClick={addFeature}><Plus size={16} /> Add Feature</button>
      </div>
      <div className="form-group checkbox-row">
        <label>
          <input type="checkbox" checked={form.popular} onChange={e => setForm({ ...form, popular: e.target.checked })} />
          Mark as "Most Popular"
        </label>
      </div>
      <div className="form-actions">
        <button className="btn-outline" onClick={onCancel}><X size={16} /> Cancel</button>
        <button className="btn-primary" onClick={() => onSave(form)}><Save size={16} /> Save Plan</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const { plans, addPlan, updatePlan, deletePlan, resetToDefaults } = useSubscription();

  // Mock active subscriptions for the tracker
  const activeSubscriptions = [
    { id: 1, user: 'John Doe', email: 'john@example.com', plan: 'Quarterly Oil & Filter', status: 'Active', nextBilling: '2026-12-01' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', plan: 'Monthly Checkup', status: 'Active', nextBilling: '2026-10-01' },
    { id: 3, user: 'Samuel O.', email: 'sam@example.com', plan: 'Annual Overhaul', status: 'Past Due', nextBilling: '2026-08-15' }
  ];

  return (
    <div className="admin-dashboard section-padding">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="section-title">Admin <span className="text-primary">Dashboard</span></h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage subscription plans for the public portal.</p>
          </div>
          <div className="admin-header-actions">
            <button className="btn-outline" onClick={resetToDefaults}>
              <RotateCcw size={16} /> Reset Defaults
            </button>
            <button className="btn-primary" onClick={() => { setIsAdding(true); setEditingId(null); }}>
              <Plus size={16} /> New Plan
            </button>
          </div>
        </div>

        {/* Add Plan Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: '2rem' }}
            >
              <h3 style={{ marginBottom: '1rem' }}>New Plan</h3>
              <PlanForm
                onSave={(data) => { addPlan(data); setIsAdding(false); }}
                onCancel={() => setIsAdding(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans List */}
        <div className="plans-list">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-plan-card glass-card"
            >
              {editingId === plan.id ? (
                <PlanForm
                  initial={plan}
                  onSave={(data) => { updatePlan(plan.id, data); setEditingId(null); }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="plan-row">
                  <div className="plan-info">
                    <div className="plan-title-row">
                      <h3>{plan.name}</h3>
                      {plan.popular && <span className="popular-tag">Popular</span>}
                    </div>
                    <span className="plan-price-tag">₦{Number(plan.price).toLocaleString()}{plan.period}</span>
                    <p className="plan-desc-text">{plan.description}</p>
                    <div className="feature-chips">
                      {plan.features.filter(Boolean).map((f, i) => <span key={i} className="chip">{f}</span>)}
                    </div>
                  </div>
                  <div className="plan-actions">
                    <button className="action-btn edit" onClick={() => { setEditingId(plan.id); setIsAdding(false); }}>
                      <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete" onClick={() => deletePlan(plan.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {plans.length === 0 && (
            <div className="empty-plans">
              <p>No subscription plans yet. Add one above!</p>
            </div>
          )}
        </div>

        {/* Subscription Tracker */}
        <div style={{ marginTop: '48px' }}>
          <h2 className="section-title" style={{ fontSize: '20px', marginBottom: '16px' }}>Active <span className="text-primary">Subscribers Tracker</span></h2>
          <div className="glass-card" style={{ padding: 0, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--dark-border)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px', fontSize: '13px', color: 'var(--gray-2)' }}>User</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: 'var(--gray-2)' }}>Plan</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: 'var(--gray-2)' }}>Status</th>
                  <th style={{ padding: '16px', fontSize: '13px', color: 'var(--gray-2)' }}>Next Billing</th>
                </tr>
              </thead>
              <tbody>
                {activeSubscriptions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--dark-border)' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 800, fontSize: '14px' }}>{sub.user}</div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-2)' }}>{sub.email}</div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: 600 }}>{sub.plan}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', padding: '4px 10px', borderRadius: '20px',
                        background: sub.status === 'Active' ? 'rgba(0, 230, 118, 0.1)' : 'rgba(255, 61, 0, 0.1)',
                        color: sub.status === 'Active' ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {sub.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--gray-1)' }}>{sub.nextBilling}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
