import React, { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { formatNaira, calculateOrderTotal } from '../lib/pricing';
import { SafeImage } from '../components/ui/SafeImage';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    appliedDiscount,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscount,
    getSubtotalKobo,
  } = useCartStore();

  const [discountInput, setDiscountInput] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState('');

  const subtotalKobo = getSubtotalKobo();
  const freeShippingThresholdKobo = 30000000; // ₦300,000
  const deliveryFeeKobo = subtotalKobo >= freeShippingThresholdKobo ? 0 : 1500000; // ₦15,000

  // Server-verified discount amount
  const discountAmountKobo = appliedDiscount
    ? Math.floor((subtotalKobo * appliedDiscount.percentage) / 100)
    : 0;

  const totals = calculateOrderTotal(
    subtotalKobo,
    discountAmountKobo,
    deliveryFeeKobo
  );

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountError('');
    if (!discountInput.trim()) return;

    setDiscountLoading(true);
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountInput.trim().toUpperCase(),
          subtotalKobo,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.valid) {
        setDiscountError(data.message || data.error || 'Invalid discount code');
      } else {
        applyDiscount({
          code: data.discountCode.code,
          percentage: data.discountPercentage,
          amountKobo: data.discountAmountKobo,
          message: data.message,
        });
        setDiscountInput('');
      }
    } catch (err: any) {
      setDiscountError('Unable to validate discount code right now.');
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    applyDiscount(null);
    setDiscountError('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Explore our living room furniture, dining sets, 4K smart TVs, and inverter appliances in Umuahia.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="mt-4 px-6 py-3 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors inline-flex items-center gap-2"
        >
          <span>Explore Showroom Collections</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-4 flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review your selected furniture pieces and electronics before checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100 shadow-xs">
          {items.map((item) => {
            const itemKey = `${item.productId}__${item.variationId || 'default'}`;
            return (
              <div key={itemKey} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <SafeImage
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => onNavigate(`/product/${item.slug}`)}
                      className="font-serif text-base font-semibold text-stone-900 hover:text-amber-800 transition-colors text-left"
                    >
                      {item.productName}
                    </button>
                    {item.variationName && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        {item.variationName}
                      </p>
                    )}
                    <span className="text-xs text-stone-400 font-mono block mt-1">
                      SKU: {item.sku}
                    </span>
                    <span className="text-xs font-semibold text-stone-800 mt-1 block tabular-nums sm:hidden">
                      {formatNaira(item.unitPriceKobo)} each
                    </span>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-stone-100">
                  <span className="hidden sm:block text-xs font-semibold text-stone-800 tabular-nums">
                    {formatNaira(item.unitPriceKobo)}
                  </span>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                    <button
                      onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-stone-800 tabular-nums">
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

                  <span className="text-sm font-bold text-stone-950 tabular-nums w-24 text-right">
                    {formatNaira(item.unitPriceKobo * item.quantity)}
                  </span>

                  <button
                    onClick={() => removeItem(itemKey)}
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-5">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Summary
            </h3>

            {/* Discount Code Form */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
                Have a Promo or Discount Code?
              </label>
              {appliedDiscount ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold">{appliedDiscount.code}</span>
                      <span className="ml-1.5">({appliedDiscount.percentage}% OFF)</span>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveDiscount}
                    className="text-stone-400 hover:text-stone-600 text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="e.g. WELCOME10"
                    className="flex-1 text-xs border border-stone-300 rounded-lg px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-stone-800"
                  />
                  <button
                    type="submit"
                    disabled={discountLoading || !discountInput.trim()}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    {discountLoading ? 'Checking...' : 'Apply'}
                  </button>
                </form>
              )}
              {discountError && (
                <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{discountError}</span>
                </p>
              )}
              <p className="text-[11px] text-stone-400 mt-1.5">
                Tip: Try seed code <strong className="font-mono text-stone-600">WELCOME10</strong> for 10% off.
              </p>
            </div>

            {/* Summary lines */}
            <div className="space-y-2.5 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatNaira(totals.subtotalKobo)}
                </span>
              </div>

              {totals.discountKobo > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied ({appliedDiscount?.percentage}%)</span>
                  <span className="font-semibold tabular-nums">
                    -{formatNaira(totals.discountKobo)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery (Umuahia)</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {totals.deliveryFeeKobo === 0 ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    formatNaira(totals.deliveryFeeKobo)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-extrabold text-stone-950">
                <span>Total Amount</span>
                <span className="tabular-nums">{formatNaira(totals.totalKobo)}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full py-4 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all min-h-[48px] cursor-pointer"
            >
              <span>Proceed to Paystack Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
