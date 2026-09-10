import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ShieldCheck, Lock, CheckCircle, Loader2, X } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') value = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedTerms || !agreedPrivacy) {
      setError('Please accept both the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

      // 2. Send Firebase verification email
      await sendEmailVerification(cred.user);

      // 3. Save profile to Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        role: 'customer',
        createdAt: new Date(),
        emailVerified: false,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login?verify=1'), 2000);

    } catch (err) {
      console.error(err);
      const msg = {
        'auth/email-already-in-use': 'This email is already registered. Please log in.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      }[err.code] || err.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', transition: 'var(--transition)', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' };

  if (success) return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(76,175,80,0.12)', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={40} color="var(--primary)" />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>Check Your Email!</h2>
        <p style={{ color: 'var(--gray-1)', lineHeight: 1.7 }}>
          We sent a verification link to <strong style={{ color: 'var(--white)' }}>{formData.email}</strong>.<br />
          Click the link in the email, then log in.
        </p>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'radial-gradient(ellipse at top, #0a1f0a 0%, var(--black) 60%)' }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.jpeg" alt="Samtob Farms" style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Samtob <span style={{ color: 'var(--primary)' }}>Farms</span>
            </div>
          </Link>
          <h1 style={{ marginTop: '24px', fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900 }}>Create Your Account</h1>
          <p style={{ color: 'var(--gray-1)', marginTop: '6px' }}>Join Samtob Farms — fresh chickens, direct from our farm.</p>
        </div>

        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
          {error && (
            <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <X size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleRegister}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Adebola" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Okafor" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="08012345678" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email Address</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="Min 6 characters" style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowPassword(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-1)', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat password" style={{ ...inputStyle, paddingRight: '44px' }} />
                <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--gray-1)', cursor: 'pointer' }}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} style={{ marginTop: '2px', accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--gray-1)', lineHeight: 1.5 }}>
                  I agree to the <button type="button" onClick={() => setShowModal('terms')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, padding: 0, textDecoration: 'underline' }}>Terms & Conditions</button>
                </span>
              </label>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={agreedPrivacy} onChange={e => setAgreedPrivacy(e.target.checked)} style={{ marginTop: '2px', accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '13px', color: 'var(--gray-1)', lineHeight: 1.5 }}>
                  I agree to the <button type="button" onClick={() => setShowModal('privacy')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, padding: 0, textDecoration: 'underline' }}>Privacy Policy</button>
                </span>
              </label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', color: 'var(--white)', padding: '14px', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 20px var(--primary-glow)' }}>
              {loading ? <><Loader2 className="spinner" size={20} /> Creating Account...</> : <><UserPlus size={20} /> Create My Account</>}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--gray-1)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700 }}>Log In</Link>
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setShowModal(null)}>
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', padding: '32px', maxWidth: '520px', width: '100%', maxHeight: '70vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}>{showModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}</h3>
              <button onClick={() => setShowModal(null)} style={{ background: 'none', border: 'none', color: 'var(--gray-1)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {showModal === 'terms' ? (
              <p style={{ color: 'var(--gray-1)', lineHeight: 1.8, fontSize: '14px' }}>All sales are final. Samtob Farms operates a No-Return, No-Refund policy except for Dead-on-Arrival (DOA) birds verified within 24 hours of delivery. Installment customers must maintain weekly payments or risk losing their booking deposit. Farm pickup must be arranged in advance.</p>
            ) : (
              <p style={{ color: 'var(--gray-1)', lineHeight: 1.8, fontSize: '14px' }}>Your personal data (name, email, phone) is collected solely for order processing and communication. Data is stored securely in Firebase and is not sold to third parties. You may request data deletion by contacting us. We comply with Nigeria's NDPR regulations.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
