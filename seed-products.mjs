// seed-products.mjs — Run with: node seed-products.mjs
// Uploads placeholder chicken products to the new Samtob Farmzs Firebase project

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA55YN4zKrZIm4WO9IzksR904Ql2chI9WE",
  authDomain: "samtobfarmz.firebaseapp.com",
  projectId: "samtobfarmz",
  storageBucket: "samtobfarmz.firebasestorage.app",
  messagingSenderId: "843505581320",
  appId: "1:843505581320:web:9350abbd6986a8994a80bd",
  measurementId: "G-MCDQDEH0XS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
  {
    id: 'chicken-live-large',
    name: "Live Chicken – Large (4.6kg–5.0kg)",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Live Bird",
    description: "Healthy, fully grown large chicken straight from our farm. Ideal for family gatherings. Plump, active, and perfectly raised with no hormones.",
    overview: "Farm-fresh live bird ready for collection or same-day processing.",
    price: 18500,
    originalPrice: 20000,
    badge: "Best Seller",
    stock: 50,
    unlimited_stock: false,
    is_hidden: false,
    featured: true,
    featuredPosition: 1,
    featuredSection: "Fresh Farm Chickens",
    images: ["/products/live_chicken.jpg"],
    image: "/products/live_chicken.jpg",
    imgUrl: "/products/live_chicken.jpg",
    features: ["100% natural feed", "No hormones or antibiotics", "Same-day processing available"],
    rating: 5,
    reviews: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  },
  {
    id: 'chicken-live-medium',
    name: "Live Chicken – Medium (4.2kg–4.5kg)",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Live Bird",
    description: "Standard medium-sized live bird raised on 100% natural feed. Perfect for everyday family meals. Fresh and healthy.",
    overview: "Healthy medium live chicken from our farm, ready for pickup or delivery.",
    price: 16000,
    originalPrice: 17500,
    badge: "Popular",
    stock: 100,
    unlimited_stock: false,
    is_hidden: false,
    featured: true,
    featuredPosition: 2,
    featuredSection: "Fresh Farm Chickens",
    images: ["/products/live_chicken.jpg"],
    image: "/products/live_chicken.jpg",
    imgUrl: "/products/live_chicken.jpg",
    features: ["Farm raised", "No additives", "Available live or processed"],
    rating: 4.8,
    reviews: 24,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  },
  {
    id: 'chicken-live-small',
    name: "Live Chicken – Small (3.8kg–4.1kg)",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Live Bird",
    description: "Compact live bird, great for smaller households or for soups and stews. Farm fresh with no additives.",
    overview: "Smaller live chicken, great value for smaller families.",
    price: 14000,
    originalPrice: null,
    badge: "New Arrival",
    stock: 80,
    unlimited_stock: false,
    is_hidden: false,
    featured: true,
    featuredPosition: 3,
    featuredSection: "Fresh Farm Chickens",
    images: ["/products/live_chicken.jpg"],
    image: "/products/live_chicken.jpg",
    imgUrl: "/products/live_chicken.jpg",
    features: ["100% natural", "Farm raised", "Perfect for soups"],
    rating: 4.7,
    reviews: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  },
  {
    id: 'chicken-dressed-whole',
    name: "Dressed Chicken – Whole",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Processed Bird",
    description: "Carefully slaughtered, cleaned, and fully dressed whole chicken. Processed same-day for maximum freshness. Ready for your pot or freezer.",
    overview: "Cleaned and dressed whole chicken, ready to cook.",
    price: 19000,
    originalPrice: null,
    badge: "Hot Deal",
    stock: 999,
    unlimited_stock: true,
    is_hidden: false,
    featured: true,
    featuredPosition: 1,
    featuredSection: "Processed Chickens",
    images: ["/products/dressed_chicken.jpg"],
    image: "/products/dressed_chicken.jpg",
    imgUrl: "/products/dressed_chicken.jpg",
    features: ["Same-day processing", "Fully dressed", "Ready to cook"],
    rating: 4.9,
    reviews: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  },
  {
    id: 'chicken-slaughtered',
    name: "Slaughtered Chicken (Unprocessed)",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Processed Bird",
    description: "Freshly slaughtered chicken — you handle the dressing yourself. Same-day slaughter for guaranteed freshness.",
    overview: "Freshly slaughtered chicken, unprocessed — perfect if you prefer to dress yourself.",
    price: 16500,
    originalPrice: null,
    badge: null,
    stock: 999,
    unlimited_stock: true,
    is_hidden: false,
    featured: true,
    featuredPosition: 2,
    featuredSection: "Processed Chickens",
    images: ["/products/dressed_chicken.jpg"],
    image: "/products/dressed_chicken.jpg",
    imgUrl: "/products/dressed_chicken.jpg",
    features: ["Same-day slaughter", "Farm fresh", "You dress yourself"],
    rating: 4.6,
    reviews: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  },
  {
    id: 'chicken-frozen',
    name: "Frozen Chicken – Bulk Carton",
    brand: "Samtob Farmzs",
    department: "Poultry",
    category: "Chicken",
    subcategory: "Processed Bird",
    description: "Bulk frozen chicken, perfectly preserved and hygienically packaged. Ideal for restaurants, caterers, and large families stocking up.",
    overview: "Frozen bulk chicken for long-term storage or commercial use.",
    price: 35000,
    originalPrice: 38000,
    badge: "Bulk",
    stock: 20,
    unlimited_stock: false,
    is_hidden: false,
    featured: true,
    featuredPosition: 3,
    featuredSection: "Processed Chickens",
    images: ["/products/frozen_chicken.jpg"],
    image: "/products/frozen_chicken.jpg",
    imgUrl: "/products/frozen_chicken.jpg",
    features: ["Frozen fresh", "Bulk quantity", "Great for restaurants & caterers"],
    rating: 5,
    reviews: 8,
    createdAt: new Date(),
    updatedAt: new Date(),
    sales: 0
  }
];

async function seed() {
  console.log('🌱 Seeding Samtob Farmzs placeholder products...\n');
  for (const product of products) {
    const { id, ...data } = product;
    await setDoc(doc(db, 'products', id), data);
    console.log(`  ✅ ${product.name}`);
  }
  console.log('\n🎉 Done! All products uploaded successfully.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
