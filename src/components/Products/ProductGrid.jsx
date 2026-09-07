import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts } from '../../utils/productService';
import { ProductCard } from './ProductCard';
import './ProductGrid.css';

export const ScrollableProductSlider = ({ products }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -432 : 432;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="slider-container">
      <button className="slider-btn left" onClick={() => scroll('left')} aria-label="Scroll left">
        <ChevronLeft size={24} color="#000" />
      </button>
      
      <div className="scrollable-row" ref={scrollRef}>
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button className="slider-btn right" onClick={() => scroll('right')} aria-label="Scroll right">
        <ChevronRight size={24} color="#000" />
      </button>
    </div>
  );
};

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(dbProducts => {
      if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
    });
  }, []);

  const featuredProducts = products.filter(p => p.featured);
  const tyres = featuredProducts.filter(p => p.featuredSection === 'Fresh Farm Chickens');
  const otherParts = featuredProducts.filter(p => p.featuredSection === 'Processed Chickens');

  return (
    <section className="section-padding product-section">
      <div className="container">
        
        {/* Row 1: Tyres */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="deal-header">
            <div className="deal-title-group">
              <div className="deal-accent"></div>
              <h2 className="deal-title">Fresh Farm Chickens</h2>
              <span className="deal-separator">|</span>
              <span className="deal-subtitle">Best Quality</span>
            </div>
            <Link to="/shop?category=Chicken" className="deal-see-all">See All &gt;</Link>
          </div>
          <ScrollableProductSlider products={tyres} />
        </div>

        {/* Row 2: Other Parts */}
        <div>
          <div className="deal-header">
            <div className="deal-title-group">
              <div className="deal-accent"></div>
              <h2 className="deal-title">Processed Chickens</h2>
              <span className="deal-separator">|</span>
              <span className="deal-subtitle">Ready to Cook</span>
            </div>
            <Link to="/shop" className="deal-see-all">See All &gt;</Link>
          </div>
          <ScrollableProductSlider products={otherParts} />
        </div>
        
      </div>
    </section>
  );
}
