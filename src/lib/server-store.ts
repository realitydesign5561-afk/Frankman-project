// Server-side persistent storage and transaction engine for Frankman Furniture & Electronics
import crypto from 'crypto';
import {
  Category,
  Product,
  ProductVariation,
  DiscountCode,
  Order,
  OrderItem,
  StoreSettings,
  AdminStats,
  PaymentStatus,
  OrderStatus,
} from '../types';
import { calculateVariationPrice, calculateDiscount, calculateOrderTotal } from './pricing';

function hashPassword(password: string): string {
  const salt = 'frankman_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export interface InventoryMovementRecord {
  id: string;
  variationId: string;
  productName: string;
  variationName: string;
  change: number;
  previousStock: number;
  newStock: number;
  reason: string;
  createdAt: string;
}

class FrankmanDataStore {
  private categories: Map<string, Category> = new Map();
  private products: Map<string, Product> = new Map();
  private discountCodes: Map<string, DiscountCode> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderIdempotencyMap: Map<string, string> = new Map(); // idempotencyKey -> orderNumber
  private inventoryMovements: InventoryMovementRecord[] = [];
  private storeSettings: StoreSettings;
  private adminUsers: Map<string, { id: string; email: string; passwordHash: string; name: string; role: string }> = new Map();

  constructor() {
    this.storeSettings = {
      id: 'default',
      businessName: 'Frankman Furniture & Electronics',
      businessDescription: 'Premium furniture showroom and home electronics retailer serving Umuahia, Abia State, Nigeria.',
      logo: null,
      phoneNumber: '+234 803 123 4567',
      whatsappNumber: '+2348031234567',
      email: 'info@frankman.ng',
      businessAddress: 'Umuahia, Abia State, Nigeria',
      city: 'Umuahia',
      state: 'Abia State',
      country: 'Nigeria',
      businessHours: 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
      facebookUrl: 'https://www.facebook.com/profile.php?id=61569349703465',
      shippingFeeKobo: 1500000, // ₦15,000 standard delivery
      freeShippingThresholdKobo: 30000000, // Free delivery over ₦300,000
      announcementText: 'Discover stylish furniture and quality electronics in Umuahia.',
      announcementActive: true,
      updatedAt: new Date().toISOString(),
    };

    this.seedDefaults();
  }

