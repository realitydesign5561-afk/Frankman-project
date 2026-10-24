import React from 'react';
import { Product } from '../../types';
import { formatNaira } from '../../lib/pricing';
import { SafeImage } from '../ui/SafeImage';
import { useCartStore } from '../../store/cart-store';
import { ShoppingBag, Star, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
  discountPercent?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNavigate,
  discountPercent = 15,
}) => {
  const { addItem } = useCartStore();
  const [justAdded, setJustAdded] = React.useState(false);

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';

  const activeVariations = product.variations.filter((v) => v.isActive);
  const colorShades = activeVariations
    .filter((v) => v.attributes?.colorHex)
    .map((v) => ({ name: v.name, hex: v.attributes.colorHex as string }));

  const totalStock = activeVariations.reduce((acc, v) => acc + v.stockCount, 0);
  const isOutOfStock = totalStock <= 0;

  // Calculate strikethrough original price (15% higher)
  const originalPriceKobo = Math.round(product.basePriceKobo * (1 + discountPercent / 100));

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

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onNavigate(`/product/${product.slug}`)}
      className="group relative bg-white rounded-lg border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden"
    >
      {/* Top Image Container (Square Ratio) */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden flex items-center justify-center p-3">
        <SafeImage
          src={primaryImage}
          alt={product.name}
          fallbackCategory={product.categoryId === 'cat-electronics' ? 'electronics' : 'furniture'}
          className="w-full h-full object-cover rounded-md group-hover:scale-104 transition-transform duration-500 ease-out"
        />

        {/* Small Warm Amber Pill Discount Badge */}
        <span className="absolute top-2.5 right-2.5 z-10 bg-amber-600 text-white text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-tight">
          -{discountPercent}%
        </span>

        {/* Stock / Fast Dispatch Badge on Left */}
        {totalStock > 0 && totalStock <= 5 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold px-2 py-0.5 rounded">
            Only {totalStock} left
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Category kicker & rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="uppercase tracking-wider font-medium text-amber-700 truncate max-w-[120px]">
              {product.category?.name || 'Furniture'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-slate-700 text-[11px]">4.9</span>
            </div>
          </div>

          {/* Product Title: 2 lines max, truncated, dark Charcoal text */}
          <h3 className="text-sm font-medium text-slate-800 line-clamp-2 leading-snug group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {/* Pricing: Current bold black text, Previous muted strikethrough */}
          <div className="pt-1">
            <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums leading-tight">
              {formatNaira(product.basePriceKobo)}
            </div>
            <div className="text-[11px] text-slate-400 line-through tabular-nums mt-0.5">
              {formatNaira(originalPriceKobo)}
            </div>
          </div>

          {/* Available Color Shades Swatches if configured */}
          {colorShades.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Finishes:</span>
              <div className="flex items-center gap-1">
                {colorShades.slice(0, 4).map((shade, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-full border border-black/15 shadow-2xs shrink-0"
                    style={{ backgroundColor: shade.hex }}
                    title={shade.name}
                  />
                ))}
              </div>
              {colorShades.length > 4 && (
                <span className="text-[10px] text-amber-600 font-bold">
                  +{colorShades.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Add to Cart: Full-width Warm Amber button at the bottom */}
        <div className="pt-3 mt-3 border-t border-slate-100">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`w-full py-2 px-3 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Cart</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
