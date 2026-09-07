// Full taxonomy — Akilapa & Sons Auto Workshop
// Department > Category > Subcategory hierarchy
export const categoryTaxonomy = {
  'Car Parts': {
    'Engine & Drivetrain': ['Engine Oil', 'Oil Filters', 'Air Filters', 'Fuel Filters', 'Spark Plugs', 'Timing Belts', 'Gaskets', 'Pistons & Rings', 'Camshafts'],
    'Brakes & Suspension': ['Brake Pads', 'Brake Discs', 'Brake Drums', 'Shock Absorbers', 'Struts', 'Control Arms', 'Ball Joints', 'Tie Rods', 'Wheel Bearings'],
    'Electrical & Lighting': ['Car Batteries', 'Alternators', 'Starters', 'Headlights', 'Tail Lights', 'Fog Lights', 'Relays & Fuses', 'Sensors', 'ECU & Modules'],
    'Cooling System': ['Radiators', 'Water Pumps', 'Thermostats', 'Coolant Hoses', 'Radiator Fans', 'Coolant / Antifreeze'],
    'Exhaust System': ['Exhaust Pipes', 'Mufflers', 'Catalytic Converters', 'Exhaust Manifolds', 'Lambda Sensors'],
    'Transmission': ['Gearbox Parts', 'Clutch Kits', 'Transmission Fluid', 'CV Joints', 'Drive Shafts', 'Differential Parts'],
    'Steering': ['Power Steering Pumps', 'Steering Racks', 'Steering Columns', 'Power Steering Fluid'],
    'Body & Exterior': ['Bumpers', 'Fenders', 'Bonnets', 'Doors', 'Mirrors', 'Windshields', 'Wipers', 'Body Kits'],
  },
  'Tyres & Wheels': {
    'Tyres': ['Passenger Tyres', 'SUV & 4x4 Tyres', 'Commercial Tyres', 'Run-Flat Tyres', 'Performance Tyres'],
    'Wheels & Rims': ['Steel Rims', 'Alloy Wheels', 'Wheel Caps', 'Hub Caps'],
    'Tyre Accessories': ['Tyre Pressure Gauges', 'Wheel Nuts & Bolts', 'Valve Stems', 'Tyre Sealant', 'Spare Tyre Covers'],
  },
  'Car Accessories': {
    'Interior Accessories': ['Car Mats', 'Seat Covers', 'Steering Wheel Covers', 'Car Fresheners', 'Dashboard Cameras', 'Phone Holders'],
    'Exterior Accessories': ['Car Covers', 'Roof Racks', 'Tow Bars', 'Mud Flaps', 'Spoilers', 'Chrome Trim'],
    'Electronics & Tech': ['Car Audio', 'GPS Navigation', 'Reverse Cameras', 'Car Chargers', 'Jump Starters', 'OBD Scanners'],
    'Tools & Equipment': ['Car Jacks', 'Tyre Changers', 'Torque Wrenches', 'Jump Cables', 'Funnels & Measuring Tools'],
  },
  'Maintenance Services': {
    'Routine Servicing': ['Oil Change', 'Full Service', 'Minor Service', 'Major Service'],
    'Brake Services': ['Brake Pad Replacement', 'Brake Disc Skimming', 'Brake Fluid Change', 'Brake Inspection'],
    'Tyre Services': ['Tyre Fitting', 'Wheel Balancing', 'Wheel Alignment', 'Tyre Rotation', 'Puncture Repair'],
    'Diagnostics': ['Computer Diagnostics', 'Engine Check', 'Electrical Fault Finding', 'Pre-purchase Inspection'],
    'Body & Paint': ['Dent Removal', 'Scratch Repair', 'Spray Painting', 'Panel Beating', 'Rust Treatment'],
    'AC Services': ['AC Regas', 'AC Repair', 'AC Filter Replacement', 'AC Inspection'],
  },
  'Lubricants & Fluids': {
    'Engine Oils': ['Synthetic Oil', 'Semi-Synthetic Oil', 'Mineral Oil', 'High-Mileage Oil', 'Diesel Engine Oil'],
    'Gear & Transmission Fluids': ['Automatic Transmission Fluid', 'Manual Gearbox Oil', 'Differential Oil'],
    'Other Fluids': ['Brake Fluid', 'Power Steering Fluid', 'Coolant / Antifreeze', 'Windshield Washer Fluid'],
  },
};

