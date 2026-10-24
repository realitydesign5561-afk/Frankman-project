import React, { useEffect, useState } from 'react';
import { Product, ProductVariation } from '../types';
import { SafeImage } from '../components/ui/SafeImage';
import { formatNaira, calculateVariationPrice } from '../lib/pricing';
import { useCartStore } from '../store/cart-store';
import { WhatsAppButton } from '../components/support/WhatsAppButton';
import { clientStore } from '../lib/client-store';
import {
  ShoppingBag,
  Truck,
  ShieldCheck,
  Check,
  ChevronRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  slug,
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const { addItem, setDrawerOpen } = useCartStore();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found on server');
        return res.json();
      })
      .then((data: Product) => {
        setProduct(data);
        if (data.variations && data.variations.length > 0) {
          const firstActive = data.variations.find((v) => v.isActive) || data.variations[0];
          setSelectedVariation(firstActive);
        }
      })
      .catch(() => {
        const fallback = clientStore.getProductBySlug(slug);
        setProduct(fallback);
        if (fallback?.variations && fallback.variations.length > 0) {
          const firstActive = fallback.variations.find((v) => v.isActive) || fallback.variations[0];
          setSelectedVariation(firstActive);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-pulse">
          <div className="lg:col-span-7 bg-stone-200 h-[480px] rounded-2xl" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="h-8 bg-stone-200 rounded w-1/2" />
            <div className="h-24 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Product Not Found
        </h2>
        <p className="text-xs text-stone-500">
          The requested showroom item may have been archived or is no longer listed in our catalog.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
        >
          Return to Showroom Catalog
        </button>
      </div>
    );
  }

  // Calculate dynamic price
  const activeAdditionalKobo = selectedVariation ? selectedVariation.additionalPriceKobo : 0;
  const currentPriceKobo = calculateVariationPrice(
    product.basePriceKobo,
    activeAdditionalKobo
  );

  const imagesList = React.useMemo(() => {
    const list = [...(product.images || [])];
    if (selectedVariation?.image && !list.includes(selectedVariation.image)) {
      list.unshift(selectedVariation.image);
    }
    return list.length > 0
      ? list
      : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'];
  }, [product.images, selectedVariation?.image]);

  const displayedImage = imagesList[activeImageIndex] || imagesList[0];

  const availableStock = selectedVariation ? selectedVariation.stockCount : 10;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      productId: product.id,
      variationId: selectedVariation?.id || null,
      productName: product.name,
      variationName: selectedVariation?.name || null,
      sku: selectedVariation?.sku || product.sku,
      unitPriceKobo: currentPriceKobo,
      image: selectedVariation?.image || imagesList[0],
      stockAvailable: availableStock,
      slug: product.slug,
    }, quantity);

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappInquiryMessage = `Hello Frankman Furniture & Electronics, I am inquiring about the "${product.name}"${
    selectedVariation ? ` (Variation: ${selectedVariation.name})` : ''
  } priced at ${formatNaira(currentPriceKobo)}. Catalog link: ${currentUrl}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <button
          onClick={() => onNavigate('/')}
          className="hover:text-stone-900 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <button
          onClick={() => onNavigate('/shop')}
          className="hover:text-stone-900 transition-colors"
        >
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <button
          onClick={() => onNavigate(`/shop/${product.category?.slug || 'furniture'}`)}
          className="hover:text-stone-900 transition-colors capitalize"
        >
          {product.category?.name || 'Showroom'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
        <span className="text-stone-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#F5F3EF] border border-stone-200">
            <SafeImage
              src={displayedImage}
              alt={product.name}
              fallbackCategory={product.categoryId === 'cat-electronics' ? 'electronics' : 'furniture'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-stone-900 shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <SafeImage
                    src={imgUrl}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-xs">
          {/* Category & Title */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span className="uppercase tracking-wider font-medium text-stone-600">
                {product.category?.name || 'Showroom Collection'}
              </span>
              <span className="font-mono text-stone-400">SKU: {selectedVariation?.sku || product.sku}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {product.name}
            </h1>
          </div>

          {/* Dynamic Price Display */}
          <div className="py-2 border-y border-stone-100 flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-stone-950 tabular-nums">
                {formatNaira(currentPriceKobo)}
              </span>
              {activeAdditionalKobo > 0 && (
                <span className="text-xs text-stone-500 ml-2">
                  (Includes {formatNaira(activeAdditionalKobo)} variation upgrade)
                </span>
              )}
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                isOutOfStock
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-emerald-50 text-emerald-800'
              }`}
            >
              {isOutOfStock ? 'Sold Out' : `In Stock (${availableStock} available)`}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Product Variations / Color Shades Selector */}
          {product.variations && product.variations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  {product.variations.some((v) => v.attributes?.colorHex || v.attributes?.color)
                    ? 'Available Color Shades & Finishes:'
                    : 'Select Option / Variation:'}
                </label>
                {selectedVariation && (
                  <span className="text-xs text-[#B58235] font-semibold">
                    {selectedVariation.name}
                  </span>
                )}
              </div>

              {/* Visual Circular Color Swatches if variations have colorHex */}
              {product.variations.some((v) => v.attributes?.colorHex) && (
                <div className="flex items-center gap-2 flex-wrap pt-0.5 pb-1">
                  {product.variations.map((v) => {
                    const isSelected = selectedVariation?.id === v.id;
                    const hex = v.attributes?.colorHex || '#D97706';
                    return (
                      <button
                        key={`swatch-${v.id}`}
                        type="button"
                        onClick={() => {
                          setSelectedVariation(v);
                          setActiveImageIndex(0);
                        }}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-600/40 text-slate-900 font-semibold shadow-2xs'
                            : 'border-slate-200 bg-white hover:border-slate-400 text-slate-700'
                        }`}
                        title={`${v.name} (${hex})`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/15 shadow-2xs shrink-0"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="text-[11px] truncate max-w-[130px]">{v.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-amber-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Variation Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variations.map((v) => {
                  const isSelected = selectedVariation?.id === v.id;
                  const varPriceKobo = calculateVariationPrice(
                    product.basePriceKobo,
                    v.additionalPriceKobo
                  );
                  const hex = v.attributes?.colorHex;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariation(v);
                        setActiveImageIndex(0);
                      }}
                      className={`text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/60 ring-1.5 ring-amber-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-2 truncate">
                          {hex && (
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0 shadow-2xs"
                              style={{ backgroundColor: hex }}
                            />
                          )}
                          <span className="truncate">{v.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1 tabular-nums font-medium">
                        {formatNaira(varPriceKobo)}
                        {v.additionalPriceKobo > 0 && (
                          <span className="text-[10px] text-amber-600 ml-1.5 font-semibold">
                            (+{formatNaira(v.additionalPriceKobo)})
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                        <span>Stock: {v.stockCount} units</span>
                        {v.image && (
                          <span className="text-[10px] text-amber-600 font-medium">Shade Photo</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 min-h-[46px]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900 transition-colors font-bold text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                  disabled={quantity >= availableStock}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors font-bold text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3 px-5 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-xs font-semibold tracking-wide rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all min-h-[46px] cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Shopping Bag'}</span>
              </button>
            </div>

            {/* Instant Checkout with Paystack CTA */}
            <button
              onClick={() => {
                handleAddToCart();
                onNavigate('/checkout');
              }}
              disabled={isOutOfStock}
              className="w-full py-3 px-5 bg-[#0F172A] hover:bg-slate-800 text-white disabled:bg-slate-200 disabled:text-slate-400 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 min-h-[46px] cursor-pointer shadow-xs"
            >
              <span>Instant Paystack Checkout</span>
            </button>

            {/* Quick WhatsApp Inquiry */}
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              message={whatsappInquiryMessage}
              label="Inquire via WhatsApp (Showroom Desk)"
              variant="outline"
              className="w-full py-2.5 rounded-lg min-h-[44px]"
            />
          </div>

          {/* Added to Bag Feedback */}
          {addedToast && (
            <div className="p-3 bg-[#EBF3E8] border border-[#CDE1C7] text-[#334626] rounded-2xl text-xs flex items-center justify-between animate-in fade-in">
              <span>Added to your bag!</span>
              <button
                onClick={() => setDrawerOpen(true)}
                className="font-bold underline text-[#27371D]"
              >
                Open Bag &rarr;
              </button>
            </div>
          )}

          {/* Local Showroom Trust Notes */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Direct delivery in Umuahia and across Abia State.</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Inspection guarantee upon showroom collection or delivery.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Specifications Section */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="pt-8 border-t border-stone-200">
          <h3 className="font-serif text-xl font-bold text-stone-900 mb-4">
            Technical & Design Specifications
          </h3>
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="grid grid-cols-1 sm:grid-cols-3 p-3.5">
                <span className="font-semibold text-stone-800 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="sm:col-span-2 text-stone-600">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
