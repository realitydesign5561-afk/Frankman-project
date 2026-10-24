import React from 'react';
import { Product } from '../../types';
import { formatNaira } from '../../lib/pricing';
import { SafeImage } from '../ui/SafeImage';
import { useCartStore } from '../../store/cart-store';
import { ShoppingBag, ArrowUpRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addItem } = useCartStore();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

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
      className="group relative rounded-3xl overflow-hidden bg-white border border-[#EAE5DC] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Frame */}
      <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden">
        <SafeImage
          src={primaryImage}
          alt={product.name}
          fallbackCategory={product.categoryId === 'cat-electronics' ? 'electronics' : 'furniture'}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Circular Arrow Action on Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <div className="w-8 h-8 rounded-full bg-white/95 text-stone-800 shadow-2xs flex items-center justify-center group-hover:bg-[#B58235] group-hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#B58235] mb-1">
            <span>{product.category?.name || 'Showroom Piece'}</span>
            {activeVariations.length > 1 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-stone-400 font-normal">{activeVariations.length} Options</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className={isOutOfStock ? 'text-rose-600 font-bold' : 'text-stone-500 font-normal'}>
              {isOutOfStock ? 'Sold Out' : 'In Stock'}
            </span>
          </div>

          <h3 className="font-heading text-base font-bold text-stone-900 group-hover:text-[#B58235] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.shortDescription && (
            <p className="text-xs text-stone-500 line-clamp-1 mt-1">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price and Add button */}
        <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-medium block">
              {activeVariations.length > 1 ? 'From' : 'Price'}
            </span>
            <span className="text-base font-bold text-stone-900 tabular-nums">
              {formatNaira(product.basePriceKobo)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="px-4 py-1.5 bg-[#FDF8EE] hover:bg-[#B58235] hover:text-white disabled:bg-stone-200 text-[#B58235] border border-[#EBD8B8] text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
