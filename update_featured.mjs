import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkkLi4L1M2_Ty9YYvpM8DOWOZGbU0l9Hk",
  authDomain: "akilapaandsons-7d078.firebaseapp.com",
  projectId: "akilapaandsons-7d078",
  storageBucket: "akilapaandsons-7d078.firebasestorage.app",
  messagingSenderId: "517333369859",
  appId: "1:517333369859:web:d102870ecf6a09df51fa36"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function updateFeaturedSections() {
  console.log('Assigning featuredSections to existing products...');
  const snapshot = await getDocs(collection(db, 'products'));
  let count = 0;
  for (const document of snapshot.docs) {
    const data = document.data();
    if (data.featured) {
      const section = data.department === 'Tyres' ? 'Premium Tyres & Tubes' : 'Essential Car Parts';
      await updateDoc(doc(db, 'products', document.id), {
        featuredSection: section
      });
      count++;
    }
  }
  console.log(`Updated ${count} featured products with their sections.`);
  process.exit(0);
}

updateFeaturedSections();
