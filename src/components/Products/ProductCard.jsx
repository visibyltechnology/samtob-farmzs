import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './ProductGrid.css';

export const formatCurrency = (amount) => '₦' + (amount || 0).toLocaleString('en-NG');

export function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const inWishlist = isInWishlist(product.id);

  const priceHtml = product.originalPrice ? (
    <>
      <span className="product-old-price">{formatCurrency(product.originalPrice)}</span>
      <span className="product-price">{formatCurrency(product.price)}</span>
      <span className="product-discount">-{Math.round((1 - product.price/product.originalPrice) * 100)}%</span>
    </>
  ) : (
    <span className="product-price">{formatCurrency(product.price)}</span>
  );

  let badgeHtml = null;
  if (product.badge === 'hot') badgeHtml = <span className="product-badge hot">HOT</span>;
  else if (product.badge === 'new') badgeHtml = <span className="product-badge new">NEW</span>;
  else if (product.badge === 'sale' || product.originalPrice) badgeHtml = <span className="product-badge">SALE</span>;

  return (
    <article className="product-card" tabIndex="0">
      <Link to={`/product/${product.id}`} style={{ display: 'contents' }}>
        <div className="product-img-wrap">
          {badgeHtml}
          <button 
            className={`product-wishlist ${inWishlist ? 'active' : ''}`} 
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"} 
            onClick={(e) => { 
              e.preventDefault(); 
              toggleWishlist(product); 
            }}
            style={{ color: inWishlist ? 'var(--primary-light)' : 'var(--gray-1)', background: inWishlist ? 'rgba(76, 175, 80, 0.12)' : 'var(--dark)' }}
          >
            <Heart size={16} fill={inWishlist ? "var(--primary)" : "none"} />
          </button>
          <img src={product.imgUrl || product.image || (product.images && product.images[0]) || '/placeholder.jpg'} alt={product.name} className="product-img" />
          <div className="product-actions">
            <button 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'transparent', font: 'inherit', fontWeight: 700, width: '100%', height: '100%', cursor: 'pointer', border: 'none', color: 'var(--black)' }} 
              onClick={(e) => { 
                e.preventDefault(); 
                addToCart(product); 
              }}
            >
              <ShoppingCart size={16} /> ORDER NOW
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <div className="product-brand">{product.brand || product.department || 'Samtob Farms'}</div>
          <h3 className="product-name" title={product.name}>{product.name}</h3>
          <div className="product-rating">
            <span className="stars" style={{ color: 'var(--primary-light)', fontSize: '12px', letterSpacing: '2px' }}>{'★'.repeat(Math.max(0, Math.min(5, Math.floor(Number(product.rating) || 0))))}{'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(Number(product.rating) || 0))))}</span>
            <span className="rating-count" style={{ marginLeft: '4px' }}>({Number(product.reviews) || product.stock || 0})</span>
          </div>
          <div className="product-price-wrap">
            {priceHtml}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default ProductCard;
