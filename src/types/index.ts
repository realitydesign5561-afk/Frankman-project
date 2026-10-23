// Core Type Definitions for Frankman Furniture & Electronics

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariation {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>; // parsed JSON
  additionalPriceKobo: number; // In integer kobo
  stockCount: number;
  image?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  basePriceKobo: number; // In integer kobo
  images: string[]; // parsed array
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  variations: ProductVariation[];
  specifications?: Record<string, string> | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
  startsAt?: string | null;
  expiresAt?: string | null;
  minimumOrderKobo: number;
  maximumUses?: number | null;
  usedCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariationId?: string | null;
  productNameSnapshot: string;
  variationSnapshot?: string | null;
  skuSnapshot: string;
  unitPriceKobo: number;
  quantity: number;
  lineTotalKobo: number;
  createdAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. FF-2026-ABCD
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryCountry: string;
  deliveryInstructions?: string | null;
  subtotalKobo: number;
  discountAmountKobo: number;
  deliveryFeeKobo: number;
  totalAmountKobo: number;
  discountCodeId?: string | null;
  discountCodeApplied?: string | null;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id: string;
  businessName: string;
  businessDescription: string;
  logo?: string | null;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  businessAddress: string;
  city: string;
  state: string;
  country: string;
  businessHours: string;
  facebookUrl: string;
  shippingFeeKobo: number;
  freeShippingThresholdKobo: number;
  announcementText: string;
  announcementActive: boolean;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  variationId?: string | null;
  productName: string;
  variationName?: string | null;
  sku: string;
  unitPriceKobo: number;
  image: string;
  quantity: number;
  stockAvailable: number;
  slug: string;
}

export interface AdminStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalPaidRevenueKobo: number;
  totalPendingRevenueKobo: number;
  lowStockItemsCount: number;
}
