import { describe, it, expect } from 'vitest';
import { CheckoutSchema, DiscountValidateSchema } from '../src/lib/validation';

describe('Checkout & Discount Validation Schemas', () => {
  it('passes validation for valid customer checkout input', () => {
    const validData = {
      customerName: 'Chinedu Okafor',
      customerEmail: 'chinedu@example.com',
      customerPhone: '08031234567',
      deliveryAddress: '14 Aba Road, Umuahia',
      deliveryCity: 'Umuahia',
      deliveryState: 'Abia State',
      deliveryCountry: 'Nigeria',
      deliveryInstructions: 'Call upon arrival',
      discountCode: 'WELCOME10',
      items: [
        {
          productId: 'prod-modern-luxury-sofa',
          variationId: 'var-sofa-grey',
          quantity: 1,
        },
      ],
    };

    const result = CheckoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects checkout with invalid email or short name', () => {
    const invalidData = {
      customerName: 'C',
      customerEmail: 'not-an-email',
      customerPhone: '123',
      deliveryAddress: 'Short',
      deliveryCity: 'U',
      deliveryState: 'Abia State',
      deliveryCountry: 'Nigeria',
      items: [],
    };

    const result = CheckoutSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      expect(fieldErrors.customerName).toBeDefined();
      expect(fieldErrors.customerEmail).toBeDefined();
      expect(fieldErrors.customerPhone).toBeDefined();
      expect(fieldErrors.items).toBeDefined();
    }
  });

  it('validates discount validate input schema', () => {
    const validDiscount = {
      code: 'WELCOME10',
      subtotalKobo: 45000000,
    };
    expect(DiscountValidateSchema.safeParse(validDiscount).success).toBe(true);

    const invalidDiscount = {
      code: '',
      subtotalKobo: -100,
    };
    expect(DiscountValidateSchema.safeParse(invalidDiscount).success).toBe(false);
  });
});
