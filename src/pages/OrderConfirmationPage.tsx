import React, { useEffect, useState } from 'react';
import { Order } from '../types';
import { formatNaira } from '../lib/pricing';
import { SafeImage } from '../components/ui/SafeImage';
import { WhatsAppButton } from '../components/support/WhatsAppButton';
import { clientStore } from '../lib/client-store';
import {
  CheckCircle2,
  Printer,
  Package,
  Clock,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

interface OrderConfirmationPageProps {
  reference: string;
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  reference,
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders/${reference}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found on server');
        return res.json();
      })
      .then((data: Order) => setOrder(data))
      .catch(() => {
        const fallback = clientStore.getOrderByReference(reference);
        setOrder(fallback);
      })
      .finally(() => setLoading(false));
  }, [reference]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 animate-pulse space-y-6">
        <div className="h-12 bg-stone-200 rounded-lg w-1/2 mx-auto" />
        <div className="h-64 bg-stone-200 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Order Not Located
        </h2>
        <p className="text-xs text-stone-500">
          We could not locate an order matching reference "{reference}". Please verify your order number or contact our showroom desk.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-5 py-2.5 bg-[#1C1917] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const orderWhatsAppMessage = `Hello Frankman Furniture & Electronics, I am inquiring regarding my confirmed order #${order.orderNumber} placed for ${order.customerName} in Umuahia.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Card */}
      <div className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-800">
            Showroom Order Placed Successfully
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Thank You, {order.customerName}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Your order has been recorded at our Umuahia showroom. Your inventory has been reserved, and our sales team is preparing fulfillment.
        </p>

        {/* Order Reference Badge */}
        <div className="inline-block bg-white border border-stone-300 px-5 py-2.5 rounded-lg shadow-xs mt-2">
          <span className="text-xs text-stone-500 block">Order Reference Number</span>
          <span className="font-mono text-lg font-bold text-stone-900 tracking-wider">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[11px] text-stone-500 block">Order Status</span>
            <span className="text-xs font-bold text-stone-800">
              {order.orderStatus} (Showroom Verification)
            </span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 p-4 rounded-xl flex items-center gap-3">
          <Package className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="text-[11px] text-stone-500 block">Payment Status</span>
            <span className="text-xs font-bold text-amber-800">
              {order.paymentStatus} (Payable on Dispatch / Pickup)
            </span>
          </div>
        </div>
      </div>

      {/* Order Itemized Receipt */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-stone-900">
            Items Reserved
          </h3>
          <span className="text-xs text-stone-500">
            {new Date(order.createdAt).toLocaleDateString('en-NG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="p-6 divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-medium text-sm text-stone-900">
                  {item.productNameSnapshot}
                </h4>
                {item.variationSnapshot && (
                  <p className="text-xs text-stone-500">{item.variationSnapshot}</p>
                )}
                <span className="text-[11px] text-stone-400 font-mono">
                  SKU: {item.skuSnapshot}
                </span>
                <p className="text-xs text-stone-600 mt-1">
                  Qty: {item.quantity} × {formatNaira(item.unitPriceKobo)}
                </p>
              </div>
              <span className="font-semibold text-sm text-stone-950 tabular-nums">
                {formatNaira(item.lineTotalKobo)}
              </span>
            </div>
          ))}
        </div>

        {/* Financial Totals */}
        <div className="bg-[#FAF9F5] p-6 border-t border-stone-200 space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900 tabular-nums">
              {formatNaira(order.subtotalKobo)}
            </span>
          </div>

          {order.discountAmountKobo > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Discount ({order.discountCodeApplied || 'Promo'})</span>
              <span className="font-semibold tabular-nums">
                -{formatNaira(order.discountAmountKobo)}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-stone-900 tabular-nums">
              {order.deliveryFeeKobo === 0 ? 'FREE' : formatNaira(order.deliveryFeeKobo)}
            </span>
          </div>

          <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
            <span>Total Payable</span>
            <span className="tabular-nums">{formatNaira(order.totalAmountKobo)}</span>
          </div>
        </div>
      </div>

      {/* Customer & Delivery Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800">
            Delivery Destination
          </h4>
          <div className="text-xs text-stone-600 space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {order.deliveryAddress}, {order.deliveryCity}, {order.deliveryState}, {order.deliveryCountry}
              </span>
            </div>
            {order.deliveryInstructions && (
              <p className="pt-1 text-stone-500 italic">
                Notes: "{order.deliveryInstructions}"
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-stone-800">
            Contact Information
          </h4>
          <div className="text-xs text-stone-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{order.customerPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{order.customerEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions: WhatsApp Inquiry & Print Receipt */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
        <div className="flex items-center gap-3">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={orderWhatsAppMessage}
            label="Inquire via WhatsApp"
            size="md"
          />
          <button
            onClick={handlePrint}
            className="px-4 py-2 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('/shop')}
          className="text-xs font-semibold text-stone-800 hover:text-amber-800 flex items-center gap-1 transition-colors"
        >
          <span>Continue Browsing Showroom</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
