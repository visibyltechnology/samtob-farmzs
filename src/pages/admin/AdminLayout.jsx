import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Package, PlusCircle, LogOut, Users, ClipboardList,
  LayoutDashboard, Menu, X, Loader2, Tag, Briefcase, Settings, MapPin, Home, CreditCard
} from 'lucide-react';

export default function AdminLayout() {
  const { user, authLoading, logout } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
        <Loader2 className="spinner" size={48} color="var(--primary)" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
    { to: '/admin/products/add', icon: <PlusCircle size={18} />, label: 'Add Product' },
    { to: '/admin/orders', icon: <ClipboardList size={18} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { to: '/admin/categories', icon: <Tag size={18} />, label: 'Categories' },
    { to: '/admin/brands', icon: <Briefcase size={18} />, label: 'Brands' },
    { to: '/admin/locations', icon: <MapPin size={18} />, label: 'Locations' },
    { to: '/admin/settings', icon: <Settings size={18} />, label: 'Site Settings' },
    { to: '/admin/subscriptions', icon: <CreditCard size={18} />, label: 'Subscriptions' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sidebar Brand */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--dark-border)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <img src="/logo.jpeg" alt="Akilapa & Sons" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '13px', color: 'var(--text-main)', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Akilapa <span style={{ color: 'var(--primary)' }}>& Sons</span>
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>Admin Panel</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {navLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '14px', fontWeight: 600, textDecoration: 'none',
              transition: 'all 0.2s ease',
              background: isActive ? 'rgba(211,47,47,0.12)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--gray-1)',
              borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`
            })}
          >
            {link.icon} {link.label}
          </NavLink>
        ))}

        {/* Back to Site */}
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', borderRadius: 'var(--radius-sm)',
            fontSize: '14px', fontWeight: 600, textDecoration: 'none',
            color: 'var(--gray-2)', borderLeft: '3px solid transparent',
            marginTop: '8px', borderTop: '1px solid var(--dark-border)', paddingTop: '16px'
          }}
        >
          <Home size={18} /> Back to Site
        </Link>
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--dark-border)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: '1px solid var(--dark-border)',
            color: 'var(--gray-1)', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dark-border)'; e.currentTarget.style.color = 'var(--gray-1)'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--black)' }}>

      {/* ── Admin Top Bar (full width) ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '60px', background: 'var(--dark-card)',
        borderBottom: '1px solid var(--dark-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0
      }}>
        {/* Left: Hamburger + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', color: 'var(--white)', width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '16px', color: 'var(--white)' }}>
            Akilapa <span style={{ color: 'var(--primary)' }}>Admin</span>
          </span>
        </div>

        {/* Right: User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'var(--gray-1)', display: 'none' }} className="admin-user-email">{user.email}</span>
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', color: '#fff' }}>
            {(user.firstName?.[0] || user.email?.[0] || 'A').toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div style={{ display: 'flex', flex: 1, marginTop: '60px', position: 'relative', minHeight: 'calc(100vh - 60px)' }}>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, top: '60px', background: 'rgba(0,0,0,0.7)', zIndex: 900, backdropFilter: 'blur(4px)' }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: 'var(--dark-card)',
          borderRight: '1px solid var(--dark-border)',
          flexShrink: 0,
          position: 'fixed',
          top: '60px',
          left: sidebarOpen ? '0' : '-260px',
          bottom: 0,
          zIndex: 950,
          overflowY: 'auto',
          transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          // On large screens, always show
        }}>
          {sidebarContent}
        </aside>

        {/* Desktop persistent sidebar spacer */}
        <div className="admin-sidebar-spacer" style={{ width: '240px', flexShrink: 0 }} />

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-spacer { display: none !important; }
        }
        @media (min-width: 901px) {
          aside[style*="top: 60px"] { left: 0 !important; }
          .admin-user-email { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
