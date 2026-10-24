import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Search, X, RotateCcw, Filter, Flame } from 'lucide-react';
import { clientStore } from '../lib/client-store';

interface ShopPageProps {
  initialCategory?: string;
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Check URL search params for category / search / deals
  const getUrlParams = () => {
    if (typeof window === 'undefined') return { category: 'all', search: '', deals: false };
    const params = new URLSearchParams(window.location.search);
    return {
      category: params.get('category') || initialCategory || 'all',
      search: params.get('search') || '',
      deals: params.get('deals') === 'true',
    };
  };

  const initialParams = getUrlParams();

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams.category);
  const [searchQuery, setSearchQuery] = useState(initialParams.search);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [maxPriceNaira, setMaxPriceNaira] = useState<number>(1000000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(initialParams.deals);

  useEffect(() => {
    const current = getUrlParams();
    setSelectedCategory(current.category);
    if (current.search) setSearchQuery(current.search);
    if (current.deals) setDealsOnly(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (sortBy) {
      params.set('sortBy', sortBy);
    }
    if (maxPriceNaira < 1000000) {
      params.set('maxPrice', (maxPriceNaira * 100).toString());
    }
    if (inStockOnly) {
      params.set('inStock', 'true');
    }

    fetch(`/api/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('API non-200');
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          throw new Error('No products in response');
        }
      })
      .catch(() => {
        // Fallback to clientStore
        let list = clientStore.getProducts();

        if (selectedCategory === 'furniture') {
          list = list.filter((p) => p.categoryId === 'cat-furniture');
        } else if (selectedCategory === 'electronics') {
          list = list.filter((p) => p.categoryId === 'cat-electronics');
        } else if (selectedCategory === 'living') {
          list = list.filter((p) => p.slug.includes('sofa') || p.slug.includes('chair') || p.slug.includes('lounge'));
        } else if (selectedCategory === 'dining') {
          list = list.filter((p) => p.slug.includes('dining'));
        } else if (selectedCategory === 'bedroom') {
          list = list.filter((p) => p.slug.includes('bed'));
        } else if (selectedCategory === 'office') {
          list = list.filter((p) => p.slug.includes('office') || p.slug.includes('chair'));
        } else if (selectedCategory === 'consoles') {
          list = list.filter((p) => p.slug.includes('console'));
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q) ||
              (p.shortDescription && p.shortDescription.toLowerCase().includes(q))
          );
        }

        if (inStockOnly) {
          list = list.filter((p) => p.variations.some((v) => v.stockCount > 0));
        }

        if (sortBy === 'price-asc') {
          list.sort((a, b) => a.basePriceKobo - b.basePriceKobo);
        } else if (sortBy === 'price-desc') {
          list.sort((a, b) => b.basePriceKobo - a.basePriceKobo);
        }

        setProducts(list);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, sortBy, maxPriceNaira, inStockOnly, dealsOnly]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPriceNaira(1000000);
    setInStockOnly(false);
    setDealsOnly(false);
  };

  const categoryTabs = [
    { id: 'all', label: 'All Catalog' },
    { id: 'living', label: 'Living Room' },
    { id: 'dining', label: 'Dining Sets' },
    { id: 'bedroom', label: 'Bedroom' },
    { id: 'office', label: 'Office' },
    { id: 'consoles', label: 'TV Consoles' },
    { id: 'electronics', label: 'Electronics' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 bg-[#F8FAFC]">
      {/* Page Title & Breadcrumb */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600">
            Showroom Marketplace
          </span>
          <h1 className="font-bold text-2xl sm:text-3xl text-[#0F172A] mt-1">
            {selectedCategory === 'living'
              ? 'Living Room & Sofas'
              : selectedCategory === 'dining'
              ? 'Solid Timber Dining Suites'
              : selectedCategory === 'bedroom'
              ? 'Bedroom Furniture & Bedframes'
              : selectedCategory === 'office'
              ? 'Executive Office & Workspaces'
              : selectedCategory === 'consoles'
              ? 'Acoustic TV & Media Consoles'
              : selectedCategory === 'electronics'
              ? 'Smart Home Electronics'
              : 'Showroom Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Direct delivery to residences &amp; corporate offices across Nigeria. Paystack verified.
          </p>
        </div>

        {/* Quick Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200/90 p-3.5 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by piece, wood, finish, or specs..."
            className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md pl-9 pr-8 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-amber-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Controls: In-Stock, Sort, Reset */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs">
          <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 h-4 w-4"
            />
            <span>In Stock Only</span>
          </label>

          <span className="text-slate-200 hidden sm:inline">|</span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-semibold text-slate-700">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-900 focus:outline-none focus:border-amber-600 font-medium cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {(selectedCategory !== 'all' || searchQuery || inStockOnly) && (
            <button
              onClick={resetFilters}
              className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 transition-colors px-2 py-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="text-xs text-slate-500 font-medium px-1">
        Showing <span className="font-bold text-slate-900">{products.length}</span> pieces
      </div>

      {/* Product Grid: 2 columns on mobile, 4 on desktop */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-4/5 rounded-lg bg-slate-200 animate-pulse"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-slate-200 p-8 space-y-3">
          <h3 className="font-bold text-lg text-slate-900">
            No products match your current selection
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or selecting another room category.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-amber-600 text-white text-xs font-semibold rounded-md hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              discountPercent={15}
            />
          ))}
        </div>
      )}
    </div>
  );
};
