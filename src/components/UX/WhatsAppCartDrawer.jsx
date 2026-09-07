import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, MessageCircle, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useModal } from '../../context/ModalContext';
import './WhatsAppCartDrawer.css';

const WHATSAPP_NUMBER = '2348035647729';

export default function WhatsAppCartDrawer({ isOpen, onClose }) {
  const { cart, updateCartQty, removeFromCart, cartTotal } = useApp();
  const { } = useModal();

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;
    const lines = cart.map(
      item => `${item.qty}x ${item.name} (₦${(item.price * item.qty).toLocaleString()})`
    ).join('\n');
    const message = `Hello Akilapa & Sons, I'd like to order:\n\n${lines}\n\nTotal: ₦${cartTotal.toLocaleString()}\n\nPlease confirm availability and delivery.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-drawer glass-card"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="drawer-header">
              <h2>
                <ShoppingCart size={20} style={{ color: 'var(--primary)' }} />
                Your Cart
                {cart.length > 0 && (
                  <span className="drawer-count">{cart.reduce((s, i) => s + i.qty, 0)}</span>
                )}
              </h2>
              <button className="close-btn" onClick={onClose} aria-label="Close Cart">
                <X size={24} />
              </button>
            </div>

            {/* Empty state */}
            {cart.length === 0 ? (
              <div className="drawer-empty">
                <ShoppingCart size={56} strokeWidth={1} style={{ color: 'var(--gray-2)', margin: '0 auto 16px' }} />
                <p style={{ fontWeight: 700, color: 'var(--white)', marginBottom: 8 }}>Your cart is empty</p>
                <p style={{ fontSize: 13, color: 'var(--gray-1)', marginBottom: 24 }}>Browse our car parts and add items to get started.</p>
                <Link to="/parts" className="btn-primary" onClick={onClose} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', padding: '12px 24px', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                  Shop Parts <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="drawer-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      {/* Image */}
                      <div className="cart-item-img">
                        {item.images?.[0] || item.imgUrl || item.image ? (
                          <img
                            src={item.images?.[0] || item.imgUrl || item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <ShoppingCart size={24} style={{ color: 'var(--gray-2)' }} />
                        )}
                      </div>

                      <div className="item-info">
                        {item.brand && (
                          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {item.brand}
                          </span>
                        )}
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', lineHeight: 1.3, marginBottom: 6 }}>
                          {item.name}
                        </h4>
                        <span className="item-price">₦{(item.price || 0).toLocaleString()}</span>

                        {/* Qty controls */}
                        <div className="cart-item-controls">
                          <div className="qty-ctrl">
                            <button onClick={() => updateCartQty(item.id, -1)} aria-label="Decrease">
                              <Minus size={12} />
                            </button>
                            <span>{item.qty}</span>
                            <button onClick={() => updateCartQty(item.id, 1)} aria-label="Increase">
                              <Plus size={12} />
                            </button>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>
                            ₦{((item.price || 0) * item.qty).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="drawer-footer">
                  <div className="cart-total">
                    <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                    <span className="total-amount">₦{cartTotal.toLocaleString()}</span>
                  </div>

                  <Link
                    to="/cart"
                    className="drawer-checkout-link"
                    onClick={onClose}
                  >
                    View Full Cart <ArrowRight size={16} />
                  </Link>

                  <button
                    className="btn-primary whatsapp-btn"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle size={20} />
                    Order via WhatsApp
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
