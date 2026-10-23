import React, { useEffect, useState } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Search, X, RotateCcw } from 'lucide-react';
import { formatNaira } from '../lib/pricing';

interface ShopPageProps {
  initialCategory?: 'furniture' | 'electronics';
  onNavigate: (path: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialCategory, onNavigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [maxPriceNaira, setMaxPriceNaira] = useState<number>(1000000);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Title & Collection Banner */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-[#4A5538]">
            Frankman Showroom Catalog
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-stone-900 mt-1">
            {selectedCategory === 'furniture'
              ? 'Furniture Collection'
              : selectedCategory === 'electronics'
              ? 'Electronics Collection'
              : 'All Showroom Products'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Handcrafted pieces and home electronics available in Umuahia, Abia State.
          </p>
        </div>

        {/* Category Pill Tabs (Exact screenshot styling) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setSelectedCategory('all');
              onNavigate('/shop');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
              selectedCategory === 'all'
                ? 'bg-[#4A5538] text-white shadow-xs'
                : 'bg-[#EDE9E1] text-stone-700 hover:bg-[#E2DDD3]'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setSelectedCategory('furniture');
              onNavigate('/shop/furniture');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
              selectedCategory === 'furniture'
                ? 'bg-[#4A5538] text-white shadow-xs'
                : 'bg-[#EDE9E1] text-stone-700 hover:bg-[#E2DDD3]'
            }`}
          >
            Furniture
          </button>
          <button
            onClick={() => {
              setSelectedCategory('electronics');
              onNavigate('/shop/electronics');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
              selectedCategory === 'electronics'
                ? 'bg-[#4A5538] text-white shadow-xs'
                : 'bg-[#EDE9E1] text-stone-700 hover:bg-[#E2DDD3]'
            }`}
          >
            Electronics
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, finish, or specs..."
            className="w-full text-xs sm:text-sm bg-[#FAF9F5] border border-stone-200 rounded-full pl-9 pr-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-none focus:border-[#4A5538]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Controls: Sort & In-Stock */}
        <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded-md border-stone-300 text-[#4A5538] focus:ring-[#4A5538] h-4 w-4"
            />
            <span>In Stock Only</span>
          </label>

          <span className="text-stone-300 hidden sm:inline">|</span>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-stone-600">
            <span className="font-semibold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF9F5] border border-stone-200 rounded-full px-3 py-1.5 text-stone-900 focus:outline-none focus:border-[#4A5538] font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#4A5538] hover:text-[#38432A] font-bold flex items-center gap-1 transition-colors px-2 py-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-stone-500 font-medium">
        Showing <span className="font-bold text-stone-900">{products.length}</span> pieces
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-96 rounded-[28px] bg-stone-100 animate-pulse border border-stone-200"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
          <h3 className="font-heading text-lg font-bold text-stone-900">
            No products match your current filters
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting keywords or selecting another collection.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#4A5538] text-white text-xs font-bold rounded-full hover:bg-[#3D472D] transition-colors"
          >
            Clear Filters
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
