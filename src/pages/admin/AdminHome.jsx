import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';
import { useApp } from '../../context/AppContext';
import {
  Package, Users, ClipboardList, PlusCircle, TrendingUp,
  Settings, MapPin, CalendarClock, BarChart3, Truck, Zap
} from 'lucide-react';

export default function AdminHome() {
  const { user } = useApp();
  const [stats, setStats] = useState({ products: '-', orders: '-', users: '-', pending: '-' });

  useEffect(() => {
    (async () => {
      try {
        const [products, orders, users] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'orders')),
          getCountFromServer(collection(db, 'users')),
        ]);
        setStats({
          products: products.data().count,
          orders: orders.data().count,
          users: users.data().count,
        });
      } catch { /* ignore */ }
    })();
  }, []);

  const statCards = [
    { label: 'Total Products', icon: <Package size={22} />, value: stats.products, link: '/admin/products', accent: 'var(--primary)', glow: 'rgba(46,125,50,0.2)' },
    { label: 'Total Orders', icon: <ClipboardList size={22} />, value: stats.orders, link: '/admin/orders', accent: '#F9A825', glow: 'rgba(249,168,37,0.2)' },
    { label: 'Registered Customers', icon: <Users size={22} />, value: stats.users, link: '/admin/users', accent: '#00B0FF', glow: 'rgba(0,176,255,0.2)' },
    { label: 'December Rush', icon: <CalendarClock size={22} />, value: '🎄', link: '/admin/december-rush', accent: '#FF7043', glow: 'rgba(255,112,67,0.2)' },
  ];

  const actions = [
    { label: 'Add New Product', icon: <PlusCircle size={20} />, link: '/admin/products/add', desc: 'List a new chicken product', accent: 'var(--primary)' },
    { label: 'Manage Products', icon: <Package size={20} />, link: '/admin/products', desc: 'Edit, feature, or remove listings', accent: 'var(--primary)' },
    { label: 'View All Orders', icon: <ClipboardList size={20} />, link: '/admin/orders', desc: 'Review and update customer orders', accent: '#F9A825' },
    { label: 'December Rush', icon: <CalendarClock size={20} />, link: '/admin/december-rush', desc: 'Manage installment plan settings', accent: '#FF7043' },
    { label: 'Customer Accounts', icon: <Users size={20} />, link: '/admin/users', desc: 'See all registered customers', accent: '#00B0FF' },
    { label: 'Visitor Locations', icon: <MapPin size={20} />, link: '/admin/locations', desc: 'Track where visitors browse from', accent: '#AB47BC' },
  ];

  const fname = user?.firstName || 'Admin';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900, color: '#fff', boxShadow: '0 4px 20px rgba(46,125,50,0.4)' }}>
            {fname[0]}
          </div>
          <div>
            <p style={{ color: 'var(--gray-1)', fontSize: '13px', margin: 0 }}>{greeting},</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 900, margin: 0, color: 'var(--white)' }}>
              {fname} <span style={{ color: 'var(--primary)' }}>⚡</span>
            </h1>
          </div>
        </div>
        <p style={{ color: 'var(--gray-1)', fontSize: '14px', margin: 0 }}>
          Welcome to the Samtob Farms admin panel. Manage your farm store from here.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {statCards.map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '22px', transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.boxShadow = `0 8px 32px ${s.glow}`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dark-border)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              {/* Glow bg dot */}
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: s.glow, filter: 'blur(20px)' }} />
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: `${s.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent, marginBottom: '16px' }}>
                {s.icon}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, color: s.accent, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--gray-1)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Zap size={18} color="var(--primary)" />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, margin: 0 }}>Quick Actions</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
        {actions.map(a => (
          <Link key={a.label} to={a.link} style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.accent; e.currentTarget.style.background = `${a.accent}08`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--dark-border)'; e.currentTarget.style.background = 'var(--dark-card)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: `${a.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.accent, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--white)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
