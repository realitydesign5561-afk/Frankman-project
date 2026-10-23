// Precision integer kobo financial calculations and Nigerian Naira formatting

/**
 * Formats integer kobo to Nigerian Naira currency string.
 * Example: 45000000 kobo -> "₦450,000"
 */
export function formatNaira(amountKobo: number | bigint | string): string {
  const numericKobo = typeof amountKobo === 'bigint' 
    ? Number(amountKobo) 
    : typeof amountKobo === 'string' 
      ? parseInt(amountKobo, 10) || 0 
      : amountKobo || 0;

  const nairaValue = numericKobo / 100;
  
  // Format with commas, standard Nigerian currency format
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(nairaValue);
}

/**
 * Calculates displayed variation price from base price and variation addition.
 * All amounts in integer kobo.
 */
export function calculateVariationPrice(basePriceKobo: number, additionalPriceKobo: number = 0): number {
  const base = Math.max(0, Math.floor(basePriceKobo));
  const add = Math.max(0, Math.floor(additionalPriceKobo));
  return base + add;
}

/**
 * Calculates discount amount in integer kobo using percentage.
 * Subtotal is multiplied by percentage and divided by 100 with Math.floor.
 */
export function calculateDiscount(eligibleSubtotalKobo: number, discountPercentage: number): number {
  if (discountPercentage <= 0 || eligibleSubtotalKobo <= 0) return 0;
  const clampedPercent = Math.min(100, Math.max(0, discountPercentage));
  const discount = Math.floor((eligibleSubtotalKobo * clampedPercent) / 100);
  return Math.min(discount, eligibleSubtotalKobo);
}

/**
 * Computes final checkout total:
 * subtotal - discount + delivery fee
 * Prevents negative totals.
 */
export function calculateOrderTotal(
  subtotalKobo: number,
  discountKobo: number,
  deliveryFeeKobo: number
): {
  subtotalKobo: number;
  discountKobo: number;
  deliveryFeeKobo: number;
  totalKobo: number;
} {
  const safeSubtotal = Math.max(0, Math.floor(subtotalKobo));
  const safeDiscount = Math.min(safeSubtotal, Math.max(0, Math.floor(discountKobo)));
  const safeDelivery = Math.max(0, Math.floor(deliveryFeeKobo));
  const totalKobo = Math.max(0, safeSubtotal - safeDiscount + safeDelivery);

  return {
    subtotalKobo: safeSubtotal,
    discountKobo: safeDiscount,
    deliveryFeeKobo: safeDelivery,
    totalKobo,
  };
}
