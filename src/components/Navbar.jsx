import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogIn, Heart, ShieldCheck, LogOut, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [popupNotif, setPopupNotif] = useState(null);
  const prevNotifIds = useRef(new Set());
  const { cartCount, user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Real-time notification listener for bell badge + popup
  useEffect(() => {
    if (!user?.uid) {
      setUnreadCount(0);
      return;
    }
    const notifQuery = query(
      collection(db, 'users', user.uid, 'notifications'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(notifQuery, (snap) => {
      const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const unread = notifs.filter(n => !n.read);
      setUnreadCount(unread.length);

      // Show popup for any NEW notification (not seen before)
      const newNotif = notifs.find(n => !n.read && !prevNotifIds.current.has(n.id));
      if (newNotif && prevNotifIds.current.size > 0) {
        // Only show popup after initial load (prevNotifIds already populated)
        setPopupNotif(newNotif);
        setTimeout(() => setPopupNotif(null), 5000);
      }

      // Update seen IDs
      notifs.forEach(n => prevNotifIds.current.add(n.id));
    });
    return () => unsub();
  }, [user?.uid]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled glass-card' : ''}`}>
      <div className="container navbar-container">

        {/* ── Logo + Brand Name ── */}
        <Link to="/" className="navbar-logo">
          <img src="/logo.jpeg" alt="Samtob Farms Logo" className="nav-logo-img" />
          <span className="logo-text">
            Samtob<span className="logo-accent">Farms</span>
          </span>
        </Link>

        {/* ── Desktop Navigation ── */}
        <nav className="navbar-links desktop-only">
          {navLinks.map((link) => (
            <div key={link.name} className="nav-item-wrapper">
              <Link to={link.path} className="nav-link">
                {link.name}
                {location.pathname === link.path && (
                  <motion.div layoutId="activeNavIndicator" className="nav-active-indicator" />
                )}
              </Link>
            </div>
          ))}
        </nav>

        {/* ── Actions ── */}
        <div className="navbar-actions">

          {/* Search */}
          <div className="search-container">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  type="text"
                  placeholder="Search chickens..."
                  className="search-input"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button className="icon-btn" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
              <Search size={22} />
            </button>
          </div>

          {/* Notification Bell — only shown when logged in */}
          {user && (
            <Link to="/profile" state={{ tab: 'notifications' }} className="icon-btn" aria-label="Notifications"
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--danger)', color: '#fff',
                  borderRadius: '50%', width: '18px', height: '18px',
                  fontSize: '10px', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--black)',
                  lineHeight: 1,
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Wishlist */}
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} />
          </Link>

          {/* Cart */}
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* Auth Buttons – Desktop only */}
          <div className="auth-btns desktop-only">
            {user?.isAdmin && (
              <Link to="/admin" className="btn-ghost-sm" style={{ color: 'var(--primary-light)', borderColor: 'var(--primary-light)' }}>
                <ShieldCheck size={16} /> Admin
              </Link>
            )}
            {user ? (
              <>
                <Link to="/profile" className="btn-ghost-sm">
                  <User size={16} /> {user.firstName || 'Account'}
                </Link>
                <button onClick={handleLogout} className="btn-primary-sm" style={{ cursor: 'pointer' }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost-sm">
                  <LogIn size={16} /> Log In
                </Link>
                <Link to="/signup" className="btn-primary-sm">
                  <User size={16} /> Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mobile-menu"
          >
            <nav className="mobile-nav-links">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link to={link.path} className="mobile-nav-link">{link.name}</Link>
                </motion.div>
              ))}

              {/* Mobile Auth */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                className="mobile-auth-btns"
              >
                {user ? (
                  <>
                    <Link to="/profile" className="btn-ghost-sm w-full"><User size={14} /> {user.firstName || 'Account'}</Link>
                    {user.isAdmin && <Link to="/admin" className="btn-ghost-sm w-full" style={{ color: 'var(--primary-light)' }}><ShieldCheck size={14} /> Admin</Link>}
                    <button onClick={handleLogout} className="btn-primary-sm w-full" style={{ cursor: 'pointer' }}><LogOut size={14} /> Sign Out</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn-ghost-sm w-full">Log In</Link>
                    <Link to="/signup" className="btn-primary-sm w-full">Sign Up</Link>
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Notification Popup Toast ── */}
      <AnimatePresence>
        {popupNotif && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => { navigate('/profile', { state: { tab: 'notifications' } }); setPopupNotif(null); }}
            style={{
              position: 'fixed',
              top: '72px',
              right: '16px',
              zIndex: 99999,
              background: 'linear-gradient(135deg, rgba(20,30,20,0.97), rgba(10,20,10,0.98))',
              border: '1px solid rgba(0,230,118,0.4)',
              borderRadius: '12px',
              padding: '14px 18px',
              maxWidth: '340px',
              width: 'calc(100vw - 32px)',
              cursor: 'pointer',
              boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,230,118,0.1)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            {/* Green dot pulse */}
            <div style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: 'var(--primary)', flexShrink: 0, marginTop: '4px',
              boxShadow: '0 0 10px rgba(0,230,118,0.8)',
              animation: 'pulse 1.5s ease infinite',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#fff', marginBottom: '3px', lineHeight: 1.3 }}>
                {popupNotif.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--gray-1)', lineHeight: 1.4 }}>
                {popupNotif.message}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginTop: '6px' }}>
                Tap to view →
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setPopupNotif(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--gray-2)', cursor: 'pointer', flexShrink: 0, padding: '2px' }}
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </header>
  );
}