// ─── Spec schema per category ─────────────────────────────────────────────────
// Each field: { id, label, type: 'text'|'select'|'number', options?, unit?, optional? }
export const categorySpecs = {

  // ── Car Parts ──────────────────────────────────────────────────────────────
  'Engine & Drivetrain': [
    { id: 'partNumber',   label: 'Part Number / OEM',     type: 'text',   placeholder: 'e.g. 15400-PLM-A02' },
    { id: 'compatibility', label: 'Vehicle Compatibility', type: 'text',   placeholder: 'e.g. Toyota Camry 2015–2020, 2.5L' },
    { id: 'brand',        label: 'Brand / Manufacturer',  type: 'text',   placeholder: 'e.g. Bosch, NGK, Denso' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'OEM Genuine', 'Aftermarket', 'Refurbished'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '3 Months', '6 Months', '1 Year'] },
  ],

  'Brakes & Suspension': [
    { id: 'partNumber',   label: 'Part Number / OEM',     type: 'text',   placeholder: 'e.g. TRW GDB1234' },
    { id: 'compatibility', label: 'Vehicle Compatibility', type: 'text',   placeholder: 'e.g. Honda Accord 2018–2022' },
    { id: 'position',     label: 'Position',              type: 'select', options: ['Front', 'Rear', 'Front & Rear', 'Left', 'Right', 'Left & Right'] },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Brembo, ATE, Ferodo' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'OEM Genuine', 'Aftermarket', 'Refurbished'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '3 Months', '6 Months', '1 Year'] },
  ],

  'Electrical & Lighting': [
    { id: 'partNumber',   label: 'Part Number',           type: 'text',   placeholder: 'e.g. 35465-SDA-A01' },
    { id: 'compatibility', label: 'Vehicle Compatibility', type: 'text',   placeholder: 'e.g. Toyota Corolla 2014–2019' },
    { id: 'voltage',      label: 'Voltage',               type: 'select', options: ['6V', '12V', '24V'] },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Bosch, Philips, Osram' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'OEM Genuine', 'Aftermarket', 'Refurbished'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '3 Months', '6 Months', '1 Year'] },
  ],

  'Tyres': [
    { id: 'width',        label: 'Tyre Width (mm)',       type: 'select', options: ['155', '165', '175', '185', '195', '205', '215', '225', '235', '245', '255', '265', '275', '285', '295', '305'] },
    { id: 'profile',      label: 'Aspect Ratio (%)',      type: 'select', options: ['30', '35', '40', '45', '50', '55', '60', '65', '70', '75', '80'] },
    { id: 'rimSize',      label: 'Rim Size (inches)',     type: 'select', options: ['13"', '14"', '15"', '16"', '17"', '18"', '19"', '20"', '21"', '22"'] },
    { id: 'speedRating',  label: 'Speed Rating',          type: 'select', options: ['S (180km/h)', 'T (190km/h)', 'H (210km/h)', 'V (240km/h)', 'W (270km/h)', 'Y (300km/h)'] },
    { id: 'loadIndex',    label: 'Load Index',            type: 'text',   placeholder: 'e.g. 91 (615kg)', optional: true },
    { id: 'season',       label: 'Season / Type',         type: 'select', options: ['All Season', 'Summer', 'Wet Weather', 'Off-Road / All Terrain', 'Highway Terrain'] },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Bridgestone, Michelin, Dunlop, Pirelli' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'Used — Good', 'Used — Fair'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '6 Months', '1 Year', '2 Years'], optional: true },
  ],

  'Wheels & Rims': [
    { id: 'rimSize',      label: 'Rim Diameter (inches)', type: 'select', options: ['13"', '14"', '15"', '16"', '17"', '18"', '19"', '20"', '21"', '22"'] },
    { id: 'width',        label: 'Rim Width (inches)',    type: 'text',   placeholder: 'e.g. 7.5J' },
    { id: 'pcd',          label: 'PCD (Bolt Pattern)',    type: 'text',   placeholder: 'e.g. 5x114.3' },
    { id: 'offset',       label: 'Offset (ET)',           type: 'text',   placeholder: 'e.g. ET45', optional: true },
    { id: 'material',     label: 'Material',              type: 'select', options: ['Alloy', 'Steel', 'Forged Alloy', 'Carbon Fibre'] },
    { id: 'color',        label: 'Color / Finish',        type: 'text',   placeholder: 'e.g. Gunmetal, Gloss Black, Silver', optional: true },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. OZ Racing, Enkei, Brabus' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'Used — Good', 'Used — Fair'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '6 Months', '1 Year'], optional: true },
  ],

  'Engine Oils': [
    { id: 'viscosity',    label: 'Viscosity Grade',       type: 'select', options: ['0W-20', '5W-20', '5W-30', '5W-40', '10W-30', '10W-40', '15W-40', '20W-50'] },
    { id: 'oilType',      label: 'Oil Type',              type: 'select', options: ['Fully Synthetic', 'Semi-Synthetic', 'Mineral / Conventional', 'High-Mileage'] },
    { id: 'engineType',   label: 'Engine Type',           type: 'select', options: ['Petrol', 'Diesel', 'Petrol & Diesel'] },
    { id: 'volume',       label: 'Volume',                type: 'select', options: ['1 Litre', '2 Litres', '3 Litres', '4 Litres', '5 Litres', '6 Litres', '7 Litres', '20 Litres', '210 Litres (Drum)'] },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Mobil 1, Castrol, Total, Shell Helix' },
    { id: 'specification', label: 'API / ACEA Spec',      type: 'text',   placeholder: 'e.g. API SN Plus, ACEA C3', optional: true },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '6 Months', '1 Year'], optional: true },
  ],

  'Car Batteries': [
    { id: 'capacity',     label: 'Capacity (Ah)',         type: 'select', options: ['35Ah', '40Ah', '45Ah', '50Ah', '55Ah', '60Ah', '65Ah', '70Ah', '75Ah', '80Ah', '90Ah', '100Ah', '110Ah', '120Ah'] },
    { id: 'cca',          label: 'Cold Cranking Amps',    type: 'text',   placeholder: 'e.g. 540 CCA', optional: true },
    { id: 'voltage',      label: 'Voltage',               type: 'select', options: ['12V', '6V', '24V'] },
    { id: 'type',         label: 'Battery Type',          type: 'select', options: ['Flooded / Wet Cell', 'AGM (Absorbed Glass Mat)', 'EFB (Enhanced Flooded)', 'Gel Cell'] },
    { id: 'polarity',     label: 'Terminal Layout',       type: 'select', options: ['Standard (+ Left)', 'Reverse (+ Right)'], optional: true },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Bosch, Exide, Varta, Amaron' },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '6 Months', '1 Year', '18 Months', '2 Years', '3 Years'] },
  ],

  'Maintenance Services': [
    { id: 'vehicleType',  label: 'Vehicle Type',          type: 'select', options: ['Saloon / Sedan', 'SUV / Crossover', '4x4 / Truck', 'MPV / Van', 'Commercial / Bus'] },
    { id: 'duration',     label: 'Estimated Duration',    type: 'text',   placeholder: 'e.g. 1–2 hours' },
    { id: 'location',     label: 'Service Location',      type: 'select', options: ['In-Workshop', 'Mobile (At Your Location)', 'Both'] },
    { id: 'warranty',     label: 'Service Guarantee',     type: 'select', options: ['No Guarantee', '1 Month', '3 Months', '6 Months'] },
  ],

  // Generic fallback for any other category
  'default': [
    { id: 'partNumber',   label: 'Part Number / OEM',     type: 'text',   placeholder: 'e.g. OEM12345', optional: true },
    { id: 'compatibility', label: 'Vehicle Compatibility', type: 'text',   placeholder: 'e.g. Toyota, Honda 2010–2020' },
    { id: 'brand',        label: 'Brand',                 type: 'text',   placeholder: 'e.g. Bosch, Denso' },
    { id: 'condition',    label: 'Condition',             type: 'select', options: ['Brand New', 'OEM Genuine', 'Aftermarket', 'Refurbished', 'Used'] },
    { id: 'warranty',     label: 'Warranty',              type: 'select', options: ['No Warranty', '3 Months', '6 Months', '1 Year'] },
  ],
};

