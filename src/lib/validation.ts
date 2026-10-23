import { z } from 'zod';

// Nigerian and international phone validator
const phoneRegex = /^(\+?234|0)[789][01]\d{8}$/;

export const CheckoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variationId: z.string().optional().nullable(),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(50, 'Quantity cannot exceed 50'),
});

export const CheckoutSchema = z.object({
  customerName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
  customerEmail: z.string().trim().email('Please enter a valid email address'),
  customerPhone: z.string().trim().min(10, 'Please enter a valid phone number'),
  deliveryAddress: z.string().trim().min(5, 'Delivery address must be at least 5 characters'),
  deliveryCity: z.string().trim().min(2, 'City is required').default('Umuahia'),
  deliveryState: z.string().trim().min(2, 'State is required').default('Abia State'),
  deliveryCountry: z.string().trim().default('Nigeria'),
  deliveryInstructions: z.string().trim().max(500).optional().nullable(),
  discountCode: z.string().trim().toUpperCase().optional().nullable(),
  items: z.array(CheckoutItemSchema).min(1, 'Your cart is empty. Please add items to checkout.'),
  idempotencyKey: z.string().optional(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']).optional(),
  paystackReference: z.string().optional().nullable(),
  paymentChannel: z.string().optional().nullable(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export const DiscountValidateSchema = z.object({
  code: z.string().trim().toUpperCase().min(1, 'Discount code is required'),
  subtotalKobo: z.number().int().nonnegative(),
});

export const AdminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ProductUpsertSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required'),
  slug: z.string().trim().min(2, 'Slug is required'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().trim().optional(),
  basePriceKobo: z.number().int().positive('Base price must be positive'),
  sku: z.string().trim().min(2, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one product image is required'),
  specifications: z.record(z.string(), z.string()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const VariationUpsertSchema = z.object({
  sku: z.string().trim().min(2, 'SKU is required'),
  name: z.string().trim().min(2, 'Variation name is required'),
  attributes: z.record(z.string(), z.string()),
  additionalPriceKobo: z.number().int().nonnegative('Additional price must be non-negative'),
  stockCount: z.number().int().nonnegative('Stock count must be non-negative'),
  image: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const StoreSettingsSchema = z.object({
  businessName: z.string().trim().min(2),
  businessDescription: z.string().trim().min(10),
  phoneNumber: z.string().trim().min(7),
  whatsappNumber: z.string().trim().min(7),
  email: z.string().trim().email(),
  businessAddress: z.string().trim().min(5),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  country: z.string().trim().min(2),
  businessHours: z.string().trim().min(5),
  facebookUrl: z.string().trim().url(),
  shippingFeeKobo: z.number().int().nonnegative(),
  freeShippingThresholdKobo: z.number().int().nonnegative(),
  announcementText: z.string().trim(),
  announcementActive: z.boolean(),
});
