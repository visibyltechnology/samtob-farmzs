import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, KeyRound, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { sendOTPEmail } from '../utils/emailService';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  
  const [pendingData, setPendingData] = useState(null);
  const [expectedOtp, setExpectedOtp] = useState('');
  
  const navigate = useNavigate();

  const handleResendOTP = async () => {
    if (resending || !pendingData) return;
    setResending(true);
    setError('');
    setResendSuccess('');
    
    try {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const emailSent = await sendOTPEmail(pendingData.email, generatedOtp, pendingData.firstName);
      
      if (!emailSent) {
        throw new Error('Failed to resend verification email.');
      }
      
      sessionStorage.setItem('registrationOTP', generatedOtp);
      setExpectedOtp(generatedOtp);
      setResendSuccess('A new OTP has been sent to your email.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    // Load pending registration from session
    const data = sessionStorage.getItem('pendingRegistration');
    const code = sessionStorage.getItem('registrationOTP');
    
    if (data && code) {
      setPendingData(JSON.parse(data));
      setExpectedOtp(code);
    } else {
      // If no pending registration, kick them back to register
      navigate('/register');
    }
  }, [navigate]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    
    if (code.length < 6) { 
      setError('Please enter all 6 digits of your OTP.'); 
      return; 
    }
    
    if (code !== expectedOtp) {
      setError('Invalid verification code. Please try again.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        pendingData.email, 
        pendingData.password
      );
      
      const user = userCredential.user;
      
      // 2. Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: pendingData.firstName,
        lastName: pendingData.lastName,
        phone: pendingData.phone,
        email: pendingData.email,
        isAdmin: false, // Default role
        createdAt: new Date().toISOString()
      });
      
      // 3. Clear session storage
      sessionStorage.removeItem('pendingRegistration');
      sessionStorage.removeItem('registrationOTP');
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'radial-gradient(ellipse at top, #1a0a00 0%, var(--black) 60%)' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.jpeg" alt="Akilapa & Sons" style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Akilapa <span style={{ color: 'var(--primary)' }}>&amp; Sons</span>
            </div>
          </Link>
        </div>

        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ background: 'linear-gradient(135deg, #1a0a00, #2d1200)', padding: '28px 32px', borderBottom: '1px solid var(--dark-border)', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255,94,0,0.15)', border: '2px solid var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <KeyRound size={28} color="var(--primary)" />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--white)' }}>Verify Your Email</h1>
            <p style={{ color: 'var(--gray-1)', fontSize: '13px', marginTop: '8px' }}>
              Enter the 6-digit code we sent to <br/>
              <span style={{color: 'var(--primary)', fontWeight: 600}}>{pendingData?.email || 'your email address'}</span>
            </p>
          </div>

          <div style={{ padding: '32px' }}>
            {success ? (
              <div style={{ textAlign: 'center' }}>
                <ShieldCheck size={64} color="var(--success)" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--success)', marginBottom: '8px' }}>Email Verified!</h3>
                <p style={{ color: 'var(--gray-1)', marginBottom: '24px' }}>Your account is ready. Welcome to Akilapa &amp; Sons!</p>
                <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'var(--black)', padding: '12px 28px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>Start Shopping <ArrowRight size={16} /></Link>
              </div>
            ) : (
              <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {error && <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: '#ff8066', fontSize: '13px', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleKeyDown(e, i)}
                      style={{
                        width: '52px', height: '60px', textAlign: 'center', fontSize: '24px', fontWeight: 800,
                        fontFamily: 'var(--font-display)', background: 'var(--dark)', border: `2px solid ${digit ? 'var(--primary)' : 'var(--dark-border)'}`,
                        color: 'var(--white)', borderRadius: 'var(--radius-sm)', transition: 'var(--transition)',
                        boxShadow: digit ? '0 0 12px var(--primary-glow)' : 'none'
                      }}
                    />
                  ))}
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', background: 'var(--primary)', color: 'var(--black)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '15px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px var(--primary-glow)', transition: 'var(--transition)' }}>
                  {loading ? <><Loader2 className="spinner" size={16} /> Verifying & Creating Account...</> : <><ShieldCheck size={16} /> Verify Email</>}
                </button>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '13px', color: 'var(--gray-1)' }}>
                    Didn't receive a code?{' '}
                    <button type="button" onClick={handleResendOTP} disabled={resending} style={{ color: 'var(--primary)', fontWeight: 700, background: 'none', border: 'none', cursor: resending ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: resending ? 0.7 : 1 }}>
                      {resending ? 'Resending...' : 'Resend OTP'}
                    </button>
                  </p>
                  {resendSuccess && <p style={{ color: 'var(--success)', fontSize: '12px', marginTop: '8px' }}>{resendSuccess}</p>}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
