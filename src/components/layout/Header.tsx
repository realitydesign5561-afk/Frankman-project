import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
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
  announcementText = 'Handcrafted furniture & smart inverter electronics in Nigeria. Pay securely with Paystack.',
  announcementActive = true,
}) => {
  const { getTotalCount, setDrawerOpen } = useCartStore();
  const totalCount = getTotalCount();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Furniture', path: '/shop/furniture' },
    { label: 'Electronics', path: '/shop/electronics' },
    { label: 'About Us', path: '/about' },
    { label: 'Showroom', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    onNavigate(path);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNav(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE5DC]/80 transition-all">
      {/* Top Announcement Bar */}
      {announcementActive && !announcementDismissed && (
        <div className="bg-[#B58235] text-white px-4 py-1.5 text-[11px] sm:text-xs flex items-center justify-between text-center tracking-wide font-medium">
          <div className="flex-1 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>{announcementText}</span>
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-1 ml-2 transition-colors cursor-pointer"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-6">
          {/* Left: Mobile Menu Toggle + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo & Wordmark matching Névo style */}
            <button
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group cursor-pointer text-left"
            >
              {/* Organic furniture leaf emblem */}
              <div className="w-8 h-8 rounded-full bg-[#B58235] text-white flex items-center justify-center shadow-xs group-hover:bg-[#9E6F2B] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
              </div>
              <span className="font-heading font-bold text-lg sm:text-xl tracking-tight text-stone-900 group-hover:text-[#B58235] transition-colors">
                Frankman
              </span>
            </button>
          </div>

          {/* Center: Clean Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-stone-600">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`transition-colors whitespace-nowrap hover:text-stone-950 py-1 cursor-pointer ${
                    isActive ? 'text-[#B58235] font-bold' : ''
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Shopping Bag Pill */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full bg-white border border-[#EAE5DC] hover:border-stone-400 text-stone-700 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Search showroom"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Portal Link */}
            <button
              onClick={() => handleNav('/admin')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span>Admin</span>
            </button>

            {/* Shopping Bag Pill Button in Warm Gold */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              aria-label={`Shopping bag with ${totalCount} items`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums font-bold">
                {totalCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="max-w-4xl mx-auto px-4 pb-3 animate-in fade-in slide-in-from-top-1">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-[#EAE5DC] rounded-2xl p-2.5 flex items-center gap-3 shadow-md"
          >
            <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dining suites, modular sofas, 4K TVs, consoles in Umuahia..."
              className="flex-1 text-xs sm:text-sm bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-stone-400 text-stone-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#B58235] text-white text-xs font-semibold rounded-full hover:bg-[#9E6F2B] transition-colors cursor-pointer"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 z-50 bg-white/95 backdrop-blur-lg border border-[#EAE5DC] rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left text-sm font-semibold py-3 px-3 rounded-xl transition-colors cursor-pointer ${
                  currentPath === link.path
                    ? 'bg-[#FDF8EE] text-[#B58235] font-bold'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/admin')}
              className="text-left text-sm font-semibold py-3 px-3 rounded-xl text-stone-600 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-stone-500" />
              <span>Admin Management</span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Umuahia, Abia State</span>
            <a
              href="tel:+2348031234567"
              className="font-semibold text-[#B58235] flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
