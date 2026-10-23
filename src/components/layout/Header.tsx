import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Phone, ArrowUpRight } from 'lucide-react';
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
  announcementText = 'Discover handcrafted furniture and quality electronics in Umuahia.',
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
    { label: 'Collections', path: '/shop' },
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
    <header className="sticky top-0 z-40 bg-[#F8F7F4]/95 backdrop-blur-md transition-all">
      {/* Optional Top Announcement Bar */}
      {announcementActive && !announcementDismissed && (
        <div className="bg-[#4A5538] text-[#F3EFE6] px-4 py-1.5 text-[11px] sm:text-xs flex items-center justify-between text-center tracking-wide font-medium">
          <div className="flex-1 text-center">
            {announcementText}
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-white/80 hover:text-white p-1 ml-2 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="bg-white/90 border border-stone-200/90 rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 shadow-xs">
          {/* Left: Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`transition-colors whitespace-nowrap hover:text-stone-950 py-1 ${
                    isActive ? 'text-[#4A5538] font-bold' : ''
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle (Left on mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-800 hover:text-black rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Center: Brand Wordmark */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
          >
            <div className="w-6 h-6 rounded-full bg-[#4A5538] text-white flex items-center justify-center font-bold text-[11px]">
              F
            </div>
            <span className="font-heading font-extrabold text-sm sm:text-base tracking-widest text-[#2E3725] uppercase group-hover:text-[#4A5538] transition-colors">
              FRANKMAN
            </span>
          </button>

          {/* Right Links (Desktop) & Action Pills */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Desktop right links */}
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-stone-600 mr-1">
              {navLinks.slice(3).map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`transition-colors whitespace-nowrap hover:text-stone-950 py-1 ${
                      isActive ? 'text-[#4A5538] font-bold' : ''
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Circular Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
              aria-label="Search showroom"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Quick Link */}
            <button
              onClick={() => handleNav('/admin')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              title="Store Admin"
            >
              <Shield className="w-3.5 h-3.5 text-stone-500" />
              <span>Admin</span>
            </button>

            {/* Shopping Bag Pill Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-[#4A5538] hover:bg-[#3E482F] text-white rounded-full text-xs font-bold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0"
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
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white border border-stone-200 rounded-2xl p-2.5 flex items-center gap-3 shadow-md"
          >
            <Search className="w-4 h-4 text-stone-400 shrink-0 ml-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dining sets, modular sofas, 4K TVs, consoles in Umuahia..."
              className="flex-1 text-xs sm:text-sm bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-stone-400 text-stone-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#4A5538] text-white text-xs font-bold rounded-full hover:bg-[#3E482F] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-20 z-50 bg-white/95 backdrop-blur-lg border border-stone-200 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left text-sm font-semibold py-3 px-3 rounded-xl transition-colors ${
                  currentPath === link.path
                    ? 'bg-[#F2EFE9] text-[#4A5538] font-bold'
                    : 'text-stone-800 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/admin')}
              className="text-left text-sm font-semibold py-3 px-3 rounded-xl text-stone-600 hover:bg-stone-50 flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-stone-500" />
              <span>Admin Management</span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Umuahia, Abia State</span>
            <a
              href="tel:+2348031234567"
              className="font-semibold text-[#4A5538] flex items-center gap-1"
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
