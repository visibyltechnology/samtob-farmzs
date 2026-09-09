import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import AppLayout from './components/AppLayout';

// Contexts
import { AppProvider } from './context/AppContext';
import { ModalProvider } from './context/ModalContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBrands from './pages/admin/AdminBrands';
import AdminLocations from './pages/admin/AdminLocations';
import AdminSettings from './pages/admin/AdminSettings';
import AdminDecemberRush from './pages/admin/AdminDecemberRush';

// Subscription Admin
import AdminDashboard from './pages/AdminDashboard';
import './pages/AdminDashboard.css';

// Simple placeholder for genuinely missing pages
const Placeholder = ({ title }) => (
  <div className="container section-padding text-center">
    <h1>{title}</h1>
    <p style={{ color: 'var(--text-muted)' }}>This page is coming soon.</p>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <SubscriptionProvider>
        <ModalProvider>
          <Router>
            <Routes>

              {/* ── Admin Routes (standalone layout) ── */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="edit/:id" element={<AdminAddProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="locations" element={<AdminLocations />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="december-rush" element={<AdminDecemberRush />} />
                <Route path="subscriptions" element={<AdminDashboard />} />
              </Route>

              {/* ── All Public Routes inside AppLayout ── */}
              <Route path="*" element={
                <AppLayout>
                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Shop */}
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetails />} />

                    {/* Cart & Checkout */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/wishlist" element={<Wishlist />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />

                    {/* User */}
                    <Route path="/profile" element={<Profile />} />

                    {/* Contact */}
                    <Route path="/contact" element={<Placeholder title="Contact Us" />} />

                    {/* Fallback */}
                    <Route path="*" element={<Placeholder title="404 – Page Not Found" />} />
                  </Routes>
                </AppLayout>
              } />

            </Routes>
          </Router>
        </ModalProvider>
      </SubscriptionProvider>
    </AppProvider>
  );
}
