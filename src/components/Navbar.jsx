import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, User, LogIn, Heart, ShieldCheck, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
          <img src="/logo.jpeg" alt="Samtob Farmzs Logo" className="nav-logo-img" />
          <span className="logo-text">
            Samtob<span className="logo-accent">Farmzs</span>
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
    </header>
  );
}
