import React, { useState } from 'react';
import { useCartStore } from '../store/cart-store';
import { formatNaira, calculateOrderTotal } from '../lib/pricing';
import { SafeImage } from '../components/ui/SafeImage';
import { CheckoutSchema } from '../lib/validation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, appliedDiscount, getSubtotalKobo, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryCity: 'Umuahia',
    deliveryState: 'Abia State',
    deliveryCountry: 'Nigeria',
    deliveryInstructions: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotalKobo = getSubtotalKobo();
  const freeThresholdKobo = 30000000; // ₦300,000
  const deliveryFeeKobo = subtotalKobo >= freeThresholdKobo ? 0 : 1500000; // ₦15,000
  const discountAmountKobo = appliedDiscount
    ? Math.floor((subtotalKobo * appliedDiscount.percentage) / 100)
    : 0;

  const totals = calculateOrderTotal(
    subtotalKobo,
    discountAmountKobo,
    deliveryFeeKobo
  );

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-stone-500">
          You need items in your shopping bag before proceeding to checkout.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
        >
          Explore Showroom Catalog
        </button>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setFormErrors({});

    // Client-side validation using Zod
    const checkoutPayload = {
      ...formData,
      discountCode: appliedDiscount?.code || null,
      items: items.map((i) => ({
        productId: i.productId,
        variationId: i.variationId || null,
        quantity: i.quantity,
      })),
      idempotencyKey: `idem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };

    const validationResult = CheckoutSchema.safeParse(checkoutPayload);
    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setSubmitError(data.error || 'Failed to place order. Please review your details.');
        setIsSubmitting(false);
        return;
      }

      // Order placed successfully! Clear cart and navigate to confirmation
      clearCart();
      onNavigate(`/order-confirmation/${data.order.orderNumber}`);
    } catch (err: any) {
      setSubmitError('Network error while placing order. Your cart has been preserved. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-stone-900">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Complete customer details for prompt showroom preparation and local delivery in Umuahia.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Delivery & Customer Info */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>1. Customer & Delivery Information</span>
              <span className="text-xs text-amber-800 font-sans font-medium">Umuahia & Abia State</span>
            </h2>

            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p>{submitError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Chinedu Okafor"
                  className={`w-full text-xs border rounded-lg px-3 py-2.5 focus:outline-none ${
                    formErrors.customerName
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-stone-300 focus:border-stone-900'
                  }`}
                />
                {formErrors.customerName && (
                  <p className="text-[11px] text-rose-600">{formErrors.customerName}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="e.g. chinedu@example.com"
                  className={`w-full text-xs border rounded-lg px-3 py-2.5 focus:outline-none ${
                    formErrors.customerEmail
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-stone-300 focus:border-stone-900'
                  }`}
                />
                {formErrors.customerEmail && (
                  <p className="text-[11px] text-rose-600">{formErrors.customerEmail}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  placeholder="e.g. 0803 123 4567 or +234..."
                  className={`w-full text-xs border rounded-lg px-3 py-2.5 focus:outline-none ${
                    formErrors.customerPhone
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-stone-300 focus:border-stone-900'
                  }`}
                />
                {formErrors.customerPhone && (
                  <p className="text-[11px] text-rose-600">{formErrors.customerPhone}</p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Delivery Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="e.g. 14 Aba Road, Opposite City Park, Umuahia"
                  className={`w-full text-xs border rounded-lg px-3 py-2.5 focus:outline-none ${
                    formErrors.deliveryAddress
                      ? 'border-rose-400 bg-rose-50/30'
                      : 'border-stone-300 focus:border-stone-900'
                  }`}
                />
                {formErrors.deliveryAddress && (
                  <p className="text-[11px] text-rose-600">{formErrors.deliveryAddress}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  City / Town <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryCity"
                  value={formData.deliveryCity}
                  onChange={handleChange}
                  className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  State <span className="text-rose-500">*</span>
                </label>
                <select
                  name="deliveryState"
                  value={formData.deliveryState}
                  onChange={handleChange}
                  className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900 bg-white"
                >
                  <option value="Abia State">Abia State (Primary)</option>
                  <option value="Imo State">Imo State</option>
                  <option value="Enugu State">Enugu State</option>
                  <option value="Anambra State">Anambra State</option>
                  <option value="Ebonyi State">Ebonyi State</option>
                  <option value="Rivers State">Rivers State</option>
                </select>
              </div>

              {/* Country */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Country
                </label>
                <input
                  type="text"
                  name="deliveryCountry"
                  value={formData.deliveryCountry}
                  readOnly
                  className="w-full text-xs border border-stone-200 bg-stone-50 rounded-lg px-3 py-2.5 text-stone-600 cursor-not-allowed"
                />
              </div>

              {/* Delivery Instructions */}
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-semibold text-stone-700">
                  Special Delivery Instructions / Landmarks (Optional)
                </label>
                <textarea
                  name="deliveryInstructions"
                  rows={2}
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  placeholder="e.g. Call before arrival, apartment is on the 2nd floor, yellow gate."
                  className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Notice Card */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>2. Payment Terms & Method</span>
              <Lock className="w-4 h-4 text-stone-400" />
            </h2>

            <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Pay Securely Online (Powered by Paystack Architecture)</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Direct online card collection is currently in readiness mode. Submitting this form creates your order with verified stock allocation and sets your order to <strong className="font-semibold text-stone-900">PENDING</strong> status.
              </p>
              <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-200/80">
                Our sales team in Umuahia will contact you immediately via phone or WhatsApp to verify order specifications, delivery timing, and facilitate secure payment upon dispatch or showroom pickup.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Order Review ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h3>

            {/* Item list */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
              {items.map((item) => {
                const itemKey = `${item.productId}__${item.variationId || 'default'}`;
                return (
                  <div key={itemKey} className="pt-3 first:pt-0 flex items-center gap-3">
                    <div className="w-12 h-12 rounded bg-stone-100 overflow-hidden shrink-0">
                      <SafeImage
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {item.productName}
                      </p>
                      {item.variationName && (
                        <p className="text-[11px] text-stone-500 truncate">
                          {item.variationName}
                        </p>
                      )}
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} × {formatNaira(item.unitPriceKobo)}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-stone-900 tabular-nums">
                      {formatNaira(item.unitPriceKobo * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2 pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {formatNaira(totals.subtotalKobo)}
                </span>
              </div>

              {totals.discountKobo > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({appliedDiscount?.code})</span>
                  <span className="font-semibold tabular-nums">
                    -{formatNaira(totals.discountKobo)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Showroom Delivery (Umuahia)</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {totals.deliveryFeeKobo === 0 ? 'FREE' : formatNaira(totals.deliveryFeeKobo)}
                </span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
                <span>Final Total</span>
                <span className="tabular-nums">{formatNaira(totals.totalKobo)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#1C1917] hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-lg text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-stone-400 text-center space-y-1">
              <p>✓ No online card charges deducted during initial release.</p>
              <p>✓ Order details sent directly to our Umuahia fulfillment desk.</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