// Dynamic filter attributes for Shop sidebar
export const categoryAttributes = {
  'Tyres': [
    { id: 'width',      label: 'Tyre Width',     options: ['155', '175', '185', '195', '205', '215', '225', '235', '245', '255', '265'] },
    { id: 'rimSize',    label: 'Rim Size',        options: ['14"', '15"', '16"', '17"', '18"', '19"', '20"'] },
    { id: 'season',     label: 'Type',            options: ['All Season', 'Summer', 'Wet Weather', 'Off-Road / All Terrain'] },
    { id: 'brand',      label: 'Brand',           options: ['Bridgestone', 'Michelin', 'Dunlop', 'Pirelli', 'Continental', 'Hankook', 'Toyo'] },
  ],
  'Engine Oils': [
    { id: 'viscosity',  label: 'Viscosity Grade', options: ['5W-30', '5W-40', '10W-40', '15W-40', '20W-50'] },
    { id: 'oilType',    label: 'Oil Type',         options: ['Fully Synthetic', 'Semi-Synthetic', 'Mineral'] },
    { id: 'engineType', label: 'Engine',           options: ['Petrol', 'Diesel', 'Petrol & Diesel'] },
    { id: 'volume',     label: 'Volume',           options: ['1 Litre', '4 Litres', '5 Litres', '20 Litres'] },
  ],
  'Car Batteries': [
    { id: 'capacity',   label: 'Capacity (Ah)',    options: ['40Ah', '45Ah', '55Ah', '60Ah', '70Ah', '75Ah', '80Ah', '90Ah', '100Ah'] },
    { id: 'type',       label: 'Battery Type',     options: ['Flooded / Wet Cell', 'AGM', 'EFB', 'Gel Cell'] },
    { id: 'brand',      label: 'Brand',            options: ['Bosch', 'Exide', 'Varta', 'Amaron', 'Optima'] },
  ],
  'Brakes & Suspension': [
    { id: 'position',   label: 'Position',         options: ['Front', 'Rear', 'Front & Rear'] },
    { id: 'brand',      label: 'Brand',            options: ['Brembo', 'ATE', 'Ferodo', 'TRW', 'Bosch'] },
    { id: 'condition',  label: 'Condition',        options: ['Brand New', 'OEM Genuine', 'Aftermarket'] },
  ],
};

// Fallback filters for categories without defined attributes
export const defaultAttributes = [
  { id: 'condition',     label: 'Condition',     options: ['Brand New', 'OEM Genuine', 'Aftermarket', 'Refurbished'] },
  { id: 'compatibility', label: 'Vehicle Type',  options: ['Saloon / Sedan', 'SUV / Crossover', '4x4 / Truck', 'MPV / Van', 'Commercial'] },
  { id: 'warranty',      label: 'Warranty',      options: ['No Warranty', '3 Months', '6 Months', '1 Year'] },
];
