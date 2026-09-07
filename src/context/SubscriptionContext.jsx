import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Checkup',
    price: 15000,
    period: '/month',
    description: 'Full vehicle checkup every month including oil top-up, brake inspection, and tyre pressure check.',
    features: ['Monthly Oil Top-Up', 'Brake Inspection', 'Tyre Pressure Check', 'Priority Booking'],
    popular: false,
  },
  {
    id: 'quarterly',
    name: 'Quarterly Oil & Filter',
    price: 25000,
    period: '/quarter',
    description: 'Complete oil and filter replacement every 3 months using premium synthetic oil.',
    features: ['Full Oil Change', 'Oil Filter Replacement', 'Engine Flush', 'Free Diagnostics Scan'],
    popular: true,
  },
  {
    id: 'yearly',
    name: 'Annual Overhaul',
    price: 150000,
    period: '/year',
    description: 'Comprehensive annual vehicle overhaul including all fluids, brakes, alignment and a full parts inspection.',
    features: ['All Quarterly Features', 'Full Fluid Replacement', 'Wheel Alignment', 'Brake System Overhaul', 'VIP Support Line'],
    popular: false,
  }
];

const STORAGE_KEY = 'akilapa_subscription_plans';

const SubscriptionContext = createContext();

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({ children }) {
  const [plans, setPlans] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PLANS;
    } catch {
      return DEFAULT_PLANS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }, [plans]);

  const addPlan = (plan) => {
    const newPlan = { ...plan, id: `plan_${Date.now()}` };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (id, updates) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlan = (id) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const resetToDefaults = () => {
    setPlans(DEFAULT_PLANS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <SubscriptionContext.Provider value={{ plans, addPlan, updatePlan, deletePlan, resetToDefaults }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
