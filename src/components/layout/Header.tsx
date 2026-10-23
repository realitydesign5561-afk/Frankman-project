import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Shield, Phone } from 'lucide-react';
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
  announcementText = 'Discover stylish furniture and quality electronics in Umuahia.',
  announcementActive = true,
}) => {
  const { getTotalCount, setDrawerOpen } = useCartStore();
  const totalCount = getTotalCount();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Shop All', path: '/shop' },
    { label: 'Furniture', path: '/shop/furniture' },
    { label: 'Electronics', path: '/shop/electronics' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
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
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Announcement Bar */}
      {announcementActive && !announcementDismissed && (
        <div className="bg-[#1C1917] text-stone-200 px-4 py-2 text-xs flex items-center justify-between text-center">
          <div className="flex-1 font-medium tracking-wide">
            {announcementText}
          </div>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-stone-400 hover:text-white p-0.5 ml-2 transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Bar: Strict 3-zone contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => handleNav('/')}
          className="text-left whitespace-nowrap shrink-0 group focus:outline-hidden"
        >
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
            Frankman Furniture & Electronics
          </span>
        </button>

        {/* Zone 2: 4-5 Clean Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-stone-950 ${
                  isActive
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : 'text-stone-600'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Search, Admin, Bag CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors rounded-lg hover:bg-stone-100"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Admin Portal Link */}
          <button
            onClick={() => handleNav('/admin')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Store Administration"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          {/* Shopping Bag Button (Primary Action) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-[#1C1917] hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide shadow-xs transition-colors whitespace-nowrap shrink-0"
            aria-label={`Shopping bag with ${totalCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-amber-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full tabular-nums">
              {totalCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Drawer */}
      {searchOpen && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 shadow-inner">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-3"
          >
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dining sets, luxury sofas, 4K TVs, refrigerators..."
              className="flex-1 text-sm bg-transparent border-0 focus:ring-0 focus:outline-none placeholder-stone-400 text-stone-900"
              autoFocus
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#1C1917] text-white text-xs font-medium rounded-md hover:bg-stone-800 transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`text-left text-base font-medium py-2 border-b border-stone-100 ${
                  currentPath === link.path ? 'text-amber-800 font-semibold' : 'text-stone-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/admin')}
              className="text-left text-sm font-medium text-stone-600 py-2 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Umuahia, Abia State</span>
            <a
              href="tel:+2348031234567"
              className="flex items-center gap-1 text-stone-800 font-medium"
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