  private seedDefaults() {
    // Categories
    const categoriesData: Category[] = [
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

    for (const cat of categoriesData) {
      this.categories.set(cat.id, cat);
    }

    // Products & Variations
    const productsData: Product[] = [
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
            additionalPriceKobo: 6500000, // +₦65,000 -> ₦515,000
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
            additionalPriceKobo: 9500000, // +₦95,000 -> ₦545,000
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
            additionalPriceKobo: 18000000, // +₦180,000 -> ₦800,000
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
            additionalPriceKobo: 6000000, // +₦60,000 -> ₦300,000
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
            additionalPriceKobo: 11500000, // +₦115,000 -> ₦400,000
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
            additionalPriceKobo: 29500000, // +₦295,000 -> ₦580,000
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
            additionalPriceKobo: 16000000, // +₦160,000 -> ₦640,000
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
            additionalPriceKobo: 10500000, // +₦105,000 -> ₦300,000
            stockCount: 5,
            image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
            isActive: true,
          },
        ],
      },
    ];

    for (const prod of productsData) {
      this.products.set(prod.id, prod);
    }

    // Discount Codes
    const discountCodesData: DiscountCode[] = [
      {
        id: 'disc-welcome10',
        code: 'WELCOME10',
        discountPercentage: 10,
        isActive: true,
        minimumOrderKobo: 5000000, // ₦50,000
        maximumUses: 500,
        usedCount: 0,
      },
      {
        id: 'disc-umuahia5',
        code: 'UMUAHIA5',
        discountPercentage: 5,
        isActive: true,
        minimumOrderKobo: 2000000, // ₦20,000
        maximumUses: 1000,
        usedCount: 0,
      },
    ];

    for (const code of discountCodesData) {
      this.discountCodes.set(code.code, code);
    }

    // Default Admin Users
    this.adminUsers.set('admin@frankman.ng', {
      id: 'admin-1',
      email: 'admin@frankman.ng',
      name: 'Frankman Admin',
      role: 'SUPER_ADMIN',
      passwordHash: hashPassword('FrankmanAdmin2026!'),
    });
    this.adminUsers.set('realitydesign5561@gmail.com', {
      id: 'admin-2',
      email: 'realitydesign5561@gmail.com',
      name: 'Frankman Showroom Admin',
      role: 'SUPER_ADMIN',
      passwordHash: hashPassword('FrankmanAdmin2026!'),
    });
  }

  // --- PUBLIC API METHODS ---

  public getCategories(): Category[] {
    return Array.from(this.categories.values()).filter((c) => c.isActive);
  }

  public getAllCategoriesAdmin(): Category[] {
    return Array.from(this.categories.values());
  }

  public getProducts(filters?: {
    categorySlug?: string;
    search?: string;
    minPriceKobo?: number;
    maxPriceKobo?: number;
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'featured';
    inStockOnly?: boolean;
    limit?: number;
    offset?: number;
  }): { products: Product[]; total: number } {
    let list = Array.from(this.products.values()).filter((p) => p.isActive);

    // Category filter
    if (filters?.categorySlug) {
      const category = Array.from(this.categories.values()).find(
        (c) => c.slug.toLowerCase() === filters.categorySlug!.toLowerCase()
      );
      if (category) {
        list = list.filter((p) => p.categoryId === category.id);
      }
    }

    // Search query
    if (filters?.search && filters.search.trim()) {
      const query = filters.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
          p.sku.toLowerCase().includes(query)
      );
    }

    // Price range
    if (filters?.minPriceKobo !== undefined) {
      list = list.filter((p) => p.basePriceKobo >= filters.minPriceKobo!);
    }
    if (filters?.maxPriceKobo !== undefined && filters.maxPriceKobo > 0) {
      list = list.filter((p) => p.basePriceKobo <= filters.maxPriceKobo!);
    }

    // In-stock only
    if (filters?.inStockOnly) {
      list = list.filter((p) =>
        p.variations.some((v) => v.isActive && v.stockCount > 0)
      );
    }

    // Sorting
    if (filters?.sortBy === 'price-asc') {
      list.sort((a, b) => a.basePriceKobo - b.basePriceKobo);
    } else if (filters?.sortBy === 'price-desc') {
      list.sort((a, b) => b.basePriceKobo - a.basePriceKobo);
    } else if (filters?.sortBy === 'featured') {
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    // Attach category object for convenience
    const enriched = paginated.map((p) => ({
      ...p,
      category: this.categories.get(p.categoryId),
    }));

    return { products: enriched, total };
  }

  public getProductBySlug(slug: string): Product | null {
    const prod = Array.from(this.products.values()).find(
      (p) => p.slug.toLowerCase() === slug.toLowerCase() && p.isActive
    );
    if (!prod) return null;
    return {
      ...prod,
      category: this.categories.get(prod.categoryId),
    };
  }

  public getStoreSettings(): StoreSettings {
    return { ...this.storeSettings };
  }

  // --- DISCOUNT VALIDATION ---

  public validateDiscount(codeStr: string, subtotalKobo: number): {
    valid: boolean;
    discountCode?: DiscountCode;
    discountPercentage: number;
    discountAmountKobo: number;
    message: string;
  } {
    const code = this.discountCodes.get(codeStr.toUpperCase().trim());
    if (!code || !code.isActive) {
      return {
        valid: false,
        discountPercentage: 0,
        discountAmountKobo: 0,
        message: 'Invalid or expired discount code.',
      };
    }

    if (code.startsAt && new Date() < new Date(code.startsAt)) {
      return {
        valid: false,
        discountPercentage: 0,
        discountAmountKobo: 0,
        message: 'Discount code is not active yet.',
      };
    }

    if (code.expiresAt && new Date() > new Date(code.expiresAt)) {
      return {
        valid: false,
        discountPercentage: 0,
        discountAmountKobo: 0,
        message: 'Discount code has expired.',
      };
    }

    if (code.maximumUses && code.usedCount >= code.maximumUses) {
      return {
        valid: false,
        discountPercentage: 0,
        discountAmountKobo: 0,
        message: 'Discount code usage limit has been reached.',
      };
    }

    if (code.minimumOrderKobo > 0 && subtotalKobo < code.minimumOrderKobo) {
      return {
        valid: false,
        discountPercentage: 0,
        discountAmountKobo: 0,
        message: `This code requires a minimum order of ₦${(code.minimumOrderKobo / 100).toLocaleString()}.`,
      };
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

  // --- TRANSACTIONAL CHECKOUT ---

  public async processCheckout(data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: string;
    deliveryCity: string;
    deliveryState: string;
    deliveryCountry: string;
    deliveryInstructions?: string | null;
    discountCode?: string | null;
    items: Array<{ productId: string; variationId?: string | null; quantity: number }>;
    idempotencyKey?: string;
    paymentMethod?: string;
    paymentStatus?: PaymentStatus;
    paystackReference?: string | null;
    paymentChannel?: string | null;
  }): Promise<{
    success: boolean;
    order?: Order;
    error?: string;
  }> {
    // 1. Idempotency check
    if (data.idempotencyKey && this.orderIdempotencyMap.has(data.idempotencyKey)) {
      const existingOrderNum = this.orderIdempotencyMap.get(data.idempotencyKey)!;
      const existingOrder = Array.from(this.orders.values()).find(
        (o) => o.orderNumber === existingOrderNum
      );
      if (existingOrder) {
        return { success: true, order: existingOrder };
      }
    }

    // 2. Validate items array
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty cart.' };
    }

    // 3. Atomically check products, variations, and stock
    let calculatedSubtotalKobo = 0;
    const preparedOrderItems: OrderItem[] = [];
    const stockReservations: Array<{
      product: Product;
      variation: ProductVariation;
      requestedQty: number;
    }> = [];

    for (const cartItem of data.items) {
      const product = this.products.get(cartItem.productId);
      if (!product || !product.isActive) {
        return {
          success: false,
          error: `Product is unavailable or no longer in catalog: ID ${cartItem.productId}`,
        };
      }

      // Check variation
      let variation: ProductVariation | undefined;
      if (cartItem.variationId) {
        variation = product.variations.find((v) => v.id === cartItem.variationId);
      } else if (product.variations.length > 0) {
        // default to first active variation
        variation = product.variations.find((v) => v.isActive);
      }

      if (!variation || !variation.isActive) {
        return {
          success: false,
          error: `Selected variation is unavailable for "${product.name}".`,
        };
      }

      // Stock check
      if (variation.stockCount < cartItem.quantity) {
        return {
          success: false,
          error: `Insufficient stock for "${product.name} (${variation.name})". Only ${variation.stockCount} available.`,
        };
      }

      const unitPriceKobo = calculateVariationPrice(
        product.basePriceKobo,
        variation.additionalPriceKobo
      );
      const lineTotalKobo = unitPriceKobo * cartItem.quantity;
      calculatedSubtotalKobo += lineTotalKobo;

      stockReservations.push({
        product,
        variation,
        requestedQty: cartItem.quantity,
      });

      preparedOrderItems.push({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        orderId: '', // set after order creation
        productId: product.id,
        productVariationId: variation.id,
        productNameSnapshot: product.name,
        variationSnapshot: variation.name,
        skuSnapshot: variation.sku,
        unitPriceKobo,
        quantity: cartItem.quantity,
        lineTotalKobo,
        createdAt: new Date().toISOString(),
      });
    }

    // 4. Calculate discount if code provided
    let discountAmountKobo = 0;
    let appliedDiscountCode: DiscountCode | undefined;

    if (data.discountCode && data.discountCode.trim()) {
      const discountValidation = this.validateDiscount(
        data.discountCode,
        calculatedSubtotalKobo
      );
      if (discountValidation.valid && discountValidation.discountCode) {
        discountAmountKobo = discountValidation.discountAmountKobo;
        appliedDiscountCode = discountValidation.discountCode;
        // increment usage
        appliedDiscountCode.usedCount += 1;
      }
    }

    // 5. Calculate delivery fee
    const deliveryFeeKobo =
      calculatedSubtotalKobo >= this.storeSettings.freeShippingThresholdKobo
        ? 0
        : this.storeSettings.shippingFeeKobo;

    // 6. Calculate total amount
    const totals = calculateOrderTotal(
      calculatedSubtotalKobo,
      discountAmountKobo,
      deliveryFeeKobo
    );

    // 7. Generate unpredictable unique order number
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `FF-${new Date().getFullYear()}-${randomHex}`;
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Set orderId on order items
    for (const item of preparedOrderItems) {
      item.orderId = orderId;
    }

    // 8. Atomic stock deduction & inventory movement logging
    for (const res of stockReservations) {
      const prevStock = res.variation.stockCount;
      res.variation.stockCount -= res.requestedQty;
      const newStock = res.variation.stockCount;

      this.inventoryMovements.unshift({
        id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        variationId: res.variation.id,
        productName: res.product.name,
        variationName: res.variation.name,
        change: -res.requestedQty,
        previousStock: prevStock,
        newStock,
        reason: `Checkout order ${orderNumber}`,
        createdAt: new Date().toISOString(),
      });
    }

    // 9. Build order record
    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      deliveryAddress: data.deliveryAddress,
      deliveryCity: data.deliveryCity,
      deliveryState: data.deliveryState,
      deliveryCountry: data.deliveryCountry,
      deliveryInstructions: data.deliveryInstructions || null,
      subtotalKobo: totals.subtotalKobo,
      discountAmountKobo: totals.discountKobo,
      deliveryFeeKobo: totals.deliveryFeeKobo,
      totalAmountKobo: totals.totalKobo,
      discountCodeId: appliedDiscountCode?.id || null,
      discountCodeApplied: appliedDiscountCode?.code || null,
      paymentMethod: data.paymentMethod || (data.paymentStatus === 'PAID' ? 'PAYSTACK_ONLINE' : 'PAYSTACK_PENDING'),
      paymentStatus: data.paymentStatus || 'PENDING',
      orderStatus: data.paymentStatus === 'PAID' ? 'CONFIRMED' : 'PENDING',
      items: preparedOrderItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.set(newOrder.orderNumber, newOrder);

    if (data.idempotencyKey) {
      this.orderIdempotencyMap.set(data.idempotencyKey, newOrder.orderNumber);
    }

    return {
      success: true,
      order: newOrder,
    };
  }

  public markOrderAsPaid(orderNumber: string, reference: string, channel: string = 'CARD'): Order | null {
    const order = this.orders.get(orderNumber);
    if (!order) return null;
    order.paymentStatus = 'PAID';
    order.orderStatus = 'CONFIRMED';
    order.paymentMethod = `PAYSTACK (${channel.toUpperCase()})`;
    order.updatedAt = new Date().toISOString();
    return { ...order };
  }

  public getOrderByReference(reference: string): Order | null {
    const order = this.orders.get(reference.toUpperCase().trim());
    return order ? { ...order } : null;
  }

  // --- ADMIN METHODS ---

  public verifyAdminLogin(email: string, password: string): { success: boolean; user?: { id: string; email: string; name: string; role: string }; error?: string } {
    const admin = this.adminUsers.get(email.toLowerCase().trim());
    if (!admin) {
      return { success: false, error: 'Invalid email or password' };
    }

    const hashedInput = hashPassword(password);
    if (hashedInput !== admin.passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }

    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  public getAdminStats(): AdminStats {
    const allProducts = Array.from(this.products.values());
    const allOrders = Array.from(this.orders.values());

    const activeProducts = allProducts.filter((p) => p.isActive).length;
    const pendingOrders = allOrders.filter((o) => o.paymentStatus === 'PENDING').length;
    const paidOrders = allOrders.filter((o) => o.paymentStatus === 'PAID').length;

    let totalPaidRevenueKobo = 0;
    let totalPendingRevenueKobo = 0;

    for (const order of allOrders) {
      if (order.paymentStatus === 'PAID') {
        totalPaidRevenueKobo += order.totalAmountKobo;
      } else if (order.paymentStatus === 'PENDING') {
        totalPendingRevenueKobo += order.totalAmountKobo;
      }
    }

    let lowStockItemsCount = 0;
    for (const p of allProducts) {
      for (const v of p.variations) {
        if (v.isActive && v.stockCount <= 5) {
          lowStockItemsCount++;
        }
      }
    }

    return {
      totalProducts: allProducts.length,
      activeProducts,
      totalOrders: allOrders.length,
      pendingOrders,
      paidOrders,
      totalPaidRevenueKobo,
      totalPendingRevenueKobo,
      lowStockItemsCount,
    };
  }

  public getAdminOrders(filters?: {
    orderStatus?: string;
    paymentStatus?: string;
    search?: string;
  }): Order[] {
    let list = Array.from(this.orders.values());

    if (filters?.orderStatus && filters.orderStatus !== 'ALL') {
      list = list.filter((o) => o.orderStatus === filters.orderStatus);
    }
    if (filters?.paymentStatus && filters.paymentStatus !== 'ALL') {
      list = list.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.customerPhone.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return list;
  }

  public updateOrderStatus(
    orderNumber: string,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus
  ): Order | null {
    const order = this.orders.get(orderNumber);
    if (!order) return null;

    order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = new Date().toISOString();
    return { ...order };
  }

  public getAllProductsAdmin(): Product[] {
    return Array.from(this.products.values()).map((p) => ({
      ...p,
      category: this.categories.get(p.categoryId),
    }));
  }

  public upsertProduct(productData: Partial<Product>): Product {
    const id = productData.id || `prod-${Date.now()}`;
    const existing = this.products.get(id);

    const updated: Product = {
      id,
      name: productData.name || existing?.name || 'Untitled Product',
      slug: productData.slug || existing?.slug || `prod-${Date.now()}`,
      description: productData.description || existing?.description || '',
      shortDescription: productData.shortDescription || existing?.shortDescription || null,
      basePriceKobo: productData.basePriceKobo ?? existing?.basePriceKobo ?? 0,
      sku: productData.sku || existing?.sku || `SKU-${Date.now()}`,
      isActive: productData.isActive !== undefined ? productData.isActive : (existing?.isActive ?? true),
      isFeatured: productData.isFeatured !== undefined ? productData.isFeatured : (existing?.isFeatured ?? false),
      categoryId: productData.categoryId || existing?.categoryId || 'cat-furniture',
      images: productData.images || existing?.images || ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'],
      variations: productData.variations || existing?.variations || [],
      specifications: productData.specifications || existing?.specifications || null,
      seoTitle: productData.seoTitle || existing?.seoTitle || null,
      seoDescription: productData.seoDescription || existing?.seoDescription || null,
      updatedAt: new Date().toISOString(),
      createdAt: existing?.createdAt || new Date().toISOString(),
    };

    this.products.set(id, updated);
    return { ...updated, category: this.categories.get(updated.categoryId) };
  }

  public deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  public updateVariationStock(
    variationId: string,
    newStock: number,
    reason: string = 'Admin adjustment'
  ): boolean {
    for (const prod of this.products.values()) {
      const variation = prod.variations.find((v) => v.id === variationId);
      if (variation) {
        const prev = variation.stockCount;
        variation.stockCount = Math.max(0, newStock);
        this.inventoryMovements.unshift({
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          variationId: variation.id,
          productName: prod.name,
          variationName: variation.name,
          change: variation.stockCount - prev,
          previousStock: prev,
          newStock: variation.stockCount,
          reason,
          createdAt: new Date().toISOString(),
        });
        return true;
      }
    }
    return false;
  }

  public getInventoryMovements(): InventoryMovementRecord[] {
    return [...this.inventoryMovements];
  }

  public getDiscountCodesAdmin(): DiscountCode[] {
    return Array.from(this.discountCodes.values());
  }

  public upsertDiscountCode(codeData: Partial<DiscountCode>): DiscountCode {
    const codeKey = (codeData.code || '').toUpperCase().trim();
    const existing = this.discountCodes.get(codeKey);

    const updated: DiscountCode = {
      id: existing?.id || `disc-${Date.now()}`,
      code: codeKey,
      discountPercentage: codeData.discountPercentage ?? existing?.discountPercentage ?? 10,
      isActive: codeData.isActive !== undefined ? codeData.isActive : (existing?.isActive ?? true),
      startsAt: codeData.startsAt ?? existing?.startsAt ?? null,
      expiresAt: codeData.expiresAt ?? existing?.expiresAt ?? null,
      minimumOrderKobo: codeData.minimumOrderKobo ?? existing?.minimumOrderKobo ?? 0,
      maximumUses: codeData.maximumUses ?? existing?.maximumUses ?? null,
      usedCount: existing?.usedCount ?? 0,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.discountCodes.set(codeKey, updated);
    return updated;
  }

  public updateStoreSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.storeSettings = {
      ...this.storeSettings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.storeSettings };
  }
}

// Global Singleton
const globalForDataStore = globalThis as unknown as {
  frankmanDataStore?: FrankmanDataStore;
};

export const dataStore = globalForDataStore.frankmanDataStore ?? new FrankmanDataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForDataStore.frankmanDataStore = dataStore;
}
