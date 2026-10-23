import React from 'react';
import { Product } from '../../types';
import { formatNaira } from '../../lib/pricing';
import { SafeImage } from '../ui/SafeImage';
import { useCartStore } from '../../store/cart-store';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useCartStore();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

  const activeVariations = product.variations.filter((v) => v.isActive);
  const totalStock = activeVariations.reduce((acc, v) => acc + v.stockCount, 0);
  const isOutOfStock = totalStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const firstVariation = activeVariations[0];
    const unitPriceKobo = product.basePriceKobo + (firstVariation?.additionalPriceKobo || 0);

    addItem({
      productId: product.id,
      variationId: firstVariation?.id || null,
      productName: product.name,
      variationName: firstVariation?.name || null,
      sku: firstVariation?.sku || product.sku,
      unitPriceKobo,
      image: firstVariation?.image || primaryImage,
      stockAvailable: firstVariation?.stockCount || totalStock,
      slug: product.slug,
    });
  };

  return (
    <div
      onClick={() => onNavigate(`/product/${product.slug}`)}
      className="group flex flex-col bg-white rounded-lg border border-stone-200/80 overflow-hidden cursor-pointer hover:border-stone-400 hover:shadow-md transition-all duration-200"
    >
      {/* 65%-70% Height Product Visual Frame */}
      <div className="relative aspect-4/3 w-full bg-[#F5F3EF] overflow-hidden">
        <SafeImage
          src={primaryImage}
          alt={product.name}
          fallbackCategory={product.categoryId === 'cat-electronics' ? 'electronics' : 'furniture'}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
        />

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex justify-end">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="px-3.5 py-2 bg-[#1C1917]/90 hover:bg-[#1C1917] disabled:bg-stone-400 text-white text-xs font-medium rounded-md shadow-md backdrop-blur-xs flex items-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Clean Unboxed Metadata without pills */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-1">
            <span className="uppercase tracking-wider font-medium text-stone-600">
              {product.category?.name || (product.categoryId === 'cat-electronics' ? 'Electronics' : 'Furniture')}
            </span>
            {activeVariations.length > 1 && (
              <>
                <span aria-hidden="true">·</span>
                <span>{activeVariations.length} Options</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className={isOutOfStock ? 'text-rose-600 font-medium' : 'text-stone-500'}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>

          <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action baseline */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-100">
          <div>
            <span className="text-xs text-stone-400 block -mb-0.5">
              {activeVariations.length > 1 ? 'From' : 'Price'}
            </span>
            <span className="text-base font-semibold text-stone-900 tabular-nums">
              {formatNaira(product.basePriceKobo)}
            </span>
          </div>

          <span className="text-xs font-medium text-amber-800 group-hover:underline">
            View Details &rarr;
          </span>
        </div>
      </div>
    </div>
  );
};
