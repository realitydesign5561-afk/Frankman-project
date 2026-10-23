import React, { useEffect, useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { formatNaira } from '../lib/pricing';

interface ShopPageProps {
  initialCategory?: 'furniture' | 'electronics';
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [maxPriceNaira, setMaxPriceNaira] = useState<number>(1000000); // ₦1,000,000 max slider
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync with initialCategory prop
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Fetch categories once
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Fetch products based on active filters
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
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, sortBy, maxPriceNaira, inStockOnly]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPriceNaira(1000000);
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured' ||
    maxPriceNaira < 1000000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Collection Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Frankman Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
            {selectedCategory === 'furniture'
              ? 'Furniture Collection'
              : selectedCategory === 'electronics'
              ? 'Electronics Collection'
              : 'All Showroom Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Carefully curated items available for inspection and direct delivery in Umuahia, Abia State.
          </p>
        </div>

        {/* Category Tabs (Segmented Button Controls) */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg shrink-0">
          <button
            onClick={() => {
              setSelectedCategory('all');
              onNavigate('/shop');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setSelectedCategory('furniture');
              onNavigate('/shop/furniture');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'furniture'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Furniture
          </button>
          <button
            onClick={() => {
              setSelectedCategory('electronics');
              onNavigate('/shop/electronics');
            }}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all ${
              selectedCategory === 'electronics'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Electronics
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, spec, or SKU..."
            className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:border-stone-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Desktop Controls: Sort & In-Stock */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-stone-300 text-stone-900 focus:ring-stone-900 h-4 w-4"
            />
            <span>In Stock Only</span>
          </label>

          <span className="text-stone-300">|</span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className="shrink-0 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-900 focus:outline-none focus:border-stone-800 font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-amber-800 hover:text-amber-950 font-medium flex items-center gap-1 transition-colors px-2 py-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Results Summary */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <span className="font-semibold text-stone-900">{products.length}</span>{' '}
          {products.length === 1 ? 'product' : 'products'}
        </span>
        {maxPriceNaira < 1000000 && (
          <span>Under {formatNaira(maxPriceNaira * 100)}</span>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-xl bg-stone-100 animate-pulse border border-stone-200"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200 p-8">
          <h3 className="font-serif text-lg font-bold text-stone-900 mb-2">
            No products match your current filters
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Try clearing search keywords, adjusting your price limit, or viewing all products.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};
