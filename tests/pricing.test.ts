import { describe, it, expect } from 'vitest';
import {
  formatNaira,
  calculateVariationPrice,
  calculateDiscount,
  calculateOrderTotal,
} from '../src/lib/pricing';

describe('Pricing & Currency Calculations (Integer Kobo)', () => {
  it('formats integer kobo to Nigerian Naira currency string', () => {
    // ₦450,000 = 45,000,000 kobo
    const formatted = formatNaira(45000000);
    expect(formatted).toContain('450,000');

    // ₦0 = 0 kobo
    expect(formatNaira(0)).toContain('0');
  });

  it('calculates variation price correctly with base and additional kobo', () => {
    // Base ₦450,000 (45,000,000 kobo) + Variation ₦50,000 (5,000,000 kobo) = ₦500,000 (50,000,000 kobo)
    const base = 45000000;
    const additional = 5000000;
    const finalPrice = calculateVariationPrice(base, additional);
    expect(finalPrice).toBe(50000000);
  });

  it('returns base price if variation addition is 0 or negative', () => {
    const base = 28500000;
    expect(calculateVariationPrice(base, 0)).toBe(28500000);
  });

  it('calculates percentage discounts using integer floor arithmetic', () => {
    // Subtotal ₦100,000 (10,000,000 kobo) with WELCOME10 (10%)
    const subtotal = 10000000;
    const discount = calculateDiscount(subtotal, 10);
    expect(discount).toBe(1000000); // ₦10,000 discount
  });

  it('clamps discount percentage between 0 and 100%', () => {
    const subtotal = 50000000;
    expect(calculateDiscount(subtotal, -5)).toBe(0);
    expect(calculateDiscount(subtotal, 150)).toBe(50000000);
  });

  it('computes order total correctly (subtotal - discount + delivery fee)', () => {
    const subtotal = 10000000; // ₦100,000
    const discount = 1000000;  // ₦10,000
    const delivery = 1500000;  // ₦15,000

    const result = calculateOrderTotal(subtotal, discount, delivery);
    expect(result.subtotalKobo).toBe(10000000);
    expect(result.discountKobo).toBe(1000000);
    expect(result.deliveryFeeKobo).toBe(1500000);
    expect(result.totalKobo).toBe(10500000); // ₦105,000
  });

  it('prevents negative order total if discount exceeds subtotal', () => {
    const result = calculateOrderTotal(1000000, 2000000, 0);
    expect(result.totalKobo).toBe(0);
  });
});
