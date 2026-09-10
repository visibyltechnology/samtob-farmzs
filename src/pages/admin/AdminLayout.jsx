import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Package, PlusCircle, LogOut, Users, ClipboardList,
  LayoutDashboard, Menu, X, Loader2, Tag, Briefcase,
  Settings, MapPin, Home, CalendarClock, ChevronRight,
  Leaf, CreditCard
} from 'lucide-react';

const NAV_GROUPS = [
  {
    group: 'Overview',
    links: [
      { to: '/admin', icon: <LayoutDashboard size={17} />, label: 'Dashboard', end: true },
    ]
  },
  {
    group: 'Store',
    links: [
      { to: '/admin/products', icon: <Package size={17} />, label: 'Products' },
      { to: '/admin/products/add', icon: <PlusCircle size={17} />, label: 'Add Product' },
      { to: '/admin/orders', icon: <ClipboardList size={17} />, label: 'Orders' },
      { to: '/admin/december-rush', icon: <CalendarClock size={17} />, label: 'December Rush' },
    ]
  },
  {
    group: 'Catalogue',
    links: [
      { to: '/admin/categories', icon: <Tag size={17} />, label: 'Categories' },
      { to: '/admin/brands', icon: <Briefcase size={17} />, label: 'Brands' },
    ]
  },
  {
    group: 'Management',
    links: [
      { to: '/admin/users', icon: <Users size={17} />, label: 'Customers' },
      { to: '/admin/locations', icon: <MapPin size={17} />, label: 'Locations' },
    ]
  },
];

const activeStyle = {
  background: 'linear-gradient(90deg, rgba(46,125,50,0.18) 0%, rgba(46,125,50,0.05) 100%)',
  color: 'var(--primary-light)',
  borderLeft: '3px solid var(--primary)',
  fontWeight: 700,
};
const inactiveStyle = {
  background: 'transparent',
  color: 'var(--gray-1)',
  borderLeft: '3px solid transparent',
  fontWeight: 600,
};

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Brand Block ── */}
      <div style={{
        padding: '20px 16px 18px',
        borderBottom: '1px solid rgba(46,125,50,0.2)',
        background: 'linear-gradient(180deg, rgba(46,125,50,0.1) 0%, transparent 100%)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img src="/logo.jpeg" alt="Samtob Farms" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', display: 'block' }} />
          <span style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', borderRadius: '50%', background: '#4CAF50', border: '2px solid var(--dark-card)' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '14px', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Samtob <span style={{ color: 'var(--primary)' }}>Farms</span>
          </div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '3px' }}>
            Admin Console
          </div>
          <div style={{ fontSize: '10px', color: 'var(--gray-2)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </div>
        </div>
      </div>

      {/* ── Nav Groups ── */}
      <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: '0', overflowY: 'auto' }}>
        {NAV_GROUPS.map(({ group, links }) => (
          <div key={group} style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--gray-2)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 14px 4px' }}>
              {group}
            </div>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  fontSize: '13.5px', textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: '2px',
                  ...(isActive ? activeStyle : inactiveStyle)
                })}
              >
                {link.icon}
                <span style={{ flex: 1 }}>{link.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        {/* Back to store */}
        <div style={{ borderTop: '1px solid var(--dark-border)', marginTop: '4px', paddingTop: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              fontSize: '13.5px', fontWeight: 600, textDecoration: 'none',
              color: 'var(--gray-2)', transition: 'all 0.2s ease',
              borderLeft: '3px solid transparent',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--gray-2)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Home size={17} /> Back to Store
          </Link>
        </div>
      </nav>

      {/* ── Sign Out ── */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--dark-border)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '8px', padding: '11px 14px', borderRadius: 'var(--radius-sm)',
            background: 'transparent', border: '1px solid var(--dark-border)',
            color: 'var(--gray-1)', fontSize: '13.5px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--danger)'; e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'rgba(255,61,0,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dark-border)'; e.currentTarget.style.color = 'var(--gray-1)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--black)' }}>

      {/* ── Admin Top Bar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '58px',
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(46,125,50,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', flexShrink: 0
      }}>
        {/* Left: Hamburger + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'rgba(46,125,50,0.1)', border: '1px solid rgba(46,125,50,0.3)',
              color: 'var(--primary)', width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(46,125,50,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(46,125,50,0.1)'}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Leaf size={18} color="var(--primary)" />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '16px' }}>
              Samtob <span style={{ color: 'var(--primary)' }}>Farms</span>
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', background: 'rgba(46,125,50,0.12)', border: '1px solid rgba(46,125,50,0.3)', padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.06em' }}>
              ADMIN
            </span>
          </div>
        </div>

        {/* Right: User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--gray-1)' }} className="admin-user-email">
            {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
          </span>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '14px', color: '#fff',
            boxShadow: '0 2px 12px rgba(46,125,50,0.4)'
          }}>
            {(user.firstName?.[0] || user.email?.[0] || 'A').toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Body: Sidebar + Main ── */}
      <div style={{ display: 'flex', flex: 1, marginTop: '58px', position: 'relative', minHeight: 'calc(100vh - 58px)' }}>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, top: '58px', background: 'rgba(0,0,0,0.75)', zIndex: 900, backdropFilter: 'blur(4px)' }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: '240px',
          background: 'var(--dark-card)',
          borderRight: '1px solid rgba(46,125,50,0.15)',
          flexShrink: 0,
          position: 'fixed',
          top: '58px',
          left: sidebarOpen ? '0' : '-260px',
          bottom: 0,
          zIndex: 950,
          overflowY: 'auto',
          transition: 'left 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {sidebarContent}
        </aside>

        {/* Desktop persistent sidebar spacer */}
        <div className="admin-sidebar-spacer" style={{ width: '240px', flexShrink: 0 }} />

        {/* Page content */}
        <main style={{ flex: 1, minWidth: 0, padding: '28px 24px', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar-spacer { display: none !important; }
        }
        @media (min-width: 901px) {
          aside[style*="top: 58px"] { left: 0 !important; }
          .admin-user-email { display: inline !important; }
        }
      `}</style>
    </div>
  );
}
