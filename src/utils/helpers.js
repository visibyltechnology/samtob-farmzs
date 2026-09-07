/**
 * Shared utility functions and helpers used across pages.
 * Centralised here to avoid cross-page imports.
 */
import { Package, BatteryCharging, Cable, Droplet, Wrench } from 'lucide-react';
import React from 'react';

/**
 * Returns an appropriate icon element for a given product category string.
 */
export function getProductIcon(category = '') {
  const cat = category.toLowerCase();
  if (cat.includes('battery') || cat.includes('batter')) return React.createElement(BatteryCharging, { size: 20 });
  if (cat.includes('oil') || cat.includes('fluid') || cat.includes('lubric')) return React.createElement(Droplet, { size: 20 });
  if (cat.includes('cable') || cat.includes('wire') || cat.includes('electric')) return React.createElement(Cable, { size: 20 });
  if (cat.includes('tyre') || cat.includes('brake') || cat.includes('filter') || cat.includes('part')) return React.createElement(Wrench, { size: 20 });
  return React.createElement(Package, { size: 20 });
}

/**
 * Formats a number as Nigerian Naira.
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  return `₦${Number(amount || 0).toLocaleString('en-NG')}`;
}
