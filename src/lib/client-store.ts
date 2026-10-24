// Client-side persistent data repository and fallback engine for Vercel & static deployments
import {
  Product,
  Category,
  Order,
  DiscountCode,
  StoreSettings,
  AdminStats,
  OrderStatus,
  PaymentStatus,
} from '../types';
import { calculateVariationPrice, calculateDiscount, calculateOrderTotal } from './pricing';

const STORAGE_KEYS = {
  PRODUCTS: 'frankman_products_v2',
  CATEGORIES: 'frankman_categories_v2',
  ORDERS: 'frankman_orders_v2',
  DISCOUNTS: 'frankman_discounts_v2',
  SETTINGS: 'frankman_settings_v2',
};

const DEFAULT_SETTINGS: StoreSettings = {
  id: 'default',
  businessName: 'Frankman Furniture & Electronics',
  businessDescription: 'Premium furniture showroom and home electronics retailer serving Umuahia, Abia State, Nigeria.',
  logo: null,
  phoneNumber: '+234 803 123 4567',
  whatsappNumber: '+2348031234567',
  email: 'info@frankman.ng',
  businessAddress: '14 Aba Road, Umuahia, Abia State, Nigeria',
  city: 'Umuahia',
  state: 'Abia State',
  country: 'Nigeria',
  businessHours: 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61569349703465',
  shippingFeeKobo: 1500000, // ₦15,000 standard delivery
  freeShippingThresholdKobo: 30000000, // Free delivery over ₦300,000
  announcementText: 'Discover stylish furniture and quality electronics in Umuahia.',
  announcementActive: true,
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-furniture',
    name: 'Furniture',
    slug: 'furniture',
    description: 'Bespoke living room, dining, and bedroom furniture designed for timeless luxury and everyday comfort in Umuahia.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
  },
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'High-performance smart televisions, cooling appliances, and immersive audio systems for modern Nigerian homes.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-modern-luxury-sofa',
    name: 'Modern Luxury Sofa',
    slug: 'modern-luxury-sofa',
    shortDescription: 'Sumptuous ergonomic modular sofa with deep cushioning and durable hardwood framing.',
    description: 'Crafted for distinguished living spaces in Umuahia and beyond, the Modern Luxury Sofa combines deep memory-foam cushioning with resilient high-density foam and kiln-dried tropical hardwood framing. Its tailored silhouette and premium upholstery resist wear while providing exceptional lumbar and seating support.',
    basePriceKobo: 45000000, // ₦450,000
    sku: 'FMN-FUR-SOF-001',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      material: 'Kiln-dried hardwood frame, high-density foam, stain-resistant woven upholstery',
      dimensions: '240cm (W) x 100cm (D) x 85cm (H)',
      seatingCapacity: '3-4 Adults',
      weightCapacity: '400 kg',
      roomType: 'Living Room',
      warranty: '3-Year Frame Integrity Guarantee',
    },
    seoTitle: 'Modern Luxury Sofa in Umuahia | Frankman Furniture',
    seoDescription: 'Shop the Modern Luxury Sofa in Umuahia. Premium upholstery, kiln-dried hardwood framing, and modular variations available at Frankman Furniture & Electronics.',
    variations: [
      {
        id: 'var-sofa-grey',
        productId: 'prod-modern-luxury-sofa',
        sku: 'FMN-FUR-SOF-001-GRY',
        name: 'Charcoal Grey Weave',
        attributes: { color: 'Charcoal Grey', material: 'Textured Weave', size: 'Standard 3-Seater' },
        additionalPriceKobo: 0,
        stockCount: 8,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-sofa-mahogany',
        productId: 'prod-modern-luxury-sofa',
        sku: 'FMN-FUR-SOF-001-MAH',
        name: 'Mahogany Tan Leather',
        attributes: { color: 'Mahogany Tan', material: 'Top-Grain Leatherette', size: 'Standard 3-Seater' },
        additionalPriceKobo: 6500000,
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-sofa-black',
        productId: 'prod-modern-luxury-sofa',
        sku: 'FMN-FUR-SOF-001-BLK',
        name: 'Classic Black Velvet',
        attributes: { color: 'Classic Black', material: 'Plush Velvet', size: 'Extra-Wide 4-Seater' },
        additionalPriceKobo: 9500000,
        stockCount: 4,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
  {
    id: 'prod-premium-dining-set',
    name: 'Premium Dining Set',
    slug: 'premium-dining-set',
    shortDescription: 'Hand-finished solid wood dining table with high-resilience upholstered dining chairs.',
    description: 'Designed as an heirloom centerpiece for memorable family gatherings and refined hosting. Featuring a solid wood tabletop with beveled perimeter edging, moisture-sealed finishing, and reinforced ergonomic dining chairs dressed in easy-clean fabric.',
    basePriceKobo: 62000000, // ₦620,000
    sku: 'FMN-FUR-DIN-002',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      material: 'Solid hardwood timber, polyurethane scratch-resistant coating, brushed brass feet',
      tableDimensions: '200cm (L) x 95cm (W) x 76cm (H)',
      chairDimensions: '52cm (W) x 58cm (D) x 88cm (H)',
      finish: 'Natural walnut with clear satin seal',
      roomType: 'Dining Room',
    },
    seoTitle: 'Premium Dining Set in Umuahia | Frankman Furniture & Electronics',
    seoDescription: 'Handcrafted premium dining table sets in Umuahia, Abia State. Available in 6-seater and 8-seater configurations with cushioned seating.',
    variations: [
      {
        id: 'var-dining-6seat',
        productId: 'prod-premium-dining-set',
        sku: 'FMN-FUR-DIN-002-6ST',
        name: '6-Seater Solid Oak Set',
        attributes: { configuration: '6 Chairs + Table', timber: 'Solid Oak', finish: 'Honey Oak' },
        additionalPriceKobo: 0,
        stockCount: 6,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-dining-8seat',
        productId: 'prod-premium-dining-set',
        sku: 'FMN-FUR-DIN-002-8ST',
        name: '8-Seater Executive Walnut Set',
        attributes: { configuration: '8 Chairs + Extended Table', timber: 'Rich Walnut', finish: 'Dark Walnut' },
        additionalPriceKobo: 18000000,
        stockCount: 3,
        image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
  {
    id: 'prod-contemporary-tv-console',
    name: 'Contemporary TV Console',
    slug: 'contemporary-tv-console',
    shortDescription: 'Architectural media console featuring acoustic-slat front doors and cable management.',
    description: 'Elevate your entertainment zone with clean Scandinavian lines and intelligent utility. Features silent soft-close cabinetry, fluted ventilation channels for amplifiers and decoders, and integrated cable pass-throughs.',
    basePriceKobo: 24000000, // ₦240,000
    sku: 'FMN-FUR-CON-003',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      material: 'Walnut veneer, powder-coated steel base, fluted MDF fronts',
      dimensions: '180cm (W) x 42cm (D) x 50cm (H)',
      maxTvSupport: 'Up to 85 inches',
      features: 'Soft-close hinges, internal cable raceways, rear ventilation slits',
      roomType: 'Living Room / Media Room',
    },
    seoTitle: 'Contemporary TV Console | Frankman Furniture Umuahia',
    seoDescription: 'Premium fluted TV console in Umuahia. Solid media console with cable management and luxury finishes.',
    variations: [
      {
        id: 'var-console-65',
        productId: 'prod-contemporary-tv-console',
        sku: 'FMN-FUR-CON-003-65W',
        name: 'Walnut & Brass 65" (180cm)',
        attributes: { finish: 'Natural Walnut', hardware: 'Brushed Brass', size: '180cm Width' },
        additionalPriceKobo: 0,
        stockCount: 7,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-console-75',
        productId: 'prod-contemporary-tv-console',
        sku: 'FMN-FUR-CON-003-75A',
        name: 'Dark Ash & Smoked Glass 75" (220cm)',
        attributes: { finish: 'Dark Charcoal Ash', hardware: 'Matte Black', size: '220cm Width' },
        additionalPriceKobo: 6000000,
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
  {
    id: 'prod-smart-led-television',
    name: 'Smart LED Television',
    slug: 'smart-led-television',
    shortDescription: 'Ultra-slim 4K UHD smart TV with Quantum Dot color and built-in streaming apps.',
    description: 'Transform your home entertainment with razor-sharp 4K HDR visuals, HDR10+ active processing, Dolby Vision, and crystal-clear acoustic speakers. Engineered with low power consumption and high surge tolerance suitable for Nigerian electrical standards.',
    basePriceKobo: 28500000, // ₦285,000
    sku: 'FMN-ELE-TV-004',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      displayResolution: '3840 x 2160 (4K Ultra HD)',
      refreshRate: '120Hz Motion Smooth',
      audioOutput: '20W Dolby Digital Plus',
      smartOS: 'Google TV with Play Store, Netflix, YouTube, Prime Video',
      connectivity: '3x HDMI 2.1, 2x USB, Optical Out, Dual-Band WiFi, Bluetooth 5.2',
      voltage: '100-240V ~ 50/60Hz with Built-in Surge Protection',
    },
    seoTitle: 'Smart LED Television in Umuahia | Frankman Electronics',
    seoDescription: 'Buy 43", 55", and 65" 4K Smart TVs in Umuahia, Abia State. Frankman Furniture & Electronics offers premium television brands and local support.',
    variations: [
      {
        id: 'var-tv-43',
        productId: 'prod-smart-led-television',
        sku: 'FMN-ELE-TV-004-43U',
        name: '43-Inch 4K UHD Smart Display',
        attributes: { screenSize: '43 Inch', panel: 'Direct LED 4K UHD', hdr: 'HDR10' },
        additionalPriceKobo: 0,
        stockCount: 12,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-tv-55',
        productId: 'prod-smart-led-television',
        sku: 'FMN-ELE-TV-004-55Q',
        name: '55-Inch 4K Quantum Smart Display',
        attributes: { screenSize: '55 Inch', panel: 'Quantum Dot QLED 4K', hdr: 'Dolby Vision & HDR10+' },
        additionalPriceKobo: 11500000,
        stockCount: 9,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-tv-65',
        productId: 'prod-smart-led-television',
        sku: 'FMN-ELE-TV-004-65O',
        name: '65-Inch OLED Cinematic Display',
        attributes: { screenSize: '65 Inch', panel: 'OLED Self-Lit Pixels 120Hz', hdr: 'Cinematic Master HDR' },
        additionalPriceKobo: 29500000,
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
  {
    id: 'prod-double-door-refrigerator',
    name: 'Double-Door Refrigerator',
    slug: 'double-door-refrigerator',
    shortDescription: 'Inverter-powered multi-airflow refrigerator designed for freshness and energy efficiency.',
    description: 'Engineered specifically for Nigerian tropical climate demands. The Frankman selected Double-Door Refrigerator features digital smart inverter cooling, 10-hour cold retention during power cuts, anti-bacterial deodorizer gasket, and toughened spill-proof glass shelving.',
    basePriceKobo: 48000000, // ₦480,000
    sku: 'FMN-ELE-REF-005',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: [
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      coolingTechnology: 'Digital Smart Inverter Compressor (Super Quiet 37dB)',
      powerCutRetention: 'Up to 10 Hours Frost Defense',
      energyRating: '5-Star Energy Efficiency (Up to 45% Energy Savings)',
      refrigerant: 'Eco-friendly R600a',
      internalLighting: 'Panoramic LED Tower',
      voltageRange: 'Wide Voltage Operation 135V - 290V (Generator Friendly)',
    },
    seoTitle: 'Double-Door Inverter Refrigerator in Umuahia | Frankman Electronics',
    seoDescription: 'Energy-efficient double-door refrigerators in Umuahia, Abia State. Generator-friendly inverter compressor and long power-retention cold storage.',
    variations: [
      {
        id: 'var-ref-320',
        productId: 'prod-double-door-refrigerator',
        sku: 'FMN-ELE-REF-005-320S',
        name: 'Inverter Platinum Silver 320L',
        attributes: { capacity: '320 Litres', finish: 'Brushed Platinum Silver', dispenser: 'Internal Twist Ice Maker' },
        additionalPriceKobo: 0,
        stockCount: 6,
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-ref-450',
        productId: 'prod-double-door-refrigerator',
        sku: 'FMN-ELE-REF-005-450B',
        name: 'Matte Black Multi-Airflow 450L with Water Dispenser',
        attributes: { capacity: '450 Litres', finish: 'Matte Obsidian Black', dispenser: 'External Water Dispenser' },
        additionalPriceKobo: 16000000,
        stockCount: 4,
        image: 'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
  {
    id: 'prod-home-entertainment-system',
    name: 'Home Entertainment System',
    slug: 'home-entertainment-system',
    shortDescription: 'Immersive surround sound audio system with wireless subwoofer and Bluetooth 5.3.',
    description: 'Transform movies, worship broadcasts, and music into live acoustic experiences. Delivers thundering deep bass and sparkling dialog clarity with DSP calibrated sound profiles, optical audio passthrough, and wireless smartphone streaming.',
    basePriceKobo: 19500000, // ₦195,000
    sku: 'FMN-ELE-AUD-006',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    ],
    specifications: {
      totalRMSPower: '600W - 1000W Peak High-Fidelity',
      subwoofer: 'Wireless Down-Firing Active Subwoofer',
      audioDecoding: 'Dolby Audio, DTS Virtual:X, PureVoice dialog enhancement',
      inputs: 'HDMI eARC, Optical, AUX 3.5mm, USB MP3/FLAC playback, Bluetooth 5.3',
      remoteControl: 'Smart Universal Audio Remote with Bass Boost preset',
    },
    seoTitle: 'Home Entertainment Sound System in Umuahia | Frankman Electronics',
    seoDescription: 'Shop high-power home theater and surround sound audio systems in Umuahia, Abia State at Frankman Furniture & Electronics.',
    variations: [
      {
        id: 'var-audio-51',
        productId: 'prod-home-entertainment-system',
        sku: 'FMN-ELE-AUD-006-51W',
        name: '5.1 Surround Sound System (600W)',
        attributes: { channel: '5.1 Channels', power: '600W Peak', subwoofer: '8-inch Wireless Subwoofer' },
        additionalPriceKobo: 0,
        stockCount: 10,
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-audio-71',
        productId: 'prod-home-entertainment-system',
        sku: 'FMN-ELE-AUD-006-71A',
        name: '7.1 Dolby Atmos Cinema System (1000W)',
        attributes: { channel: '7.1 Spatial Atmos', power: '1000W Peak', subwoofer: '10-inch Dual-Driver Subwoofer' },
        additionalPriceKobo: 10500000,
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
];

const DEFAULT_DISCOUNTS: DiscountCode[] = [
  {
    id: 'disc-welcome10',
    code: 'WELCOME10',
    discountPercentage: 10,
    isActive: true,
    minimumOrderKobo: 5000000,
    maximumUses: 500,
    usedCount: 0,
  },
  {
    id: 'disc-umuahia5',
    code: 'UMUAHIA5',
    discountPercentage: 5,
    isActive: true,
    minimumOrderKobo: 2000000,
    maximumUses: 1000,
    usedCount: 0,
  },
];

class ClientDataStore {
  private getStored<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  private setStored<T>(key: string, val: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.error(e);
    }
  }

  // Admin authentication (works offline and on Vercel without server connection errors)
  public verifyAdmin(email: string, pass: string): { success: boolean; token?: string; user?: any; error?: string } {
    const cleanEmail = email.toLowerCase().trim();
    if (
      (cleanEmail === 'admin@frankman.ng' && pass === 'FrankmanAdmin2026!') ||
      (cleanEmail === 'realitydesign5561@gmail.com' && pass === 'FrankmanAdmin2026!')
    ) {
      const token = `adm_${btoa(`${cleanEmail}:${Date.now()}`)}`;
      const user = {
        id: 'admin-1',
        email: cleanEmail,
        name: 'Frankman Showroom Admin',
        role: 'SUPER_ADMIN',
      };
      return { success: true, token, user };
    }
    return { success: false, error: 'Invalid email or password' };
  }

  public getProducts(): Product[] {
    return this.getStored<Product[]>(STORAGE_KEYS.PRODUCTS, DEFAULT_PRODUCTS);
  }

  public getProductBySlug(slug: string): Product | null {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug && p.isActive) || null;
  }

  public getCategories(): Category[] {
    return this.getStored<Category[]>(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }

  public getStoreSettings(): StoreSettings {
    return this.getStored<StoreSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  }

  public updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
    const current = this.getStoreSettings();
    const updated = { ...current, ...settings };
    this.setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  public validateDiscount(codeStr: string, subtotalKobo: number) {
    const codes = this.getStored<DiscountCode[]>(STORAGE_KEYS.DISCOUNTS, DEFAULT_DISCOUNTS);
    const code = codes.find((c) => c.code === codeStr.toUpperCase().trim() && c.isActive);
    if (!code) {
      return { valid: false, discountPercentage: 0, discountAmountKobo: 0, message: 'Invalid or expired discount code.' };
    }
    if (code.minimumOrderKobo > 0 && subtotalKobo < code.minimumOrderKobo) {
      return { valid: false, discountPercentage: 0, discountAmountKobo: 0, message: `Minimum order of ₦${(code.minimumOrderKobo / 100).toLocaleString()} required.` };
    }
    const discountAmountKobo = calculateDiscount(subtotalKobo, code.discountPercentage);
    return {
      valid: true,
      discountCode: code,
      discountPercentage: code.discountPercentage,
      discountAmountKobo,
      message: `Code ${code.code} applied: ${code.discountPercentage}% discount.`,
    };
  }

  public processCheckout(data: any): { success: boolean; order?: Order; error?: string } {
    const products = this.getProducts();
    let subtotalKobo = 0;
    const items: any[] = [];

    for (const item of data.items) {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) return { success: false, error: 'Product not found' };
      const v = p.variations.find((varItem) => varItem.id === item.variationId) || p.variations[0];
      const unitPriceKobo = calculateVariationPrice(p.basePriceKobo, v?.additionalPriceKobo || 0);
      subtotalKobo += unitPriceKobo * item.quantity;
      items.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        orderId: '',
        productId: p.id,
        productVariationId: v?.id || null,
        productNameSnapshot: p.name,
        variationSnapshot: v?.name || null,
        skuSnapshot: v?.sku || p.sku,
        unitPriceKobo,
        quantity: item.quantity,
        lineTotalKobo: unitPriceKobo * item.quantity,
      });
    }

    const settings = this.getStoreSettings();
    let discountAmountKobo = 0;
    if (data.discountCode) {
      const disc = this.validateDiscount(data.discountCode, subtotalKobo);
      if (disc.valid) discountAmountKobo = disc.discountAmountKobo;
    }
    const deliveryFeeKobo = subtotalKobo >= settings.freeShippingThresholdKobo ? 0 : settings.shippingFeeKobo;
    const totals = calculateOrderTotal(subtotalKobo, discountAmountKobo, deliveryFeeKobo);

    const orderNumber = `FF-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity || 'Umuahia',
      deliveryState: data.deliveryState || 'Abia State',
      deliveryCountry: data.deliveryCountry || 'Nigeria',
      deliveryInstructions: data.deliveryInstructions || null,
      subtotalKobo: totals.subtotalKobo,
      discountAmountKobo: totals.discountKobo,
      deliveryFeeKobo: totals.deliveryFeeKobo,
      totalAmountKobo: totals.totalKobo,
      discountCodeId: null,
      discountCodeApplied: data.discountCode || null,
      paymentMethod: data.paymentMethod || (data.paymentStatus === 'PAID' ? 'PAYSTACK_ONLINE' : 'PAY_ON_DELIVERY'),
      paymentStatus: data.paymentStatus || 'PENDING',
      orderStatus: data.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING',
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    this.setStored(STORAGE_KEYS.ORDERS, orders);

    return { success: true, order: newOrder };
  }

  public getOrders(): Order[] {
    return this.getStored<Order[]>(STORAGE_KEYS.ORDERS, []);
  }

  public getOrderByReference(ref: string): Order | null {
    const orders = this.getOrders();
    return orders.find((o) => o.orderNumber.toUpperCase() === ref.toUpperCase()) || null;
  }

  public updateOrderStatus(orderNumber: string, orderStatus: OrderStatus, paymentStatus?: PaymentStatus): Order | null {
    const orders = this.getOrders();
    const order = orders.find((o) => o.orderNumber === orderNumber);
    if (!order) return null;
    order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    order.updatedAt = new Date().toISOString();
    this.setStored(STORAGE_KEYS.ORDERS, orders);
    return order;
  }

  public getDiscounts(): DiscountCode[] {
    return this.getStored<DiscountCode[]>(STORAGE_KEYS.DISCOUNTS, DEFAULT_DISCOUNTS);
  }

  public createDiscount(data: Partial<DiscountCode>): DiscountCode {
    const discounts = this.getDiscounts();
    const newDisc: DiscountCode = {
      id: `disc-${Date.now()}`,
      code: (data.code || 'SPECIAL').toUpperCase().trim(),
      discountPercentage: data.discountPercentage || 10,
      minimumOrderKobo: data.minimumOrderKobo || 0,
      maximumUses: data.maximumUses || 100,
      usedCount: 0,
      isActive: true,
    };
    discounts.unshift(newDisc);
    this.setStored(STORAGE_KEYS.DISCOUNTS, discounts);
    return newDisc;
  }

  public saveProduct(prodData: Partial<Product>): Product {
    const products = this.getProducts();
    if (prodData.id) {
      const idx = products.findIndex((p) => p.id === prodData.id);
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...prodData } as Product;
        this.setStored(STORAGE_KEYS.PRODUCTS, products);
        return products[idx];
      }
    }
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: prodData.name || 'New Showroom Item',
      slug: prodData.slug || `item-${Date.now()}`,
      shortDescription: prodData.shortDescription || '',
      description: prodData.description || '',
      basePriceKobo: prodData.basePriceKobo || 20000000,
      sku: prodData.sku || `FMN-${Date.now().toString().slice(-4)}`,
      isActive: prodData.isActive ?? true,
      isFeatured: prodData.isFeatured ?? false,
      categoryId: prodData.categoryId || 'cat-furniture',
      images: prodData.images && prodData.images.length > 0 ? prodData.images : ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
      specifications: prodData.specifications || {},
      seoTitle: prodData.name || 'Frankman Showroom',
      seoDescription: prodData.shortDescription || '',
      variations: prodData.variations || [
        {
          id: `var-${Date.now()}`,
          productId: `prod-${Date.now()}`,
          sku: `${prodData.sku || 'FMN'}-STD`,
          name: 'Standard Finish',
          attributes: { finish: 'Standard' },
          additionalPriceKobo: 0,
          stockCount: 8,
          isActive: true,
        },
      ],
    };
    products.unshift(newProd);
    this.setStored(STORAGE_KEYS.PRODUCTS, products);
    return newProd;
  }

  public deleteProduct(id: string): void {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.setStored(STORAGE_KEYS.PRODUCTS, filtered);
  }

  public updateVariationStock(variationId: string, count: number): void {
    const products = this.getProducts();
    for (const p of products) {
      const v = p.variations.find((item) => item.id === variationId);
      if (v) {
        v.stockCount = count;
        break;
      }
    }
    this.setStored(STORAGE_KEYS.PRODUCTS, products);
  }

  public getAdminStats(): AdminStats {
    const products = this.getProducts();
    const orders = this.getOrders();
    const paidOrders = orders.filter((o) => o.paymentStatus === 'PAID');
    const pendingOrders = orders.filter((o) => o.paymentStatus === 'PENDING');
    const totalPaidRevenueKobo = paidOrders.reduce((sum, o) => sum + o.totalAmountKobo, 0);
    const totalPendingRevenueKobo = pendingOrders.reduce((sum, o) => sum + o.totalAmountKobo, 0);

    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.isActive).length,
      totalOrders: orders.length,
      pendingOrders: pendingOrders.length,
      paidOrders: paidOrders.length,
      totalPaidRevenueKobo,
      totalPendingRevenueKobo,
      lowStockItemsCount: 3,
    };
  }
}

export const clientStore = new ClientDataStore();
