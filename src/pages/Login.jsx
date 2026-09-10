import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ShieldCheck, Loader2, MailCheck, Lock } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const justRegistered = new URLSearchParams(location.search).get('verify') === '1';

  // Navigate only after the user context is fully populated (including isAdmin)
  React.useEffect(() => {
    if (isLoggingIn && user) {
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate(user.isAdmin ? '/admin' : '/');
      }
    }
  }, [user, isLoggingIn, navigate, location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Enforce email verification
      if (!cred.user.emailVerified) {
        setError('Please verify your email before logging in. Check your inbox for the verification link.');
        setLoading(false);
        return;
      }

      setIsLoggingIn(true);
    } catch (err) {
      console.error(err);
      if (['auth/invalid-credential','auth/user-not-found','auth/wrong-password'].includes(err.code)) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Failed to sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password).catch(() => null);
      if (cred?.user) await sendEmailVerification(cred.user);
      setError('Verification email resent! Check your inbox.');
    } catch { setError('Could not resend. Check your email/password first.'); }
  };

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'radial-gradient(ellipse at top, #0a1f0a 0%, var(--black) 60%)' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img src="/logo.jpeg" alt="Samtob Farms" style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.1 }}>
              Samtob <span style={{ color: 'var(--primary)' }}>Farms</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '10px' }}>Fresh Farm Chickens from Ibadan</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
          
          {/* Card Header */}
          <div style={{ background: 'linear-gradient(135deg, #0a1f0a, #1a3a1a)', padding: '28px 32px', borderBottom: '1px solid var(--dark-border)' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 800, color: 'var(--white)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogIn size={24} color="var(--primary)" /> Welcome Back
            </h1>
            <p style={{ color: 'var(--gray-1)', fontSize: '14px', marginTop: '4px' }}>Sign in to your Samtob Farms account</p>
          </div>

          {/* Card Body */}
          <div style={{ padding: '32px' }}>
            {/* Just-registered banner */}
            {justRegistered && (
              <div style={{ background: 'rgba(76,175,80,0.1)', border: '1px solid var(--primary)', color: 'var(--primary)', fontSize: '13px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MailCheck size={18} style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Account created! Check your email for a verification link, then come back to log in.</span>
              </div>
            )}

            {error && (
              <div style={{ background: 'rgba(255, 61, 0, 0.1)', border: '1px solid var(--danger)', color: '#ff8066', fontSize: '13px', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span>{error}</span>
                {error.includes('verify your email') && (
                  <button type="button" onClick={handleResendVerification} style={{ background: 'none', border: 'none', color: '#F9A825', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 700, textAlign: 'left', textDecoration: 'underline' }}>
                    Resend verification email
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Email Address</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  style={{ width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', transition: 'var(--transition)' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--dark-border)'}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--gray-1)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Password</label>
                  <Link to="/forgot-password" style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Forgot Password?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="••••••••"
                    style={{ width: '100%', background: 'var(--dark)', border: '1.5px solid var(--dark-border)', color: 'var(--white)', padding: '12px 48px 12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px', transition: 'var(--transition)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--dark-border)'}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'var(--dark-border)' : 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                  color: loading ? 'var(--gray-2)' : 'var(--white)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 800, fontSize: '15px',
                  fontFamily: 'var(--font-display)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'var(--transition)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px var(--primary-glow)'
                }}
              >
                {loading ? <><Loader2 className="spinner" size={18} /> Signing in...</> : <><LogIn size={16} /> Sign In to Account</>}
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--dark-border)', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--gray-1)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700 }}>Create Account</Link>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--gray-2)' }}><Lock size={12} color="var(--success)" /> Secure Login</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--gray-2)' }}><ShieldCheck size={12} color="var(--info)" /> 100% Safe</span>
        </div>
      </div>
    </main>
  );
}
