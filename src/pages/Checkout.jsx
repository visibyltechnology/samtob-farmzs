import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, CheckCircle, Zap, Upload, AlertCircle, Loader2, X, CalendarDays, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/helpers';
import { collection, addDoc, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadImage } from '../utils/cloudinaryService';
import { sendOrderConfirmation } from '../utils/emailService';
import { createNotification } from '../utils/notificationService';
import './Cart.css';

const steps = ['Delivery', 'Processing', 'Payment', 'Review'];


const PROCESSING_OPTIONS = [
  { id: 'live', label: 'Live Chicken', desc: 'Bird as-is, no processing', icon: '🐔', fee: 0 },
  { id: 'slaughtered_dressed', label: 'Slaughter + Dressing', desc: 'Slaughtered, plucked & cleaned — ₦500 per bird', icon: '🍗', fee: 500 },
  { id: 'frozen', label: 'Frozen', desc: 'Dressed & frozen — ₦1,000 per bird (requires 24hrs pre-notice)', icon: '❄️', fee: 1000 },
];

// December Rush Installment Options logic is now in ProductDetails.jsx

let klumpScriptPromise = null;
function loadKlumpScript() {
  if (klumpScriptPromise) return klumpScriptPromise;
  klumpScriptPromise = new Promise((resolve, reject) => {
    const scriptId = "klump-js-script";
    if (document.getElementById(scriptId)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://js.useklump.com/klump.js";
    script.onload = () => resolve();
    script.onerror = () => {
      klumpScriptPromise = null;
      reject(new Error("Failed to load Klump script"));
    };
    document.body.appendChild(script);
  });
  return klumpScriptPromise;
}

function getKlump() {
  try {
    return (0, eval)("Klump");
  } catch (e) {
    return undefined;
  }
}

export default function Checkout() {
  const { user, authLoading, cart, cartTotal, clearCart, showToast, siteSettings } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [installmentDuration, setInstallmentDuration] = useState(4); // weeks
  const INSTALLMENT_DEPOSIT_PCT = 0.30;
  
  const deliveryOptions = [
    { id: 'farm_pickup', label: 'Farm Pickup', desc: 'Come pick up at the farm — always FREE', fee: 0, badge: 'FREE' },
    { id: 'ibadan', label: 'Within Ibadan Delivery', desc: 'We deliver to your doorstep in Ibadan', fee: siteSettings.ibadan, badge: `₦${Number(siteSettings.ibadan).toLocaleString('en-NG')}` },
    { id: 'outside_ibadan', label: 'Outside Ibadan', desc: siteSettings.outsideIbadanDesc || 'Contact us on WhatsApp for delivery arrangement', fee: null, badge: 'Contact Us' },
  ];

  const [klumpOpen, setKlumpOpen] = useState(false);

  useEffect(() => {
    let interval;
    if (klumpOpen) {
      // Force Klump's dynamically injected iframes to have a lower z-index
      // so our Cancel button (which is 2147483647) is guaranteed to stay on top
      interval = setInterval(() => {
        document.querySelectorAll('iframe[src*="klump"], [id^="klump"]').forEach(el => {
          if (el.style && el.id !== 'klump__checkout') {
            el.style.setProperty('z-index', '2147483640', 'important');
          }
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [klumpOpen]);

  const [deliveryOption, setDeliveryOption] = useState('farm_pickup');
  const [processingOption, setProcessingOption] = useState('live');

  const [formData, setFormData] = useState({
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: 'Oyo',
    payMethod: 'bank_transfer'
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [activeLegal, setActiveLegal] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState({ terms: false, privacy: false });


  const selectedDelivery = deliveryOptions.find(d => d.id === deliveryOption) || deliveryOptions[0];
  const deliveryFee = selectedDelivery?.fee || 0;
  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const selectedProcessing = PROCESSING_OPTIONS.find(p => p.id === processingOption) || PROCESSING_OPTIONS[0];
  const processingFee = (selectedProcessing.fee || 0) * totalQty;
  const subTotal = cartTotal + deliveryFee + processingFee;
  const isInstallmentPayment = formData.payMethod === 'installment';
  const installmentWeeklyAmt = Math.floor(subTotal / installmentDuration);
  const installmentFirstDeposit = subTotal - (installmentWeeklyAmt * (installmentDuration - 1));
  const installmentRemaining = subTotal - installmentFirstDeposit;
  const grandTotal = isInstallmentPayment ? installmentFirstDeposit : subTotal;
  const hasInstallmentItems = cart.some(item => item.isInstallment);

  useEffect(() => {
    if (!authLoading) {
      if (cart.length === 0 && !placed) {
        navigate('/cart');
      } else if (!user && !placed) {
        // ALL orders require login
        showToast('Please log in or create an account to place an order.', 'error');
        navigate('/login');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, cart, navigate, placed, user]);

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrderClick = () => {
    if ((formData.payMethod === 'bank_transfer' || formData.payMethod === 'installment') && !receiptFile) {
      setError('Please upload your payment receipt before placing the order.');
      return;
    }
    if (!termsAccepted.terms || !termsAccepted.privacy) {
      setError('Please read and accept both the Terms & Conditions and Privacy Policy.');
      return;
    }
    setError('');
    submitOrder();
  };

  const handleKlumpPayment = async () => {
    setLoading(true);
    setKlumpOpen(true);
    setError('');
    try {
      await loadKlumpScript();
      const KlumpCtor = getKlump();
      if (!KlumpCtor) throw new Error("Klump payment service unavailable. Check your connection.");

      new KlumpCtor({
        publicKey: "klp_pk_f9a97db616144143b74882681691843154982678bc7b4e47ac9485e95a636f66",
        data: {
          amount: subTotal,
          shipping_fee: deliveryFee,
          currency: "NGN",
          redirect_url: `${window.location.origin}/profile`,
          merchant_reference: `klp-${Date.now()}`,
          meta_data: {
            customer: formData.fullName || "Guest",
            email: formData.email || user?.email || "guest@example.com",
          },
          items: cart.map((i) => ({
            image_url: i.image || i.imgUrl || (i.images && i.images[0]) || "https://placehold.co/400x400/png?text=Product",
            item_url: `${window.location.origin}/product/${i.id}`,
            name: i.name,
            unit_price: i.price,
            quantity: i.qty,
          })),
        },
        onSuccess: (data) => {
          setKlumpOpen(false);
          const klumpRef = data?.data?.reference || `klp-${Date.now()}`;
          submitOrder(klumpRef);
        },
        onError: () => {
          setError("Klump payment failed or was declined. Please try again or use another method.");
          setLoading(false);
          setKlumpOpen(false);
        },
        onLoad: () => { },
        onClose: () => {
          setLoading(false);
          setKlumpOpen(false);
        },
      });
    } catch (err) {
      setError(err.message || "Failed to load Klump. Please check your connection.");
      setLoading(false);
      setKlumpOpen(false);
    }
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');

    try {
      let receiptUrl = '';
      if (receiptFile) {
        receiptUrl = await uploadImage(receiptFile);
      }

      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: formData.email || user?.email || '',
        deliveryAddress: deliveryOption === 'farm_pickup'
          ? 'Farm Pickup'
          : `${formData.address}, ${formData.city}, ${formData.state}`,
        deliveryOption: selectedDelivery.label,
        deliveryFee: deliveryFee,
        processingOption,
        items: cart,
        total: subTotal,           // full order total
        subTotal: subTotal,
        payMethod: formData.payMethod,
        status: 'Pending Verification',
        receiptUrl: receiptUrl,
        createdAt: new Date(),
        // Installment fields (only set when payMethod === 'installment')
        ...(isInstallmentPayment ? {
          isInstallmentOrder: true,
          depositAmount: installmentFirstDeposit,
          recurringAmount: installmentWeeklyAmt,
          installmentsTotal: installmentDuration,
          installmentsPaid: 0,
          initialPaymentStatus: 'Pending',
          installmentReceipts: [],
        } : {}),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);

      // Fire and forget: email + in-app notification
      sendOrderConfirmation({ id: docRef.id, ...orderData, hasInstallmentItems });
      if (user?.uid) {
        createNotification(user.uid, {
          type: 'order_confirmed',
          title: '🎉 Order Confirmed!',
          message: `Your order #${docRef.id.slice(0, 8).toUpperCase()} has been placed and is pending payment verification.`,
          orderId: docRef.id,
        });
      }

      setFinalTotal(grandTotal);
      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' };

  if (authLoading && !placed) {
    return (
      <main className="main-content" style={{ padding: '28px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 className="spinner" size={32} color="var(--primary)" />
      </main>
    );
  }

  if (cart.length === 0 && !placed) return null;

  return (
    <main className="main-content" style={{ padding: '28px 20px' }}>
      {/* Fixed floating cancel button — always on top of Klump's full-screen overlay */}
      {klumpOpen && createPortal(
        <>
          {/* Top-right button for desktop */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2147483647,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '12px 16px',
            pointerEvents: 'none',
          }}>
            <button
              onClick={() => {
                try {
                  const klumpDiv = document.getElementById('klump__checkout');
                  if (klumpDiv) klumpDiv.innerHTML = '';
                  document.querySelectorAll('[id^="klump"]').forEach(el => {
                    if (el.id !== 'klump__checkout') el.remove();
                  });
                  document.querySelectorAll('iframe[src*="klump"]').forEach(el => el.remove());
                  setKlumpOpen(false);
                  setLoading(false);
                  setError('Klump payment cancelled. Please choose another payment method or try again.');
                } catch (e) {
                  window.location.reload();
                }
              }}
              style={{
                pointerEvents: 'auto',
                background: '#B30000',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 22px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.03em',
              }}
            >
              ✕ Cancel Payment
            </button>
          </div>

          {/* Bottom sticky bar for mobile — always visible */}
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2147483647,
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <button
              onClick={() => {
                try {
                  const klumpDiv = document.getElementById('klump__checkout');
                  if (klumpDiv) klumpDiv.innerHTML = '';
                  document.querySelectorAll('[id^="klump"]').forEach(el => {
                    if (el.id !== 'klump__checkout') el.remove();
                  });
                  document.querySelectorAll('iframe[src*="klump"]').forEach(el => el.remove());
                  setKlumpOpen(false);
                  setLoading(false);
                  setError('Klump payment cancelled. Please choose another payment method or try again.');
                } catch (e) {
                  window.location.reload();
                }
              }}
              style={{
                pointerEvents: 'auto',
                background: '#B30000',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '14px 32px',
                fontWeight: 800,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(179,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.03em',
                width: '100%',
                maxWidth: '400px',
                justifyContent: 'center',
              }}
            >
              ✕ Cancel Payment
            </button>
          </div>
        </>,
        document.body
      )}
      <div id="klump__checkout" style={{ display: klumpOpen ? 'block' : 'none' }}></div>

      {!klumpOpen && placed ? (
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(0,230,118,0.1)', border: '3px solid var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={52} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: 'var(--success)', marginBottom: '12px' }}>Order Placed!</h1>
          <p style={{ color: 'var(--gray-1)', fontSize: '16px', marginBottom: '8px' }}>Thank you for your purchase. We are currently verifying your payment receipt.</p>
          <p style={{ color: 'var(--gray-1)', fontSize: '14px', marginBottom: '24px' }}>You will receive an email notification once your order is confirmed and processing.</p>

          {hasInstallmentItems && (
            <div style={{ background: 'rgba(255,152,0,0.1)', border: '1px solid var(--warning)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', fontWeight: 800, marginBottom: '8px' }}>
                <CheckCircle size={18} /> Installment Plan Activated
              </div>
              <p style={{ fontSize: '14px', color: 'var(--white)', lineHeight: '1.6', margin: 0 }}>
                Your first deposit has been received! Please log in to your <strong>Customer Dashboard</strong> to track your progress, see your upcoming weekly/monthly payment amounts, and upload future receipts.
              </p>
            </div>
          )}

          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px', marginBottom: '32px' }}>Order Total: {formatCurrency(finalTotal)}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>Track Order <ChevronRight size={16} /></Link>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--dark-card)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>Continue Shopping</Link>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '28px' }}>Checkout</h1>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', background: i <= step ? 'var(--primary)' : 'var(--dark-card)', color: i <= step ? 'var(--black)' : 'var(--gray-1)', border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--dark-border)'}`, transition: 'var(--transition)' }}>{i < step ? '✓' : i + 1}</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: i === step ? 'var(--primary)' : 'var(--gray-1)' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'var(--primary)' : 'var(--dark-border)', margin: '0 8px', marginBottom: '20px', transition: 'var(--transition)' }}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="cart-grid">
            {/* Steps Content */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={20} color="var(--primary-light, #4CAF50)" /> Delivery Option</h3>

                  {/* Delivery Option Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {deliveryOptions.map(opt => (
                      <div key={opt.id} onClick={() => setDeliveryOption(opt.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: `2px solid ${deliveryOption === opt.id ? 'var(--primary)' : 'var(--dark-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: deliveryOption === opt.id ? 'var(--primary-light)' : 'var(--dark)', transition: 'all 0.2s' }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px' }}>{opt.label}</div>
                          <div style={{ fontSize: '12px', color: 'var(--gray-1)', marginTop: '2px' }}>{opt.desc}</div>
                        </div>
                        <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800, background: opt.fee === 0 ? 'rgba(76,175,80,0.15)' : opt.fee === null ? 'rgba(249,168,37,0.15)' : 'var(--primary-light)', color: opt.fee === 0 ? 'var(--primary)' : opt.fee === null ? '#F9A825' : 'var(--primary)', border: `1px solid ${opt.fee === 0 ? 'rgba(76,175,80,0.3)' : opt.fee === null ? 'rgba(249,168,37,0.3)' : 'rgba(76,175,80,0.3)'}` }}>{opt.badge}</span>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${deliveryOption === opt.id ? 'var(--primary)' : 'var(--dark-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {deliveryOption === opt.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Address fields — only required for home delivery */}
                  {deliveryOption !== 'farm_pickup' && (
                    <>
                      <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '16px', color: 'var(--gray-1)' }}>Your Delivery Address</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {[['Full Name', 'fullName', 'text', 'e.g., Hassan Doe'], ['Email', 'email', 'email', 'e.g., mail@example.com'], ['Phone', 'phone', 'tel', 'e.g., +234 705 531 0766'], ['Street Address', 'address', 'text', 'e.g., 5 Ring Road, Ibadan'], ['City / Area', 'city', 'text', 'e.g., Ibadan']].map(([label, key, type, placeholder]) => (
                            <div key={key}>
                              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</label>
                              <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--dark-border)'} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {deliveryOption === 'farm_pickup' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {[['Full Name', 'fullName', 'text', 'e.g., Hassan Doe'], ['Email', 'email', 'email', 'e.g., mail@example.com'], ['Phone', 'phone', 'tel', 'e.g., +234 705 531 0766']].map(([label, key, type, placeholder]) => (
                        <div key={key}>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</label>
                          <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'var(--dark-border)'} />
                        </div>
                      ))}
                    </div>
                  )}

                  {deliveryOption === 'outside_ibadan' && (
                    <div style={{ background: 'rgba(249,168,37,0.07)', border: '1px solid rgba(249,168,37,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: '13px', color: '#F9A825' }}>
                      ⚠️ For deliveries outside Ibadan, please contact us on WhatsApp first: <a href="https://wa.me/2347055310766" target="_blank" rel="noopener noreferrer" style={{ color: '#F9A825', fontWeight: 700, textDecoration: 'underline' }}>+234 705 531 0766</a> to confirm delivery cost before completing your order.
                    </div>
                  )}

                  <button onClick={() => {
                    if (!formData.fullName || !formData.phone) {
                      setError('Please provide your name and phone number.');
                      return;
                    }
                    setError('');
                    setStep(1);
                  }} style={{ background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>Continue <ChevronRight size={18} /></button>
                  {error && <p style={{ color: 'var(--danger)', fontSize: '13px', textAlign: 'center' }}>{error}</p>}
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>🍗 Select Processing</h3>
                  <p style={{ fontSize: '13px', color: 'var(--gray-1)', marginTop: '-10px' }}>Tell us how you want your chicken — Live, Slaughtered & Dressed, or Frozen.</p>
                  {PROCESSING_OPTIONS.map(opt => (
                    <div key={opt.id} onClick={() => setProcessingOption(opt.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: `2px solid ${processingOption === opt.id ? 'var(--primary)' : 'var(--dark-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: processingOption === opt.id ? 'var(--primary-light)' : 'var(--dark)', transition: 'all 0.2s' }}
                    >
                      <div style={{ fontSize: '28px', lineHeight: 1 }}>{opt.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-1)', marginTop: '2px' }}>{opt.desc}</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${processingOption === opt.id ? 'var(--primary)' : 'var(--dark-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {processingOption === opt.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setStep(0)} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setStep(2)} style={{ flex: 2, background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Continue <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><CreditCard size={20} color="var(--primary)" /> Payment Method</h3>
                  {[
                    { id: 'bank_transfer', label: 'Direct Bank Transfer', icon: CreditCard, desc: 'Transfer to Samtob p&c Ltd · Wema Bank' },
                    { id: 'installment', label: 'Installment Payment', icon: CalendarDays, desc: 'Payments split evenly, delivery after full payment' },
                    ...(user?.isAdmin ? [{ id: 'admin_cash', label: 'Admin POS / Cash', icon: Zap, desc: 'Direct order placement (Admin only)' }] : []),
                  ].map(method => (
                    <div key={method.id} onClick={() => setFormData(p => ({ ...p, payMethod: method.id }))}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--dark-border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: formData.payMethod === method.id ? 'rgba(76,175,80,0.06)' : 'var(--dark)', transition: 'all 0.2s' }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <method.icon size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{method.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--gray-1)' }}>{method.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--dark-border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.payMethod === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                      </div>
                    </div>
                  ))}

                  {/* Installment duration selector */}
                  {formData.payMethod === 'installment' && (
                    <div style={{ background: 'rgba(249,168,37,0.08)', border: '1px solid rgba(249,168,37,0.4)', borderRadius: 'var(--radius-md)', padding: '16px', marginTop: '4px' }}>
                      <div style={{ fontWeight: 800, color: '#F9A825', fontSize: '14px', marginBottom: '12px' }}>📅 Choose Your Payment Duration</div>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
                        {[2, 3, 4, 8, 12].map(w => (
                          <button key={w} onClick={() => setInstallmentDuration(w)}
                            style={{ padding: '8px 18px', borderRadius: 'var(--radius-sm)', border: `2px solid ${installmentDuration === w ? '#F9A825' : 'var(--dark-border)'}`, background: installmentDuration === w ? 'rgba(249,168,37,0.15)' : 'var(--dark)', color: installmentDuration === w ? '#F9A825' : 'var(--gray-1)', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>
                            {w === 4 ? '4 Wks' : w === 8 ? '8 Wks' : w === 12 ? '12 Wks (Monthly)' : `${w} Wks`}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                        <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                          <div style={{ color: 'var(--gray-1)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Pay Today (Part 1 of {installmentDuration})</div>
                          <div style={{ fontWeight: 900, fontSize: '18px', color: '#F9A825' }}>{formatCurrency(installmentFirstDeposit)}</div>
                        </div>
                        <div style={{ background: 'var(--dark)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                          <div style={{ color: 'var(--gray-1)', marginBottom: '4px', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Then Recurring</div>
                          <div style={{ fontWeight: 900, fontSize: '18px', color: 'var(--primary)' }}>{formatCurrency(installmentWeeklyAmt)}<span style={{ fontSize: '12px', fontWeight: 400 }}>/wk × {installmentDuration - 1}</span></div>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--gray-2)', marginTop: '10px' }}>Full order total: {formatCurrency(subTotal)} — Log in to your dashboard to make future payments.</div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button onClick={() => setStep(1)} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setStep(3)} style={{ flex: 2, background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Review Order <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Review & Pay</h3>

                  {/* Order summary */}
                  <div style={{ background: 'var(--dark)', border: '1px solid rgba(76,175,80,0.2)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'grid', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray-1)' }}>Delivery</span>
                      <span style={{ fontWeight: 700 }}>{selectedDelivery.label}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray-1)' }}>Processing</span>
                      <span style={{ fontWeight: 700 }}>{PROCESSING_OPTIONS.find(p => p.id === processingOption)?.label}</span>
                    </div>
                    <div style={{ height: '1px', background: 'var(--dark-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray-1)' }}>Items Subtotal</span>
                      <span style={{ fontWeight: 700 }}>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--gray-1)' }}>Delivery Fee</span>
                      <span style={{ fontWeight: 700, color: deliveryFee === 0 ? 'var(--primary)' : 'inherit' }}>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
                    </div>
                    {processingFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--gray-1)' }}>Processing Fee ({totalQty} birds)</span>
                        <span style={{ fontWeight: 700 }}>{formatCurrency(processingFee)}</span>
                      </div>
                    )}
                    <div style={{ height: '1px', background: 'var(--dark-border)' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, color: '#fff' }}>Total Payable Now</span>
                      <span style={{ fontWeight: 800, fontSize: '18px', color: '#F9A825' }}>{formatCurrency(grandTotal)}</span>
                    </div>
                    {hasInstallmentItems && (
                      <div style={{ padding: '12px', background: 'rgba(249,168,37,0.08)', border: '1px solid rgba(249,168,37,0.3)', borderRadius: 'var(--radius-sm)', marginTop: '8px' }}>
                        <div style={{ color: '#F9A825', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>🗓️ December Rush Installment Schedule</div>
                        {cart.filter(i => i.isInstallment).map((item, idx) => (
                          <div key={idx} style={{ fontSize: '12px', lineHeight: 1.8, marginBottom: '6px', paddingBottom: '6px', borderBottom: '1px solid rgba(249,168,37,0.15)' }}>
                            <div style={{ fontWeight: 700, color: 'var(--white)' }}>{item.name}</div>
                            <div style={{ color: 'var(--gray-1)' }}>Today: <strong style={{ color: '#F9A825' }}>{formatCurrency(item.installmentDetails?.firstPayment ?? item.price)}</strong></div>
                            {item.installmentDetails?.weeklyPayment && (
                              <div style={{ color: 'var(--gray-1)' }}>Then: <strong style={{ color: 'var(--white)' }}>{formatCurrency(item.installmentDetails.weeklyPayment)}/wk × {item.installmentDetails.duration - 1} wks</strong></div>
                            )}
                            {item.installmentDetails?.total && (
                              <div style={{ color: 'var(--gray-1)' }}>Total: {formatCurrency(item.installmentDetails.total)}</div>
                            )}
                          </div>
                        ))}
                        <div style={{ fontSize: '11px', color: 'var(--gray-2)', marginTop: '4px' }}>
                          Weekly payments will be collected automatically. Farm pickup on final payment.
                        </div>
                      </div>
                    )}
                  </div>

                  {(formData.payMethod === 'bank_transfer' || formData.payMethod === 'installment') && (
                    <div style={{ background: 'var(--dark)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCard size={18} /> {isInstallmentPayment ? 'Pay Initial Installment' : 'Transfer to This Account'}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--gray-1)', marginBottom: '16px' }}>
                        Transfer <strong style={{ color: '#F9A825' }}>{formatCurrency(grandTotal)}</strong> {isInstallmentPayment ? `(Payment 1 of ${installmentDuration})` : ''} to the account below, then upload your receipt.
                      </p>

                      <div style={{ background: 'var(--black)', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'grid', gap: '12px', border: '1px solid rgba(249,168,37,0.2)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Bank Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>Wema Bank</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Account Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px' }}>Samtob p&c Ltd</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--gray-1)', fontSize: '13px' }}>Account Number</span>
                          <span style={{ fontWeight: 800, fontSize: '22px', color: '#F9A825', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>0127186331</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>Upload Payment Receipt <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ flex: 1, background: 'var(--dark-card)', border: '1.5px dashed rgba(76,175,80,0.3)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <Upload size={20} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--gray-1)' }}>Click to upload transfer screenshot</span>
                            <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ display: 'none' }} />
                          </label>
                          {receiptPreview && (
                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--dark-border)' }}>
                              <img src={receiptPreview} alt="Receipt preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}



                  {/* Terms Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', marginBottom: '16px' }}>
                    {/* Terms */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <div
                        onClick={() => setTermsAccepted(prev => ({ ...prev, terms: !prev.terms }))}
                        style={{ flexShrink: 0, marginTop: '2px', width: '20px', height: '20px', borderRadius: '4px', border: termsAccepted.terms ? '2px solid var(--success)' : '2px solid var(--gray-2)', background: termsAccepted.terms ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                      >
                        {termsAccepted.terms && <CheckCircle size={14} color="var(--black)" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '13px', color: termsAccepted.terms ? 'var(--success)' : 'var(--gray-1)', lineHeight: 1.5 }}>
                        I accept the <strong style={{ color: 'var(--white)' }}>Terms & Conditions</strong> including the No-Return & No-Refund policy.
                      </span>
                    </label>

                    {/* Privacy */}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                      <div
                        onClick={() => setTermsAccepted(prev => ({ ...prev, privacy: !prev.privacy }))}
                        style={{ flexShrink: 0, marginTop: '2px', width: '20px', height: '20px', borderRadius: '4px', border: termsAccepted.privacy ? '2px solid var(--success)' : '2px solid var(--gray-2)', background: termsAccepted.privacy ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
                      >
                        {termsAccepted.privacy && <CheckCircle size={14} color="var(--black)" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '13px', color: termsAccepted.privacy ? 'var(--success)' : 'var(--gray-1)', lineHeight: 1.5 }}>
                        I accept the <strong style={{ color: 'var(--white)' }}>Privacy Policy</strong> and consent to data processing under Nigerian NDPR.
                      </span>
                    </label>
                  </div>

                  {error && (
                    <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>Back</button>
                    <button onClick={handlePlaceOrderClick} disabled={loading} style={{ flex: 2, background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
                      {loading ? <><Loader2 className="spinner" size={18} /> Processing...</> : <><Zap size={18} /> {formData.payMethod === 'klump_bnpl' ? 'Pay with Klump' : 'Place Order'} — {formatCurrency(formData.payMethod === 'klump_bnpl' ? subTotal : grandTotal)}</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--dark-border)' }}>Order Summary</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--dark)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.imgUrl || item.image || item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--white)', marginBottom: '2px', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ color: 'var(--gray-1)', fontSize: '11px' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Subtotal</span><span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatCurrency(cartTotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--gray-1)' }}><span>Delivery</span><span style={{ color: 'var(--white)', fontWeight: 600 }}>{formatCurrency(deliveryFee)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, paddingTop: '12px', borderTop: '1px solid var(--dark-border)', marginTop: '4px' }}><span>Total</span><span style={{ color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {activeLegal && createPortal(
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative' }}>
            <button onClick={() => setActiveLegal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '20px', color: 'var(--white)' }}>
              {activeLegal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h3>
            <div style={{ color: 'var(--gray-1)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              {activeLegal === 'terms' ? (
                <>
                  <p style={{ marginBottom: '16px' }}>By proceeding, you agree to Akilapa &amp; Sons' terms of service. All purchases are final once delivered and verified in good condition.</p>
                  <h4 style={{ color: 'var(--white)', fontWeight: 700, marginBottom: '8px' }}>No-Return & No-Refund Policy</h4>
                  <p>Please note that we operate a strict No-Return and No-Refund policy. Once an item is purchased and collected/delivered, it cannot be returned for a refund or exchanged unless it is Dead On Arrival (DOA) and verified by our technicians within 24 hours of delivery.</p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '16px' }}>We value your privacy and are committed to protecting your personal data in accordance with the Nigerian Data Protection Regulation (NDPR).</p>
                  <h4 style={{ color: 'var(--white)', fontWeight: 700, marginBottom: '8px' }}>Data Processing Consent</h4>
                  <p>By accepting this policy, you consent to our collection, use, and processing of your personal information (including name, phone, address, and email) solely for the purpose of fulfilling your order, providing customer support, and occasionally sending you updates about our services.</p>
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  if (activeLegal === 'terms') setTermsAccepted(p => ({ ...p, terms: true }));
                  if (activeLegal === 'privacy') setTermsAccepted(p => ({ ...p, privacy: true }));
                  setActiveLegal(null);
                }}
                style={{ width: '100%', padding: '14px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-md)', color: 'var(--black)', fontWeight: 800, cursor: 'pointer', transition: 'var(--transition)', boxShadow: '0 8px 24px var(--primary-glow)' }}
              >
                I Accept
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}
