import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct } from '../utils/productService';
import { getProductIcon, formatCurrency } from '../utils/helpers';
import { categorySpecs } from '../data/taxonomy';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  ShoppingCart, Heart, Truck, ShieldCheck, 
  BatteryCharging, MicOff, Package, Speaker, Cable, Loader2, CheckCircle2,
  CalendarClock, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import SEO from '../components/SEO';
import './ProductDetails.css';

export default function ProductDetails() {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(2);
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // December Rush Installment State
  const [paymentPlan, setPaymentPlan] = useState('full'); // 'full' or 'installment'
  const [installmentDuration, setInstallmentDuration] = useState(12);
  const [rushSettings, setRushSettings] = useState(null); // loaded from Firestore
  const [rushLoading, setRushLoading] = useState(true);

  // Fetch December Rush settings from Firestore
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'december_rush'));
        if (snap.exists()) setRushSettings(snap.data());
      } catch { /* silently ignore — feature just won't show */ }
      finally { setRushLoading(false); }
    })();
  }, []);

  // Derived installment data from Firestore settings (with sensible fallbacks)
  const rushEnabled = rushSettings?.enabled === true;
  const fp = ((rushSettings?.firstPaymentPercent ?? 30)) / 100; // e.g. 0.30
  const availableDurations = rushSettings?.availableDurations?.length
    ? rushSettings.availableDurations
    : [12];
  const pricingTiers = rushSettings?.pricingTiers?.length
    ? rushSettings.pricingTiers
    : [
        { id: 'small',  label: '3.8kg–4.1kg', total: 18000 },
        { id: 'medium', label: '4.2kg–4.5kg', total: 24000 },
        { id: 'large',  label: '4.6kg–5.0kg', total: 30000 },
        { id: 'xlarge', label: '5.1kg–5.5kg', total: 36000 },
      ];

  // Ensure selected duration is valid
  const validDuration = availableDurations.includes(installmentDuration)
    ? installmentDuration
    : availableDurations[availableDurations.length - 1];

  // Calculate per-tier first payment + weekly amount
  const installmentOptions = pricingTiers.map(tier => {
    const firstPayment = Math.round(tier.total * fp);
    const remaining = tier.total - firstPayment;
    const weeklyPayment = Math.round(remaining / (validDuration - 1));
    return { ...tier, firstPayment, remaining, weeklyPayment };
  });

  const [selectedInstallmentId, setSelectedInstallmentId] = useState('');
  // Auto-select first tier once settings load
  useEffect(() => {
    if (installmentOptions.length > 0 && !selectedInstallmentId) {
      setSelectedInstallmentId(installmentOptions[0].id);
    }
  }, [rushSettings]);

  const selectedInstallment = installmentOptions.find(o => o.id === selectedInstallmentId)
    || installmentOptions[0];

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const dbProduct = await getProduct(id);
        if (dbProduct) {
          setProduct(dbProduct);
          if (dbProduct.colors && dbProduct.colors.length > 0) {
            const firstCol = dbProduct.colors[0];
            setSelectedColor(typeof firstCol === 'string' ? firstCol : firstCol.name);
          }
        } else {
          // No product found
          navigate('/shop');
        }
      } catch (error) {
        console.error(error);
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);
  
  const inWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Loader2 className="spinner" size={48} color="var(--primary)" />
      </main>
    );
  }

  if (!product) return null;

  // Normalize colors
  const normalizedColors = product?.colors?.map(c => typeof c === 'string' ? { name: c, image: null } : c) || [];

  // Extract images from product
  let productImages = (product.images && product.images.length > 0) 
    ? [...product.images] 
    : (product.image || product.imgUrl || product.img) 
      ? [product.image || product.imgUrl || product.img] 
      : [];

  // Add unique color images to the gallery
  normalizedColors.forEach(col => {
    if (col.image && !productImages.includes(col.image)) {
      productImages.push(col.image);
    }
  });

  const hasImages = productImages.length > 0;

  // Provide a generic set of fallback icons if we can't map properly
  const fallbackThumbnails = [
    getProductIcon(product.category), 
    <Package size={48} strokeWidth={1} color="var(--gray-2)" />, 
    <Speaker size={48} strokeWidth={1} color="var(--gray-2)" />, 
    <Cable size={48} strokeWidth={1} color="var(--gray-2)" />
  ];

  return (
    <main className="main-content" id="main">
      <SEO
        title={`${product.name} | Samtob Farms`}
        description={`Buy ${product.name} in Ibadan, Nigeria at Samtob Farms. ₦${Math.ceil(product.price || 0).toLocaleString('en-NG')}. Fresh farm chickens, fast delivery.`}
        image={product.images?.[0] || product.imgUrl || '/logo.jpeg'}
        url={`/product/${product.id}`}
        type="product"
        product={product}
      />
      <div className="text-primary" style={{ fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
        <Link to="/" style={{ color: 'var(--gray-1)' }}>Home</Link> / 
        <Link to="/shop" style={{ color: 'var(--gray-1)' }}> Shop </Link> / 
        {product.department && <><span style={{ color: 'var(--gray-1)' }}> {product.department} </span> / </>}
        {product.category && <><span style={{ color: 'var(--gray-1)' }}> {product.category} </span> / </>}
        {product.subcategory && <><span style={{ color: 'var(--gray-1)' }}> {product.subcategory} </span> / </>}
        {product.name}
      </div>

      <div className="product-detail-layout">
        
        {/* 1. IMAGE GALLERY */}
        <div className="product-gallery">
          <div className="pg-main" style={hasImages ? { padding: 0, overflow: 'hidden', display: 'block' } : {}}>
            {product.badge && (
              <span className={`pg-badge ${product.badge === 'hot' ? 'hot' : product.badge === 'new' ? 'new' : ''}`} style={hasImages ? { zIndex: 10 } : {}}>
                {product.badge.toUpperCase()}
              </span>
            )}
            
            {hasImages ? (
              <img src={productImages[activeThumb]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ transform: 'scale(2.5)' }}>
                {fallbackThumbnails[activeThumb]}
              </div>
            )}
          </div>
          <div className="pg-thumbnails">
            {hasImages ? (
              productImages.map((img, idx) => (
                <div 
                  key={idx}
                  className={`pg-thumb ${activeThumb === idx ? 'active' : ''}`}
                  onClick={() => setActiveThumb(idx)}
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  <img src={img} alt={`${product.name} thumbnail`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              ))
            ) : (
              fallbackThumbnails.map((thumb, idx) => (
                <div 
                  key={idx}
                  className={`pg-thumb ${activeThumb === idx ? 'active' : ''}`}
                  onClick={() => setActiveThumb(idx)}
                  style={{ padding: '16px' }}
                >
                  {thumb}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 2. PRODUCT INFO */}
        <div className="product-detail-info">
          <div>
            <div className="pd-brand">{product.brand}</div>
            <h1 className="pd-title">{product.name}</h1>
          </div>
          
          <div className="pd-rating">
            <span className="stars" style={{ color: 'var(--primary)', fontSize: '16px', letterSpacing: '2px' }}>
              {'★'.repeat(Math.max(0, Math.min(5, Math.floor(Number(product.rating) || 0))))}{'☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(Number(product.rating) || 0))))}
            </span>
            <span style={{ fontWeight: 700, color: 'var(--white)', marginLeft: '8px' }}>{Number(product.rating) || 0}</span>
            <span>({Number(product.reviews) || 0} verified ratings)</span>
          </div>

          <div style={{ marginTop: '16px' }}>
            {product.oldPrice && paymentPlan === 'full' && (
              <div className="pd-discount">
                -{Math.round((1 - product.price/product.oldPrice) * 100)}% Discount
              </div>
            )}
            <div className="pd-price-wrap">
              <span className="pd-price">
                {paymentPlan === 'installment' && selectedInstallment
                  ? <>{formatCurrency(selectedInstallment.firstPayment)} <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--gray-1)' }}>1st payment</span></>
                  : formatCurrency(product.price)}
              </span>
              {product.oldPrice && paymentPlan === 'full' && <span className="pd-old-price">{formatCurrency(product.oldPrice)}</span>}
            </div>
            {paymentPlan === 'installment' && selectedInstallment && (
              <div style={{ fontSize: '13px', color: 'var(--success)', marginTop: '4px', fontWeight: 600, lineHeight: 1.7 }}>
                Then {formatCurrency(selectedInstallment.weeklyPayment)}/wk × {validDuration - 1} weeks
                <span style={{ color: 'var(--gray-1)', fontWeight: 400, display: 'block' }}>Total: {formatCurrency(selectedInstallment.total)} ({rushSettings?.firstPaymentPercent ?? 30}% upfront)</span>
              </div>
            )}
          </div>

          {/* ─── PAYMENT PLAN SELECTOR — controlled by December Rush admin toggle ─── */}
          {!rushLoading && (
            rushEnabled ? (
              <div className="pd-variants" style={{ marginTop: '24px' }}>
                <div className="variant-title">
                  Payment Plan: <span style={{ color: 'var(--white)' }}>{paymentPlan === 'full' ? 'Pay in Full' : `December Rush — ${validDuration} Weeks`}</span>
                </div>
                <div className="variant-options">
                  <button
                    className={`variant-btn ${paymentPlan === 'full' ? 'active' : ''}`}
                    onClick={() => setPaymentPlan('full')}
                  >
                    Pay in Full
                  </button>
                  <button
                    className={`variant-btn ${paymentPlan === 'installment' ? 'active' : ''}`}
                    onClick={() => setPaymentPlan('installment')}
                    style={{
                      borderColor: paymentPlan === 'installment' ? '#F9A825' : 'var(--dark-border)',
                      color: paymentPlan === 'installment' ? '#F9A825' : 'inherit',
                      background: paymentPlan === 'installment' ? 'rgba(249,168,37,0.08)' : 'var(--dark)',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <CalendarClock size={14} />
                    December Rush Installment
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                marginTop: '24px',
                background: 'rgba(249,168,37,0.06)',
                border: '1px solid rgba(249,168,37,0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>🎄</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#F9A825', margin: 0 }}>
                    This installment close notice is bcos December Rush is Toogled off in Admin panel
                  </div>
                </div>
              </div>
            )
          )}

          {/* Duration selector — only if installment selected */}
          {paymentPlan === 'installment' && availableDurations.length > 1 && (
            <div className="pd-variants" style={{ marginTop: '16px' }}>
              <div className="variant-title">Duration: <span style={{ color: 'var(--white)' }}>{validDuration} Weeks</span></div>
              <div className="variant-options">
                {availableDurations.map(w => (
                  <button
                    key={w}
                    className={`variant-btn ${validDuration === w ? 'active' : ''}`}
                    onClick={() => setInstallmentDuration(w)}
                  >
                    {w} Wks
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chicken Weight / Tier selector */}
          {paymentPlan === 'installment' && (
            <div className="pd-variants" style={{ marginTop: '16px' }}>
              <div className="variant-title">Chicken Weight: <span style={{ color: 'var(--white)' }}>{selectedInstallment?.label}</span></div>
              <div className="variant-options" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {installmentOptions.map(opt => (
                  <button
                    key={opt.id}
                    className={`variant-btn ${selectedInstallment?.id === opt.id ? 'active' : ''}`}
                    onClick={() => setSelectedInstallmentId(opt.id)}
                    style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '10px 12px', gap: '2px' }}
                  >
                    <span style={{ fontWeight: 700 }}>{opt.label}</span>
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>1st: {formatCurrency(opt.firstPayment)}</span>
                    <span style={{ fontSize: '11px', color: 'var(--gray-1)' }}>{formatCurrency(opt.weeklyPayment)}/wk × {validDuration - 1}</span>
                  </button>
                ))}
              </div>
              {/* Summary box */}
              {selectedInstallment && (
                <div style={{ marginTop: '12px', background: 'rgba(249,168,37,0.06)', border: '1px solid rgba(249,168,37,0.25)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '13px', lineHeight: 1.8 }}>
                  <div style={{ fontWeight: 800, color: '#F9A825', marginBottom: '4px' }}>Payment Schedule</div>
                  <div><span style={{ color: 'var(--gray-1)' }}>Today (1st payment):</span> <strong style={{ color: 'var(--white)' }}>{formatCurrency(selectedInstallment.firstPayment)}</strong></div>
                  <div><span style={{ color: 'var(--gray-1)' }}>Then weekly:</span> <strong style={{ color: 'var(--white)' }}>{formatCurrency(selectedInstallment.weeklyPayment)} × {validDuration - 1} wks</strong></div>
                  <div><span style={{ color: 'var(--gray-1)' }}>Total price:</span> <strong style={{ color: 'var(--white)' }}>{formatCurrency(selectedInstallment.total)}</strong></div>
                </div>
              )}
            </div>
          )}

          <div className="pd-features">
            {product.features && product.features.length > 0 && (
              product.features.map((feat, idx) => (
                <div key={idx} className="pd-feature">
                  <span className="pd-feature-icon"><CheckCircle2 size={20} /></span>
                  <span>{feat}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 3. ACTION SIDEBAR */}
        <div className="product-action-sidebar">
          <div className="pas-delivery">
            <div className="pas-delivery-icon" style={{ color: 'var(--primary)' }}><Truck size={32} strokeWidth={1.5} /></div>
            <div className="pas-delivery-text">
              <strong>Ibadan Delivery</strong>
              <span>Fast delivery within Ibadan, or free farm pickup.</span>
            </div>
          </div>
          <div className="pas-delivery" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="pas-delivery-icon" style={{ color: 'var(--primary)' }}><ShieldCheck size={32} strokeWidth={1.5} /></div>
            <div className="pas-delivery-text">
              <strong>Quality Guaranteed</strong>
              <span>100% farm fresh chickens, carefully processed.</span>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--dark-border)', margin: 0 }} />

          <div className="pas-qty">
            <span>Quantity (Min: 2)</span>
            <div className="qty-selector">
              <button onClick={() => setQty(q => Math.max(2, q - 1))} disabled={qty <= 2} style={{ cursor: qty <= 2 ? 'not-allowed' : 'pointer', opacity: qty <= 2 ? 0.5 : 1 }}>-</button>
              <input type="number" value={qty} readOnly />
              <button onClick={() => setQty(q => Math.min(100, q + 1))}>+</button>
            </div>
          </div>

          <div>
            <button           className="pas-add-btn" onClick={() => {
              const productToAdd = paymentPlan === 'installment' && selectedInstallment
                ? {
                    ...product,
                    price: selectedInstallment.firstPayment,
                    name: `${product.name} — Installment (${selectedInstallment.label})`,
                    isInstallment: true,
                    installmentDetails: {
                      tierId: selectedInstallment.id,
                      label: selectedInstallment.label,
                      total: selectedInstallment.total,
                      firstPayment: selectedInstallment.firstPayment,
                      weeklyPayment: selectedInstallment.weeklyPayment,
                      remaining: selectedInstallment.remaining,
                      duration: validDuration,
                      firstPaymentPercent: rushSettings?.firstPaymentPercent ?? 30,
                    }
                  }
                : product;
              addToCart(productToAdd, paymentPlan === 'installment' ? 1 : qty);
              // Navigate to cart immediately for both book and regular add
              navigate('/cart');
            }}>
              <ShoppingCart size={20} /> {paymentPlan === 'installment' ? `Book — Pay ${formatCurrency(selectedInstallment?.firstPayment ?? 0)} Today` : 'Add to Cart'}
            </button>
            <button 
              className={`pas-wish-btn ${isInWishlist(product.id) ? 'active' : ''}`} 
              onClick={() => toggleWishlist(product)} 
              style={{ marginTop: '10px', color: isInWishlist(product.id) ? 'var(--primary)' : 'inherit', borderColor: isInWishlist(product.id) ? 'var(--primary)' : 'inherit' }}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'var(--primary)' : 'none'} /> {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      {/* 4. PRODUCT TABS */}
      <div className="product-tabs-section">
        <div className="tabs-nav">
          <button className={`tab-btn ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Overview</button>
          <button className={`tab-btn ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Specifications</button>
          <button className={`tab-btn ${activeTab === 2 ? 'active' : ''}`} onClick={() => setActiveTab(2)}>Verified Reviews ({product.reviews})</button>
        </div>
        
        {activeTab === 0 && (
          <div className="tab-content active">
            {product.overview ? (
              <>
                <h3>About the {product.name}</h3>
                <p style={{ lineHeight: '1.8', color: 'var(--gray-1)' }}>{product.overview}</p>
              </>
            ) : (
              <>
                <h3>Fresh from the Farm</h3>
                <p>Enjoy the best quality {product.name}, raised on our farm with no artificial hormones or antibiotics. Perfect for your family's healthy meals.</p>
                <p>Our birds are carefully raised and processed according to your exact preferences — whether you want them live, slaughtered, dressed, or frozen.</p>
              </>
            )}
            {product.description && (
              <div style={{ marginTop: '16px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--primary)' }}>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.8', color: 'var(--gray-1)', whiteSpace: 'pre-line' }}>{product.description}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 1 && (() => {
          const specKey = product.subcategory || product.category;
          const specFields = categorySpecs[specKey] || categorySpecs[product.category] || [];
          const hasSpecs = product.specs && Object.keys(product.specs).some(k => product.specs[k]);
          return (
            <div className="tab-content active">
              <h3>Technical Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {/* Always-visible core fields */}
                  {product.brand && <tr><th>Brand</th><td>{product.brand}</td></tr>}
                  {product.department && <tr><th>Department</th><td>{product.department}</td></tr>}
                  {product.category && <tr><th>Category</th><td>{product.category}</td></tr>}
                  {product.subcategory && <tr><th>Subcategory</th><td>{product.subcategory}</td></tr>}

                  {/* Dynamic specs from taxonomy schema */}
                  {specFields.length > 0 && hasSpecs ? (
                    specFields.map(field => {
                      const val = product.specs?.[field.id];
                      if (!val) return null;
                      return <tr key={field.id}><th>{field.label}</th><td>{val}</td></tr>;
                    })
                  ) : !hasSpecs ? (
                    // Fallback static rows if no specs saved
                    <>
                      <tr><th>Breed</th><td>Broiler</td></tr>
                      <tr><th>Diet</th><td>100% Natural Organic Feed</td></tr>
                      <tr><th>Processing</th><td>Same-Day Slaughter/Dressed</td></tr>
                    </>
                  ) : null}

                  {/* Any extra specs not in schema */}
                  {product.specs && Object.entries(product.specs)
                    .filter(([k, v]) => v && !specFields.find(f => f.id === k))
                    .map(([k, v]) => (
                      <tr key={k}><th style={{ textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</th><td>{v}</td></tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          );
        })()}

        {activeTab === 2 && (() => {
          const ratingValue = Number(product.rating) || 0;
          const reviewsCount = Number(product.reviews) || 0;
          const starsString = '★'.repeat(Math.max(0, Math.min(5, Math.floor(ratingValue)))) + '☆'.repeat(Math.max(0, 5 - Math.min(5, Math.floor(ratingValue))));
          const reviewsList = product.reviewsList || [];

          // Calculate breakdown if reviews exist
          const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          reviewsList.forEach(r => {
            const s = Math.max(1, Math.min(5, Math.floor(Number(r.stars) || 5)));
            counts[s]++;
          });
          const totalReviews = reviewsList.length || 1; // avoid division by zero
          
          return (
            <div className="tab-content active">
              <div className="reviews-grid">
                <div className="rating-summary">
                  <h3>Customer Feedback</h3>
                  <div>
                    <div className="rs-score">{ratingValue > 0 ? ratingValue.toFixed(1) : '0'}</div>
                    <div className="rs-stars" style={{ color: 'var(--primary)', letterSpacing: '2px' }}>{starsString}</div>
                    <div style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Based on {reviewsCount} reviews</div>
                  </div>
                  <div className="rs-bars">
                    {[5, 4, 3, 2, 1].map(star => {
                      const pct = reviewsList.length > 0 ? Math.round((counts[star] / totalReviews) * 100) : 0;
                      return (
                        <div key={star} className="rs-bar-row">
                          {star}★ <div className="rs-bar-track"><div className="rs-bar-fill" style={{ width: `${pct}%` }}></div></div> {pct}%
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="review-list">
                  {reviewsList.length > 0 ? (
                    reviewsList.map((review, idx) => (
                      <div key={idx} className="review-card">
                        <div className="rc-header">
                          <span className="rc-user">{review.user || 'Anonymous'} <span style={{ color: 'var(--success)', fontSize: '11px' }}>✓ Verified Buyer</span></span>
                          <span className="rc-date">{review.date || 'Recently'}</span>
                        </div>
                        <div className="rc-stars">{'★'.repeat(Math.max(1, Math.min(5, Number(review.stars) || 5)))}</div>
                        <div className="rc-text">{review.text}</div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '20px', color: 'var(--gray-1)', fontStyle: 'italic' }}>
                      No reviews yet for this product. Be the first to leave a review!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </main>
  );
}
