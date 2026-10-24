import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  User,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Truck,
  MessageCircle,
  Lock,
  Layers,
  Sparkles,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '../../store/cart-store';

interface HeaderProps {
  currentPath?: string;
  onNavigate: (path: string) => void;
  announcementText?: string;
  announcementActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPath = '/',
  onNavigate,
  announcementText = 'Free Delivery within Ibadan & Lagos on orders over ₦200,000 · Pay securely with Paystack',
  announcementActive = true,
}) => {
  const { getTotalCount, setDrawerOpen } = useCartStore();
  const totalCount = getTotalCount();

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [helpDropdownOpen, setHelpDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const accountRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelpDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    setHelpDropdownOpen(false);
    onNavigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNav(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const categoryRibbon = [
    { label: 'Living Room', path: '/shop?category=living' },
    { label: 'Dining Suites', path: '/shop?category=dining' },
    { label: 'Bedroom Furniture', path: '/shop?category=bedroom' },
    { label: 'Office & Workspaces', path: '/shop?category=office' },
    { label: 'TV & Consoles', path: '/shop?category=consoles' },
    { label: 'Smart Electronics', path: '/shop/electronics' },
    { label: 'Flash Deals', path: '/shop?deals=true', isDeal: true },
  ];

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* 1. TOP BANNER: Charcoal Navy Background (#0F172A), White text */}
      {announcementActive && !announcementDismissed && (
        <div className="bg-[#0F172A] text-white text-[11px] sm:text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Promo text */}
            <div className="flex items-center gap-2 truncate">
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider shrink-0">
                PROMO
              </span>
              <span className="truncate text-slate-200">
                {announcementText}
              </span>
            </div>

            {/* Quick Trust badges / Hotline */}
            <div className="hidden md:flex items-center gap-5 text-slate-300 text-[11px] shrink-0">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>Doorstep Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Paystack Verified</span>
              </div>
              <a
                href="tel:+2348031234567"
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+234 803 123 4567</span>
              </a>
              <button
                onClick={() => setAnnouncementDismissed(true)}
                className="text-slate-400 hover:text-white transition-colors p-0.5 cursor-pointer"
                aria-label="Dismiss banner"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HEADER: Pure White Background (#FFFFFF) */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Left: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo: Frankman Furnitures */}
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
              title="Frankman Furnitures Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#0F172A] text-amber-500 flex items-center justify-center font-bold text-lg shadow-xs group-hover:bg-slate-800 transition-colors">
                <span>F</span>
              </div>
              <div>
                <span className="block font-bold text-lg sm:text-xl tracking-tight text-[#0F172A] leading-tight">
                  Frankman <span className="text-amber-600 font-extrabold">Furnitures</span>
                </span>
                <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                  Luxury Living &amp; Electronics
                </span>
              </div>
            </button>
          </div>

          {/* Center: Prominent Wide Search Bar with Warm Amber Button */}
          <div className="hidden lg:flex flex-1 max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="w-full flex items-center">
              <div className="relative w-full flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modern sofas, dining tables, ergonomic chairs, TVs..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-2 border-slate-200 border-r-0 rounded-l-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm rounded-r-lg border-2 border-amber-600 flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Right: Account, Help, and Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => {
                  setAccountDropdownOpen(!accountDropdownOpen);
                  setHelpDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-amber-700 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold"
                aria-expanded={accountDropdownOpen}
              >
                <User className="w-5 h-5 text-slate-700" />
                <div className="hidden sm:block text-left leading-tight">
                  <span className="block text-[10px] text-slate-400 font-normal">Welcome</span>
                  <span>Account</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {accountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Frankman Customer</p>
                    <p className="text-[11px] text-slate-500">Nigeria Showroom Portal</p>
                  </div>
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Admin Workspace Portal</span>
                  </button>
                  <button
                    onClick={() => handleNav('/shop')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Browse Showroom Catalog</span>
                  </button>
                  <button
                    onClick={() => handleNav('/contact')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contact Umuahia Hub</span>
                  </button>
                </div>
              )}
            </div>

            {/* Help Dropdown */}
            <div className="relative" ref={helpRef}>
              <button
                onClick={() => {
                  setHelpDropdownOpen(!helpDropdownOpen);
                  setAccountDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 hover:text-amber-700 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold"
                aria-expanded={helpDropdownOpen}
              >
                <HelpCircle className="w-5 h-5 text-slate-700" />
                <span className="hidden sm:inline">Help</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Help Dropdown Menu */}
              {helpDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Help &amp; Customer Support</p>
                    <p className="text-[11px] text-slate-500">Showroom hours: 8:30 AM - 6:30 PM</p>
                  </div>
                  <a
                    href="https://wa.me/2348031234567?text=Hello%20Frankman%20Furnitures,%20I%20need%20assistance%20with%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Live WhatsApp Support</span>
                  </a>
                  <button
                    onClick={() => handleNav('/about')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Timber &amp; Inverter Guarantee</span>
                  </button>
                  <button
                    onClick={() => handleNav('/contact')}
                    className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Delivery Rates &amp; Schedule</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cart Icon with Floating Warm Amber Quantity Badge */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer text-xs font-bold"
              aria-label={`Shopping Cart with ${totalCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-amber-700" />
                {totalCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-150">
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Full-Width Search Bar */}
        <div className="mt-3 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, dining tables, chairs, TVs..."
                className="w-full pl-3.5 pr-8 py-2 bg-slate-50 border-2 border-slate-200 border-r-0 rounded-l-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-r-lg border-2 border-amber-600 flex items-center gap-1.5 shrink-0"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </form>
        </div>
      </div>

      {/* 3. DESKTOP MARKETPLACE CATEGORY STRIP */}
      <nav className="hidden lg:block bg-white border-b border-slate-200 text-xs font-semibold text-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleNav('/shop')}
              className="flex items-center gap-2 py-2.5 px-3 bg-slate-900 text-white rounded-t-md hover:bg-slate-800 transition-colors cursor-pointer mr-2"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>All Categories</span>
            </button>

            {categoryRibbon.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.path)}
                className={`py-2.5 px-3 hover:text-amber-600 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  item.isDeal
                    ? 'text-amber-700 font-bold'
                    : 'text-slate-700'
                }`}
              >
                {item.isDeal && <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
            <button
              onClick={() => handleNav('/about')}
              className="hover:text-slate-900 transition-colors"
            >
              About Brand
            </button>
            <span>·</span>
            <button
              onClick={() => handleNav('/contact')}
              className="hover:text-slate-900 transition-colors"
            >
              Showroom Location
            </button>
          </div>
        </div>
      </nav>

      {/* 4. MOBILE SLIDE-OUT DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header in Charcoal Navy */}
            <div className="p-4 bg-[#0F172A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                  F
                </div>
                <div>
                  <span className="font-bold text-base">Frankman Furnitures</span>
                  <span className="block text-[10px] text-slate-400">Nigeria Showroom</span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-white p-1 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Marketplace Categories
                </p>
                <div className="space-y-1">
                  {categoryRibbon.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNav(item.path)}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 hover:text-amber-700 transition-colors flex items-center justify-between"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Customer Support &amp; Portal
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => handleNav('/about')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100"
                  >
                    About Frankman
                  </button>
                  <button
                    onClick={() => handleNav('/contact')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-100"
                  >
                    Showroom Address &amp; Delivery
                  </button>
                  <button
                    onClick={() => handleNav('/admin')}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Admin Workspace Portal</span>
                  </button>
                </div>
              </div>

              {/* Contact info in Drawer */}
              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">Umuahia Showroom Hub:</p>
                <p className="text-[11px]">14 Aba Road, Umuahia, Abia State</p>
                <p className="text-[11px] text-amber-700 font-medium">Hotline: +234 803 123 4567</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
