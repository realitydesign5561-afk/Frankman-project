// Prisma Seed Script for Frankman Furniture & Electronics
// Run with: npx prisma db seed or tsx prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = 'frankman_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export const initialCategories = [
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

export const initialProducts = [
  {
    id: 'prod-modern-luxury-sofa',
    name: 'Modern Luxury Sofa',
    slug: 'modern-luxury-sofa',
    shortDescription: 'Sumptuous ergonomic modular sofa with deep cushioning and durable hardwood framing.',
    description: 'Crafted for distinguished living spaces in Umuahia and beyond, the Modern Luxury Sofa combines deep memory-foam cushioning with resilient high-density foam and kiln-dried tropical hardwood framing. Its tailored silhouette and premium upholstery resist wear while providing exceptional lumbar and seating support.',
    basePriceKobo: BigInt(45000000), // ₦450,000
    sku: 'FMN-FUR-SOF-001',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      material: 'Kiln-dried hardwood frame, high-density foam, stain-resistant woven upholstery',
      dimensions: '240cm (W) x 100cm (D) x 85cm (H)',
      seatingCapacity: '3-4 Adults',
      weightCapacity: '400 kg',
      roomType: 'Living Room',
      warranty: '3-Year Frame Integrity Guarantee',
    }),
    seoTitle: 'Modern Luxury Sofa in Umuahia | Frankman Furniture',
    seoDescription: 'Shop the Modern Luxury Sofa in Umuahia. Premium upholstery, kiln-dried hardwood framing, and modular variations available at Frankman Furniture & Electronics.',
    variations: [
      {
        id: 'var-sofa-grey',
        sku: 'FMN-FUR-SOF-001-GRY',
        name: 'Charcoal Grey Weave',
        attributes: JSON.stringify({ color: 'Charcoal Grey', material: 'Textured Weave', size: 'Standard 3-Seater' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 8,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-sofa-mahogany',
        sku: 'FMN-FUR-SOF-001-MAH',
        name: 'Mahogany Tan Leather',
        attributes: JSON.stringify({ color: 'Mahogany Tan', material: 'Top-Grain Leatherette', size: 'Standard 3-Seater' }),
        additionalPriceKobo: BigInt(6500000), // +₦65,000 -> ₦515,000
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-sofa-black',
        sku: 'FMN-FUR-SOF-001-BLK',
        name: 'Classic Black Velvet',
        attributes: JSON.stringify({ color: 'Classic Black', material: 'Plush Velvet', size: 'Extra-Wide 4-Seater' }),
        additionalPriceKobo: BigInt(9500000), // +₦95,000 -> ₦545,000
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
    basePriceKobo: BigInt(62000000), // ₦620,000
    sku: 'FMN-FUR-DIN-002',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      material: 'Solid hardwood timber, polyurethane scratch-resistant coating, brushed brass feet',
      tableDimensions: '200cm (L) x 95cm (W) x 76cm (H)',
      chairDimensions: '52cm (W) x 58cm (D) x 88cm (H)',
      finish: 'Natural walnut with clear satin seal',
      roomType: 'Dining Room',
    }),
    seoTitle: 'Premium Dining Set in Umuahia | Frankman Furniture & Electronics',
    seoDescription: 'Handcrafted premium dining table sets in Umuahia, Abia State. Available in 6-seater and 8-seater configurations with cushioned seating.',
    variations: [
      {
        id: 'var-dining-6seat',
        sku: 'FMN-FUR-DIN-002-6ST',
        name: '6-Seater Solid Oak Set',
        attributes: JSON.stringify({ configuration: '6 Chairs + Table', timber: 'Solid Oak', finish: 'Honey Oak' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 6,
        image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-dining-8seat',
        sku: 'FMN-FUR-DIN-002-8ST',
        name: '8-Seater Executive Walnut Set',
        attributes: JSON.stringify({ configuration: '8 Chairs + Extended Table', timber: 'Rich Walnut', finish: 'Dark Walnut' }),
        additionalPriceKobo: BigInt(18000000), // +₦180,000 -> ₦800,000
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
    basePriceKobo: BigInt(24000000), // ₦240,000
    sku: 'FMN-FUR-CON-003',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-furniture',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      material: 'Walnut veneer, powder-coated steel base, fluted MDF fronts',
      dimensions: '180cm (W) x 42cm (D) x 50cm (H)',
      maxTvSupport: 'Up to 85 inches',
      features: 'Soft-close hinges, internal cable raceways, rear ventilation slits',
      roomType: 'Living Room / Media Room',
    }),
    seoTitle: 'Contemporary TV Console | Frankman Furniture Umuahia',
    seoDescription: 'Premium fluted TV console in Umuahia. Solid media console with cable management and luxury finishes.',
    variations: [
      {
        id: 'var-console-65',
        sku: 'FMN-FUR-CON-003-65W',
        name: 'Walnut & Brass 65" (180cm)',
        attributes: JSON.stringify({ finish: 'Natural Walnut', hardware: 'Brushed Brass', size: '180cm Width' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 7,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-console-75',
        sku: 'FMN-FUR-CON-003-75A',
        name: 'Dark Ash & Smoked Glass 75" (220cm)',
        attributes: JSON.stringify({ finish: 'Dark Charcoal Ash', hardware: 'Matte Black', size: '220cm Width' }),
        additionalPriceKobo: BigInt(6000000), // +₦60,000 -> ₦300,000
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
    basePriceKobo: BigInt(28500000), // ₦285,000 (43-inch)
    sku: 'FMN-ELE-TV-004',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      displayResolution: '3840 x 2160 (4K Ultra HD)',
      refreshRate: '120Hz Motion Smooth',
      audioOutput: '20W Dolby Digital Plus',
      smartOS: 'Google TV with Play Store, Netflix, YouTube, Prime Video',
      connectivity: '3x HDMI 2.1, 2x USB, Optical Out, Dual-Band WiFi, Bluetooth 5.2',
      voltage: '100-240V ~ 50/60Hz with Built-in Surge Protection',
    }),
    seoTitle: 'Smart LED Television in Umuahia | Frankman Electronics',
    seoDescription: 'Buy 43", 55", and 65" 4K Smart TVs in Umuahia, Abia State. Frankman Furniture & Electronics offers premium television brands and local support.',
    variations: [
      {
        id: 'var-tv-43',
        sku: 'FMN-ELE-TV-004-43U',
        name: '43-Inch 4K UHD Smart Display',
        attributes: JSON.stringify({ screenSize: '43 Inch', panel: 'Direct LED 4K UHD', hdr: 'HDR10' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 12,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-tv-55',
        sku: 'FMN-ELE-TV-004-55Q',
        name: '55-Inch 4K Quantum Smart Display',
        attributes: JSON.stringify({ screenSize: '55 Inch', panel: 'Quantum Dot QLED 4K', hdr: 'Dolby Vision & HDR10+' }),
        additionalPriceKobo: BigInt(11500000), // +₦115,000 -> ₦400,000
        stockCount: 9,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-tv-65',
        sku: 'FMN-ELE-TV-004-65O',
        name: '65-Inch OLED Cinematic Display',
        attributes: JSON.stringify({ screenSize: '65 Inch', panel: 'OLED Self-Lit Pixels 120Hz', hdr: 'Cinematic Master HDR' }),
        additionalPriceKobo: BigInt(29500000), // +₦295,000 -> ₦580,000
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
    basePriceKobo: BigInt(48000000), // ₦480,000 (320L)
    sku: 'FMN-ELE-REF-005',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584269600519-112d071b35e6?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      coolingTechnology: 'Digital Smart Inverter Compressor (Super Quiet 37dB)',
      powerCutRetention: 'Up to 10 Hours Frost Defense',
      energyRating: '5-Star Energy Efficiency (Up to 45% Energy Savings)',
      refrigerant: 'Eco-friendly R600a',
      internalLighting: 'Panoramic LED Tower',
      voltageRange: 'Wide Voltage Operation 135V - 290V (Generator Friendly)',
    }),
    seoTitle: 'Double-Door Inverter Refrigerator in Umuahia | Frankman Electronics',
    seoDescription: 'Energy-efficient double-door refrigerators in Umuahia, Abia State. Generator-friendly inverter compressor and long power-retention cold storage.',
    variations: [
      {
        id: 'var-ref-320',
        sku: 'FMN-ELE-REF-005-320S',
        name: 'Inverter Platinum Silver 320L',
        attributes: JSON.stringify({ capacity: '320 Litres', finish: 'Brushed Platinum Silver', dispenser: 'Internal Twist Ice Maker' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 6,
        image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-ref-450',
        sku: 'FMN-ELE-REF-005-450B',
        name: 'Matte Black Multi-Airflow 450L with Water Dispenser',
        attributes: JSON.stringify({ capacity: '450 Litres', finish: 'Matte Obsidian Black', dispenser: 'External Water Dispenser' }),
        additionalPriceKobo: BigInt(16000000), // +₦160,000 -> ₦640,000
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
    basePriceKobo: BigInt(19500000), // ₦195,000 (5.1 Channel)
    sku: 'FMN-ELE-AUD-006',
    isActive: true,
    isFeatured: true,
    categoryId: 'cat-electronics',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    ]),
    specifications: JSON.stringify({
      totalRMSPower: '600W - 1000W Peak High-Fidelity',
      subwoofer: 'Wireless Down-Firing Active Subwoofer',
      audioDecoding: 'Dolby Audio, DTS Virtual:X, PureVoice dialog enhancement',
      inputs: 'HDMI eARC, Optical, AUX 3.5mm, USB MP3/FLAC playback, Bluetooth 5.3',
      remoteControl: 'Smart Universal Audio Remote with Bass Boost preset',
    }),
    seoTitle: 'Home Entertainment Sound System in Umuahia | Frankman Electronics',
    seoDescription: 'Shop high-power home theater and surround sound audio systems in Umuahia, Abia State at Frankman Furniture & Electronics.',
    variations: [
      {
        id: 'var-audio-51',
        sku: 'FMN-ELE-AUD-006-51W',
        name: '5.1 Surround Sound System (600W)',
        attributes: JSON.stringify({ channel: '5.1 Channels', power: '600W Peak', subwoofer: '8-inch Wireless Subwoofer' }),
        additionalPriceKobo: BigInt(0),
        stockCount: 10,
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
      {
        id: 'var-audio-71',
        sku: 'FMN-ELE-AUD-006-71A',
        name: '7.1 Dolby Atmos Cinema System (1000W)',
        attributes: JSON.stringify({ channel: '7.1 Spatial Atmos', power: '1000W Peak', subwoofer: '10-inch Dual-Driver Subwoofer' }),
        additionalPriceKobo: BigInt(10500000), // +₦105,000 -> ₦300,000
        stockCount: 5,
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
        isActive: true,
      },
    ],
  },
];

export const initialDiscountCodes = [
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    isActive: true,
    minimumOrderKobo: BigInt(5000000), // ₦50,000 minimum
    maximumUses: 500,
    usedCount: 0,
  },
  {
    code: 'UMUAHIA5',
    discountPercentage: 5,
    isActive: true,
    minimumOrderKobo: BigInt(2000000), // ₦20,000 minimum
    maximumUses: 1000,
    usedCount: 0,
  },
];

export const initialStoreSettings = {
  id: 'default',
  businessName: 'Frankman Furniture & Electronics',
  businessDescription: 'Premium furniture and home electronics showroom serving Umuahia, Abia State, Nigeria.',
  logo: '/logo.svg',
  phoneNumber: '+234 803 123 4567',
  whatsappNumber: '+2348031234567',
  email: 'info@frankman.ng',
  businessAddress: 'Umuahia, Abia State, Nigeria',
  city: 'Umuahia',
  state: 'Abia State',
  country: 'Nigeria',
  businessHours: 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61569349703465',
  shippingFeeKobo: BigInt(1500000), // ₦15,000 local delivery
  freeShippingThresholdKobo: BigInt(30000000), // Free delivery over ₦300,000
  announcementText: 'Discover stylish furniture and quality electronics in Umuahia.',
  announcementActive: true,
};

export const initialAdmin = {
  id: 'admin-frankman-1',
  email: 'admin@frankman.ng',
  name: 'Frankman Admin',
  role: 'SUPER_ADMIN',
  passwordHash: hashPassword('FrankmanAdmin2026!'),
};

export async function seed() {
  console.log('Seeding Frankman Furniture & Electronics database...');

  // 1. Categories
  for (const cat of initialCategories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 2. Products and Variations
  for (const prod of initialProducts) {
    const { variations, ...productData } = prod;
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: productData,
      create: productData,
    });

    for (const v of variations) {
      await prisma.productVariation.upsert({
        where: { sku: v.sku },
        update: { ...v, productId: prod.id },
        create: { ...v, productId: prod.id },
      });
    }
  }

  // 3. Discount Codes
  for (const disc of initialDiscountCodes) {
    await prisma.discountCode.upsert({
      where: { code: disc.code },
      update: disc,
      create: disc,
    });
  }

  // 4. Store Settings
  await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: initialStoreSettings,
    create: initialStoreSettings,
  });

  // 5. Admin User
  await prisma.adminUser.upsert({
    where: { email: initialAdmin.email },
    update: {
      name: initialAdmin.name,
      role: initialAdmin.role as any,
      passwordHash: initialAdmin.passwordHash,
    },
    create: {
      id: initialAdmin.id,
      email: initialAdmin.email,
      name: initialAdmin.name,
      role: initialAdmin.role as any,
      passwordHash: initialAdmin.passwordHash,
    },
  });

  console.log('Seed completed successfully!');
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
