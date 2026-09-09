// Full taxonomy — Samtob Farmzs
// Department > Category > Subcategory hierarchy
export const categoryTaxonomy = {
  'Poultry': {
    'Live Birds': ['Broilers', 'Layers', 'Noilers', 'Cockerels', 'Turkeys'],
    'Processed Chicken': ['Dressed Chicken', 'Frozen Chicken', 'Chicken Parts (Wings, Thighs, Breast)', 'Smoked Chicken'],
    'Eggs': ['Small Crates', 'Medium Crates', 'Jumbo Crates', 'Fertilized Eggs'],
  },
  'Farm Produce': {
    'Crops & Vegetables': ['Fresh Tomatoes', 'Peppers', 'Onions', 'Plantain', 'Cassava / Garri'],
    'Livestock Feed': ['Starter Mash', 'Grower Mash', 'Finisher Mash', 'Layer Mash'],
  },
  'Services': {
    'Processing': ['Slaughter & Dressing', 'Smoking & Packaging'],
    'Consultancy': ['Farm Setup', 'Disease Management', 'Vaccination'],
  }
};

// ─── Spec schema per category ─────────────────────────────────────────────────
// Each field: { id, label, type: 'text'|'select'|'number', options?, unit?, optional? }
export const categorySpecs = {

  // ── Poultry ──────────────────────────────────────────────────────────────
  'Live Birds': [
    { id: 'breed',        label: 'Breed',                 type: 'select', options: ['Broiler', 'Layer', 'Noiler', 'Cockerel', 'Local'] },
    { id: 'weight',       label: 'Average Weight',        type: 'select', options: ['1.0kg - 1.5kg', '1.6kg - 2.0kg', '2.1kg - 2.5kg', '2.6kg - 3.0kg', '3.1kg - 3.5kg', '3.6kg+'] },
    { id: 'age',          label: 'Age (Weeks)',           type: 'text',   placeholder: 'e.g. 6 Weeks', optional: true },
    { id: 'vaccination',  label: 'Vaccination Status',    type: 'select', options: ['Fully Vaccinated', 'Partially Vaccinated', 'Not Vaccinated'] },
    { id: 'diet',         label: 'Diet',                  type: 'text',   placeholder: 'e.g. Organic Feed, Commercial Mash' },
  ],

  'Processed Chicken': [
    { id: 'processing',   label: 'Processing Type',       type: 'select', options: ['Slaughtered & Dressed', 'Frozen', 'Smoked', 'Cut to Parts'] },
    { id: 'weight',       label: 'Net Weight',            type: 'select', options: ['1.0kg', '1.5kg', '2.0kg', '2.5kg', '3.0kg', '3.5kg+'] },
    { id: 'packaging',    label: 'Packaging',             type: 'select', options: ['Vacuum Sealed', 'Nylon Wrapped', 'Carton'] },
    { id: 'shelfLife',    label: 'Shelf Life (Frozen)',   type: 'select', options: ['1 Week', '1 Month', '3 Months', '6 Months'] },
  ],

  'Eggs': [
    { id: 'size',         label: 'Egg Size',              type: 'select', options: ['Small', 'Medium', 'Large', 'Jumbo'] },
    { id: 'quantity',     label: 'Quantity',              type: 'select', options: ['Half Crate (15)', 'Full Crate (30)', 'Carton (10 Crates)'] },
    { id: 'type',         label: 'Type',                  type: 'select', options: ['Table Eggs', 'Fertilized / Hatching Eggs'] },
  ],

  'Livestock Feed': [
    { id: 'feedType',     label: 'Feed Category',         type: 'select', options: ['Starter Mash', 'Grower Mash', 'Finisher Mash', 'Layer Mash', 'Pellets'] },
    { id: 'weight',       label: 'Bag Weight',            type: 'select', options: ['5kg', '10kg', '25kg', '50kg'] },
    { id: 'brand',        label: 'Brand / Manufacturer',  type: 'text',   placeholder: 'e.g. Animal Care, Vital Feed, Hybrid' },
    { id: 'ingredients',  label: 'Key Ingredients',       type: 'text',   placeholder: 'e.g. Maize, Soya, Fish Meal', optional: true },
  ],

  // Generic fallback for any other category
  'default': [
    { id: 'weight',       label: 'Weight / Quantity',     type: 'text',   placeholder: 'e.g. 5kg', optional: true },
    { id: 'origin',       label: 'Source',                type: 'text',   placeholder: 'e.g. Samtob Farmzs' },
    { id: 'quality',      label: 'Quality Grade',         type: 'select', options: ['Premium (Grade A)', 'Standard (Grade B)'] },
  ],
};

// Dynamic filter attributes for Shop sidebar
export const categoryAttributes = {
  'Live Birds': [
    { id: 'breed',      label: 'Chicken Breed',    options: ['Broiler', 'Layer', 'Noiler', 'Cockerel'] },
    { id: 'weight',     label: 'Weight Range',     options: ['1.0kg - 1.5kg', '1.6kg - 2.0kg', '2.1kg - 2.5kg', '2.6kg - 3.0kg', '3.1kg - 3.5kg', '3.6kg+'] },
  ],
  'Processed Chicken': [
    { id: 'processing', label: 'Processing Type',  options: ['Dressed', 'Frozen', 'Smoked', 'Parts'] },
    { id: 'weight',     label: 'Net Weight',       options: ['1.0kg', '1.5kg', '2.0kg', '2.5kg', '3.0kg'] },
  ],
  'Eggs': [
    { id: 'size',       label: 'Size',             options: ['Small', 'Medium', 'Large', 'Jumbo'] },
    { id: 'quantity',   label: 'Quantity',         options: ['Half Crate', 'Full Crate', 'Carton'] },
  ],
};

// Fallback filters for categories without defined attributes
export const defaultAttributes = [
  { id: 'quality',      label: 'Quality',          options: ['Premium (Grade A)', 'Standard (Grade B)'] },
  { id: 'availability', label: 'Availability',     options: ['In Stock', 'Pre-order'] },
];
