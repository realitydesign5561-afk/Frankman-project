import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cart-store';
import { formatNaira } from '../../lib/pricing';
import { SafeImage } from '../ui/SafeImage';

export const CartDrawer: React.FC<{ onNavigate?: (path: string) => void }> = ({ onNavigate }) => {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    getSubtotalKobo,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotalKobo = getSubtotalKobo();
  const freeThresholdKobo = 30000000; // ₦300,000
  const freeProgress = Math.min(100, Math.floor((subtotalKobo / freeThresholdKobo) * 100));
  const remainingForFree = Math.max(0, freeThresholdKobo - subtotalKobo);

  const handleLinkClick = (url: string) => {
    setDrawerOpen(false);
    if (onNavigate) {
      onNavigate(url);
    } else {
      window.location.href = url;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free delivery tier tracker */}
          <div className="bg-[#FAF9F5] px-6 py-3 border-b border-stone-200 text-xs text-stone-600">
            {subtotalKobo >= freeThresholdKobo ? (
              <p className="text-emerald-700 font-medium">
                ✓ You qualify for Free Showroom Delivery in Umuahia!
              </p>
            ) : (
              <p>
                Add{' '}
                <span className="font-semibold text-stone-800">
                  {formatNaira(remainingForFree)}
                </span>{' '}
                more for free delivery in Umuahia.
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-700 h-full transition-all duration-300"
                style={{ width: `${freeProgress}%` }}
              />
            </div>
          </div>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-serif text-base font-semibold text-stone-800 mb-1">
                  Your bag is currently empty
                </h4>
                <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
                  Discover refined furniture and top-tier electronics for your living space in Umuahia.
                </p>
                <button
                  onClick={() => handleLinkClick('/shop')}
                  className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition-colors"
                >
                  Explore Showroom
                </button>
              </div>
            ) : (
              items.map((item) => {
                const itemKey = `${item.productId}__${item.variationId || 'default'}`;
                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 pb-4 border-b border-stone-100 last:border-0"
                  >
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-stone-100 shrink-0">
                      <SafeImage
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => handleLinkClick(`/product/${item.slug}`)}
                            className="font-medium text-sm text-stone-900 hover:text-amber-800 text-left line-clamp-1 transition-colors"
                          >
                            {item.productName}
                          </button>
                          <button
                            onClick={() => removeItem(itemKey)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-0.5"
                            aria-label={`Remove ${item.productName}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.variationName && (
                          <p className="text-xs text-stone-500 mt-0.5">
                            {item.variationName}
                          </p>
                        )}
                        <p className="text-xs font-semibold text-stone-800 mt-1 tabular-nums">
                          {formatNaira(item.unitPriceKobo)}
                        </p>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold text-stone-800 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                            disabled={item.quantity >= item.stockAvailable}
                            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-xs font-medium text-stone-500 tabular-nums">
                          Total: {formatNaira(item.unitPriceKobo * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer actions */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#FAF9F5] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600 font-medium">Subtotal</span>
                <span className="font-extrabold text-stone-900 text-lg tabular-nums">
                  {formatNaira(subtotalKobo)}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Paystack cards, transfer, and discounts calculated at checkout.
              </p>

              <button
                onClick={() => handleLinkClick('/checkout')}
                className="w-full py-3.5 bg-[#4A5538] hover:bg-[#3D472D] text-white rounded-full text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-colors min-h-[46px]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLinkClick('/cart')}
                className="w-full py-2.5 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 rounded-full text-xs font-bold transition-colors min-h-[42px]"
              >
                View Full Bag Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
