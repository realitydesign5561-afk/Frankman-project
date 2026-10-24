import React, { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { LiveChatWidget } from './components/support/LiveChatWidget';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { StoreSettings } from './types';
import { clientStore } from './lib/client-store';

export default function App() {
  const [location, setLocation] = useLocation();
  const [settings, setSettings] = useState<StoreSettings | null>(() => {
    return clientStore.getStoreSettings();
  });

  // Admin authentication state
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('frankman_admin_token') : null;
  });
  const [adminUser, setAdminUser] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('frankman_admin_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Fetch store settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => {
        if (!res.ok) throw new Error('API non-200');
        return res.json();
      })
      .then((data) => setSettings(data))
      .catch(() => {
        setSettings(clientStore.getStoreSettings());
      });
  }, []);

  const handleAdminLoginSuccess = (token: string, user: any) => {
    setAdminToken(token);
    setAdminUser(user);
    setLocation('/admin');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('frankman_admin_token');
    localStorage.removeItem('frankman_admin_user');
    setAdminToken(null);
    setAdminUser(null);
    setLocation('/admin/login');
  };

  const isAdminRoute = location.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-amber-500/20 selection:text-slate-900 font-sans">
      {/* Public Header (hidden on admin pages for focused workspace) */}
      {!isAdminRoute && (
        <Header
          currentPath={location}
          onNavigate={(path) => setLocation(path)}
          announcementText={settings?.announcementText}
          announcementActive={settings?.announcementActive}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <Switch>
          <Route path="/">
            <HomePage
              onNavigate={(path) => setLocation(path)}
              whatsappNumber={settings?.whatsappNumber}
            />
          </Route>

          <Route path="/shop">
            <ShopPage onNavigate={(path) => setLocation(path)} />
          </Route>

          <Route path="/shop/furniture">
            <ShopPage
              initialCategory="furniture"
              onNavigate={(path) => setLocation(path)}
            />
          </Route>

          <Route path="/shop/electronics">
            <ShopPage
              initialCategory="electronics"
              onNavigate={(path) => setLocation(path)}
            />
          </Route>

          <Route path="/product/:slug">
            {(params) => (
              <ProductDetailPage
                slug={params.slug}
                onNavigate={(path) => setLocation(path)}
                whatsappNumber={settings?.whatsappNumber}
              />
            )}
          </Route>

          <Route path="/cart">
            <CartPage onNavigate={(path) => setLocation(path)} />
          </Route>

          <Route path="/checkout">
            <CheckoutPage onNavigate={(path) => setLocation(path)} />
          </Route>

          <Route path="/order-confirmation/:reference">
            {(params) => (
              <OrderConfirmationPage
                reference={params.reference}
                onNavigate={(path) => setLocation(path)}
                whatsappNumber={settings?.whatsappNumber}
              />
            )}
          </Route>

          <Route path="/about">
            <AboutPage
              onNavigate={(path) => setLocation(path)}
              whatsappNumber={settings?.whatsappNumber}
            />
          </Route>

          <Route path="/contact">
            <ContactPage
              onNavigate={(path) => setLocation(path)}
              phone={settings?.phoneNumber}
              whatsapp={settings?.whatsappNumber}
              email={settings?.email}
              businessAddress={settings?.businessAddress}
              businessHours={settings?.businessHours}
              facebookUrl={settings?.facebookUrl}
            />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login">
            <AdminLoginPage
              onLoginSuccess={handleAdminLoginSuccess}
              onNavigate={(path) => setLocation(path)}
            />
          </Route>

          <Route path="/admin">
            {adminToken ? (
              <AdminDashboardPage
                token={adminToken}
                user={adminUser}
                onLogout={handleAdminLogout}
                onNavigate={(path) => setLocation(path)}
              />
            ) : (
              <AdminLoginPage
                onLoginSuccess={handleAdminLoginSuccess}
                onNavigate={(path) => setLocation(path)}
              />
            )}
          </Route>

          {/* Catch-all 404 */}
          <Route>
            <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
                Page Not Found
              </span>
              <h1 className="font-serif text-3xl font-bold text-stone-900">
                404 - Lost in the Showroom
              </h1>
              <p className="text-xs text-stone-500">
                The showroom page you are attempting to visit does not exist or has been moved.
              </p>
              <button
                onClick={() => setLocation('/')}
                className="mt-4 px-6 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                Return to Showroom
              </button>
            </div>
          </Route>
        </Switch>
      </main>

      {/* Public Footer */}
      {!isAdminRoute && (
        <Footer
          onNavigate={(path) => setLocation(path)}
          phone={settings?.phoneNumber}
          whatsapp={settings?.whatsappNumber}
          email={settings?.email}
          businessAddress={settings?.businessAddress}
          businessHours={settings?.businessHours}
          facebookUrl={settings?.facebookUrl}
        />
      )}

      {/* Global Shopping Bag Slide-over Drawer */}
      <CartDrawer onNavigate={(path) => setLocation(path)} />

      {/* Floating Customer Support Live Chat Widget */}
      {!isAdminRoute && (
        <LiveChatWidget whatsappNumber={settings?.whatsappNumber} />
      )}
    </div>
  );
}
