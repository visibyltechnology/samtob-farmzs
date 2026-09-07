import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';

export const DEFAULT_CATEGORIES = [];

export const DEFAULT_BRANDS = [
  { name: 'Bosch',        order: 0 },
  { name: 'Bridgestone',  order: 1 },
  { name: 'Michelin',     order: 2 },
  { name: 'Dunlop',       order: 3 },
  { name: 'Pirelli',      order: 4 },
  { name: 'Continental',  order: 5 },
  { name: 'Denso',        order: 6 },
  { name: 'NGK',          order: 7 },
  { name: 'Castrol',      order: 8 },
  { name: 'Total',        order: 9 },
  { name: 'Mobil',        order: 10 },
  { name: 'Shell',        order: 11 },
  { name: 'Brembo',       order: 12 },
  { name: 'Exide',        order: 13 },
  { name: 'Varta',        order: 14 },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────
const categoriesRef = () => collection(db, 'categories');

export function listenToCategories(callback) {
  const q = query(categoriesRef(), orderBy('order', 'asc'));
  return onSnapshot(q, snap => {
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fetchedNames = fetched.map(c => c.name.toLowerCase());
    const defaults = DEFAULT_CATEGORIES.filter(c => !fetchedNames.includes(c.name.toLowerCase()));
    const merged = [...defaults, ...fetched].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    callback(merged);
  });
}

export async function addCategory(data) {
  return addDoc(categoriesRef(), { ...data, createdAt: new Date() });
}

export async function updateCategory(id, data) {
  return updateDoc(doc(db, 'categories', id), data);
}

export async function deleteCategory(id) {
  return deleteDoc(doc(db, 'categories', id));
}

export async function seedTaxonomy() {
  const data = [
    // ── Car Parts ──────────────────────────────────────────────────
    { type: 'department', department: 'Car Parts', name: 'Car Parts', order: 1 },
    { type: 'category', department: 'Car Parts', category: 'Engine & Drivetrain', name: 'Engine & Drivetrain', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Engine & Drivetrain', subcategory: 'Engine Oil', name: 'Engine Oil', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Engine & Drivetrain', subcategory: 'Oil Filters', name: 'Oil Filters', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Engine & Drivetrain', subcategory: 'Air Filters', name: 'Air Filters', order: 3 },
    { type: 'subcategory', department: 'Car Parts', category: 'Engine & Drivetrain', subcategory: 'Spark Plugs', name: 'Spark Plugs', order: 4 },
    { type: 'subcategory', department: 'Car Parts', category: 'Engine & Drivetrain', subcategory: 'Timing Belts', name: 'Timing Belts', order: 5 },
    { type: 'category', department: 'Car Parts', category: 'Brakes & Suspension', name: 'Brakes & Suspension', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Brakes & Suspension', subcategory: 'Brake Pads', name: 'Brake Pads', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Brakes & Suspension', subcategory: 'Brake Discs', name: 'Brake Discs', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Brakes & Suspension', subcategory: 'Shock Absorbers', name: 'Shock Absorbers', order: 3 },
    { type: 'subcategory', department: 'Car Parts', category: 'Brakes & Suspension', subcategory: 'Wheel Bearings', name: 'Wheel Bearings', order: 4 },
    { type: 'category', department: 'Car Parts', category: 'Electrical & Lighting', name: 'Electrical & Lighting', order: 3 },
    { type: 'subcategory', department: 'Car Parts', category: 'Electrical & Lighting', subcategory: 'Car Batteries', name: 'Car Batteries', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Electrical & Lighting', subcategory: 'Alternators', name: 'Alternators', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Electrical & Lighting', subcategory: 'Headlights', name: 'Headlights', order: 3 },
    { type: 'subcategory', department: 'Car Parts', category: 'Electrical & Lighting', subcategory: 'Sensors', name: 'Sensors', order: 4 },
    { type: 'category', department: 'Car Parts', category: 'Cooling System', name: 'Cooling System', order: 4 },
    { type: 'subcategory', department: 'Car Parts', category: 'Cooling System', subcategory: 'Radiators', name: 'Radiators', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Cooling System', subcategory: 'Water Pumps', name: 'Water Pumps', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Cooling System', subcategory: 'Thermostats', name: 'Thermostats', order: 3 },
    { type: 'category', department: 'Car Parts', category: 'Exhaust System', name: 'Exhaust System', order: 5 },
    { type: 'subcategory', department: 'Car Parts', category: 'Exhaust System', subcategory: 'Exhaust Pipes', name: 'Exhaust Pipes', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Exhaust System', subcategory: 'Catalytic Converters', name: 'Catalytic Converters', order: 2 },
    { type: 'category', department: 'Car Parts', category: 'Transmission', name: 'Transmission', order: 6 },
    { type: 'subcategory', department: 'Car Parts', category: 'Transmission', subcategory: 'Clutch Kits', name: 'Clutch Kits', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Transmission', subcategory: 'CV Joints', name: 'CV Joints', order: 2 },
    { type: 'category', department: 'Car Parts', category: 'Body & Exterior', name: 'Body & Exterior', order: 7 },
    { type: 'subcategory', department: 'Car Parts', category: 'Body & Exterior', subcategory: 'Bumpers', name: 'Bumpers', order: 1 },
    { type: 'subcategory', department: 'Car Parts', category: 'Body & Exterior', subcategory: 'Mirrors', name: 'Mirrors', order: 2 },
    { type: 'subcategory', department: 'Car Parts', category: 'Body & Exterior', subcategory: 'Wipers', name: 'Wipers', order: 3 },

    // ── Tyres & Wheels ─────────────────────────────────────────────
    { type: 'department', department: 'Tyres & Wheels', name: 'Tyres & Wheels', order: 2 },
    { type: 'category', department: 'Tyres & Wheels', category: 'Tyres', name: 'Tyres', order: 1 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Tyres', subcategory: 'Passenger Tyres', name: 'Passenger Tyres', order: 1 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Tyres', subcategory: 'SUV & 4x4 Tyres', name: 'SUV & 4x4 Tyres', order: 2 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Tyres', subcategory: 'Commercial Tyres', name: 'Commercial Tyres', order: 3 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Tyres', subcategory: 'Performance Tyres', name: 'Performance Tyres', order: 4 },
    { type: 'category', department: 'Tyres & Wheels', category: 'Wheels & Rims', name: 'Wheels & Rims', order: 2 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Wheels & Rims', subcategory: 'Alloy Wheels', name: 'Alloy Wheels', order: 1 },
    { type: 'subcategory', department: 'Tyres & Wheels', category: 'Wheels & Rims', subcategory: 'Steel Rims', name: 'Steel Rims', order: 2 },

    // ── Car Accessories ────────────────────────────────────────────
    { type: 'department', department: 'Car Accessories', name: 'Car Accessories', order: 3 },
    { type: 'category', department: 'Car Accessories', category: 'Interior Accessories', name: 'Interior Accessories', order: 1 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Interior Accessories', subcategory: 'Car Mats', name: 'Car Mats', order: 1 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Interior Accessories', subcategory: 'Seat Covers', name: 'Seat Covers', order: 2 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Interior Accessories', subcategory: 'Dashboard Cameras', name: 'Dashboard Cameras', order: 3 },
    { type: 'category', department: 'Car Accessories', category: 'Electronics & Tech', name: 'Electronics & Tech', order: 2 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Electronics & Tech', subcategory: 'Car Audio', name: 'Car Audio', order: 1 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Electronics & Tech', subcategory: 'OBD Scanners', name: 'OBD Scanners', order: 2 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Electronics & Tech', subcategory: 'Jump Starters', name: 'Jump Starters', order: 3 },
    { type: 'category', department: 'Car Accessories', category: 'Tools & Equipment', name: 'Tools & Equipment', order: 3 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Tools & Equipment', subcategory: 'Car Jacks', name: 'Car Jacks', order: 1 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Tools & Equipment', subcategory: 'Torque Wrenches', name: 'Torque Wrenches', order: 2 },
    { type: 'subcategory', department: 'Car Accessories', category: 'Tools & Equipment', subcategory: 'Jump Cables', name: 'Jump Cables', order: 3 },

    // ── Lubricants & Fluids ────────────────────────────────────────
    { type: 'department', department: 'Lubricants & Fluids', name: 'Lubricants & Fluids', order: 4 },
    { type: 'category', department: 'Lubricants & Fluids', category: 'Engine Oils', name: 'Engine Oils', order: 1 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Engine Oils', subcategory: 'Fully Synthetic', name: 'Fully Synthetic', order: 1 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Engine Oils', subcategory: 'Semi-Synthetic', name: 'Semi-Synthetic', order: 2 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Engine Oils', subcategory: 'Mineral Oil', name: 'Mineral Oil', order: 3 },
    { type: 'category', department: 'Lubricants & Fluids', category: 'Other Fluids', name: 'Other Fluids', order: 2 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Other Fluids', subcategory: 'Brake Fluid', name: 'Brake Fluid', order: 1 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Other Fluids', subcategory: 'Coolant / Antifreeze', name: 'Coolant / Antifreeze', order: 2 },
    { type: 'subcategory', department: 'Lubricants & Fluids', category: 'Other Fluids', subcategory: 'Power Steering Fluid', name: 'Power Steering Fluid', order: 3 },

    // ── Maintenance Services ───────────────────────────────────────
    { type: 'department', department: 'Maintenance Services', name: 'Maintenance Services', order: 5 },
    { type: 'category', department: 'Maintenance Services', category: 'Routine Servicing', name: 'Routine Servicing', order: 1 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Routine Servicing', subcategory: 'Oil Change', name: 'Oil Change', order: 1 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Routine Servicing', subcategory: 'Full Service', name: 'Full Service', order: 2 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Routine Servicing', subcategory: 'Minor Service', name: 'Minor Service', order: 3 },
    { type: 'category', department: 'Maintenance Services', category: 'Tyre Services', name: 'Tyre Services', order: 2 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Tyre Services', subcategory: 'Tyre Fitting', name: 'Tyre Fitting', order: 1 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Tyre Services', subcategory: 'Wheel Balancing', name: 'Wheel Balancing', order: 2 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Tyre Services', subcategory: 'Wheel Alignment', name: 'Wheel Alignment', order: 3 },
    { type: 'category', department: 'Maintenance Services', category: 'Diagnostics', name: 'Diagnostics', order: 3 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Diagnostics', subcategory: 'Computer Diagnostics', name: 'Computer Diagnostics', order: 1 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'Diagnostics', subcategory: 'Engine Check', name: 'Engine Check', order: 2 },
    { type: 'category', department: 'Maintenance Services', category: 'AC Services', name: 'AC Services', order: 4 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'AC Services', subcategory: 'AC Regas', name: 'AC Regas', order: 1 },
    { type: 'subcategory', department: 'Maintenance Services', category: 'AC Services', subcategory: 'AC Repair', name: 'AC Repair', order: 2 },
  ];

  for (const item of data) {
    await addCategory(item);
  }
}

// ─── BRANDS ──────────────────────────────────────────────────────────────────
const brandsRef = () => collection(db, 'brands');

export function listenToBrands(callback) {
  const q = query(brandsRef(), orderBy('order', 'asc'));
  return onSnapshot(q, snap => {
    const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const fetchedNames = fetched.map(b => b.name.toLowerCase());
    const defaults = DEFAULT_BRANDS.filter(b => !fetchedNames.includes(b.name.toLowerCase()));
    const merged = [...defaults, ...fetched].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    callback(merged);
  });
}

export async function addBrand(data) {
  return addDoc(brandsRef(), { ...data, createdAt: new Date() });
}

export async function updateBrand(id, data) {
  return updateDoc(doc(db, 'brands', id), data);
}

export async function deleteBrand(id) {
  return deleteDoc(doc(db, 'brands', id));
}
