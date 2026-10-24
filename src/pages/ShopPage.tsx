import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Search, X, RotateCcw } from 'lucide-react';
import { clientStore } from '../lib/client-store';

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
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        setProducts(list);
      })
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 bg-[#FAF8F5]">
      {/* Title & Collection Banner */}
      <div className="border-b border-[#EAE5DC] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
            Frankman Showroom Catalog
          </span>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-stone-900 mt-1">
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

        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => {
              setSelectedCategory('all');
              onNavigate('/shop');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#B58235] text-white shadow-xs'
                : 'bg-white border border-[#EAE5DC] text-stone-700 hover:border-stone-400'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => {
              setSelectedCategory('furniture');
              onNavigate('/shop/furniture');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
              selectedCategory === 'furniture'
                ? 'bg-[#B58235] text-white shadow-xs'
                : 'bg-white border border-[#EAE5DC] text-stone-700 hover:border-stone-400'
            }`}
          >
            Furniture
          </button>
          <button
            onClick={() => {
              setSelectedCategory('electronics');
              onNavigate('/shop/electronics');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
              selectedCategory === 'electronics'
                ? 'bg-[#B58235] text-white shadow-xs'
                : 'bg-white border border-[#EAE5DC] text-stone-700 hover:border-stone-400'
            }`}
          >
            Electronics
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EAE5DC] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, finish, or specs..."
            className="w-full text-xs sm:text-sm bg-[#FAF8F5] border border-[#EAE5DC] rounded-full pl-9 pr-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-none focus:border-[#B58235] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
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
              className="rounded-md border-stone-300 text-[#B58235] focus:ring-[#B58235] h-4 w-4"
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
              className="bg-[#FAF8F5] border border-[#EAE5DC] rounded-full px-3 py-1.5 text-stone-900 focus:outline-none focus:border-[#B58235] font-medium cursor-pointer"
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
              className="text-[#B58235] hover:text-[#9E6F2B] font-semibold flex items-center gap-1 transition-colors px-2 py-1 cursor-pointer"
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
              className="h-96 rounded-3xl bg-stone-100 animate-pulse border border-[#EAE5DC]"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE5DC] p-8 space-y-3">
          <h3 className="font-heading text-lg font-bold text-stone-900">
            No products match your current filters
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting keywords or selecting another collection.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-[#B58235] text-white text-xs font-semibold rounded-full hover:bg-[#9E6F2B] transition-colors cursor-pointer"
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
