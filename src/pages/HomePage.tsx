import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { SafeImage } from '../components/ui/SafeImage';
import { formatNaira } from '../lib/pricing';
import { useCartStore } from '../store/cart-store';
import { clientStore } from '../lib/client-store';
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Star,
  Tv,
  Armchair,
  MessageCircle,
  Play,
  Heart,
  Headphones,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(() => clientStore.getProducts());
  const [loading, setLoading] = useState(true);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { addItem } = useCartStore();

  useEffect(() => {
    fetch('/api/products?sortBy=featured&limit=12')
      .then((res) => {
        if (!res.ok) throw new Error('API non-200');
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback to clientStore for offline/Vercel resilience
        setFeaturedProducts(clientStore.getProducts());
      })
      .finally(() => setLoading(false));
  }, []);

  const collectionTabs = [
    { id: 'all', label: 'All Collections' },
    { id: 'living', label: 'Chairs & Sofas' },
    { id: 'dining', label: 'Dining Suites' },
    { id: 'consoles', label: 'TV & Consoles' },
    { id: 'electronics', label: 'Smart Electronics' },
  ];

  const filteredProducts = featuredProducts.filter((p) => {
    if (activeCollectionTab === 'all') return true;
    if (activeCollectionTab === 'living') return p.categoryId === 'cat-furniture' && (p.slug.includes('sofa') || p.slug.includes('chair'));
    if (activeCollectionTab === 'dining') return p.categoryId === 'cat-furniture' && p.slug.includes('dining');
    if (activeCollectionTab === 'consoles') return p.categoryId === 'cat-furniture' && p.slug.includes('console');
    if (activeCollectionTab === 'electronics') return p.categoryId === 'cat-electronics';
    return true;
  });

  const faqs = [
    {
      q: 'Where is Frankman Furniture & Electronics located in Umuahia?',
      a: 'Our physical showroom is conveniently situated at 14 Aba Road / City Center, Umuahia, Abia State, Nigeria. We welcome visits Monday through Saturday from 8:30 AM to 6:30 PM for personal furniture inspection, fabric selections, and live electronics demonstrations.',
    },
    {
      q: 'How does the Paystack payment work (Card, Bank Transfer, USSD)?',
      a: 'We have integrated Paystack directly into checkout. You can securely pay with any Nigerian debit card (Mastercard, Visa, Verve), instant Bank Transfer to a dedicated virtual account (Wema Bank/Titan Trust), USSD banking code (*737#, *901#), or online banking.',
    },
    {
      q: 'Do you deliver to new properties, duplexes, and estates across Nigeria?',
      a: 'Yes! We specialize in residential and commercial property furnishing. Within Umuahia, we deliver within 24–48 hours with our dedicated setup team. We also arrange secured door-to-door transit to Aba, Owerri, Port Harcourt, Enugu, Asaba, Lagos, and Abuja with protective blanket padding.',
    },
    {
      q: 'What is your timber seasoning and anti-termite guarantee?',
      a: 'Every timber piece is kiln-dried and treated with high-grade organic preservatives that repel wood boring insects and termites. Our structural hardwood frames carry a multi-year structural integrity guarantee.',
    },
    {
      q: 'Are your electronics generator-friendly and protected from voltage surges?',
      a: 'Yes! All Frankman televisions, inverter refrigerators, and audio systems are selected specifically for Nigerian electrical realities. They feature wide-voltage operation (135V–290V) and low power consumption suitable for home generators and solar inverter systems.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Emeka Nwosu',
      role: 'Homeowner, World Bank Housing Estate, Umuahia',
      comment:
        'Frankman furnished our entire 5-bedroom duplex in Umuahia. The solid oak dining set and ergonomic modular sofa exceeded expectations. Prompt delivery and courteous installation team.',
      rating: 5,
    },
    {
      name: 'Arc. Chioma Adebayo',
      role: 'Principal Interior Architect, Port Harcourt',
      comment:
        'As an architect designing modern residences across the South-East and Rivers State, I recommend Frankman for custom finishes. Their timber is truly kiln-dried with zero warping or pest issues.',
      rating: 5,
    },
    {
      name: 'Chief Kenneth Okoli',
      role: 'Property Investor, Aba Commercial District',
      comment:
        'The inverter double-door refrigerator and 65-inch 4K TV run effortlessly on our solar inverter. The online Paystack checkout made bank transfer instant and straightforward.',
      rating: 5,
    },
  ];

  const cleanWhatsappPhone = whatsappNumber.replace(/[^0-9]/g, '');
  const heroWhatsappUrl = `https://wa.me/${cleanWhatsappPhone}?text=${encodeURIComponent(
    'Hello Frankman Furniture & Electronics, I am contacting you from your showroom website regarding property furnishing and electronics inquiry in Umuahia.'
  )}`;

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 bg-[#FAF8F5]">
      {/* 1. HERO SECTION (Matching exact Névo design with editorial serif & warm gold palette) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typography, CTAs & Social Proof */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Kicker Tracker */}
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-[#B58235]">
                MODERN LIVING, TIMELESS COMFORT
              </span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.12] tracking-tight">
              Design Your Space For A Better <span className="italic text-[#B58235]">Tomorrow</span>
            </h1>

            {/* Subtitle Prose */}
            <p className="text-sm sm:text-base text-stone-600 max-w-xl font-normal leading-relaxed">
              Nigeria's premier destination for handcrafted kiln-dried hardwood furniture, smart 4K TVs, and inverter electronics. Tailored for distinguished homes and estates in Umuahia and nationwide.
            </p>

            {/* CTAs matching the Névo pill button */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              {/* Primary Shop Now Pill */}
              <button
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer min-h-[48px]"
              >
                <span>Shop Now</span>
                <div className="w-6 h-6 rounded-full bg-white text-[#B58235] flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Secondary WhatsApp Showroom Tour Button */}
              <a
                href={heroWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3.5 bg-white hover:bg-stone-50 text-stone-800 border border-[#EAE5DC] rounded-full text-xs sm:text-sm font-semibold shadow-2xs transition-all min-h-[48px]"
              >
                <div className="w-6 h-6 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <span>WhatsApp Desk</span>
              </a>
            </div>

            {/* Social Proof Avatar Stack & 4.9/5 Rating */}
            <div className="pt-4 flex items-center gap-4 border-t border-[#EAE5DC]/80">
              <div className="flex -space-x-2.5 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Customer avatar"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Customer avatar"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Customer avatar"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-stone-900">4.9/5.0</span>
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  450+ Verified Reviews from Nigerian homeowners
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card with Floating Accent Pieces */}
          <div className="lg:col-span-6 relative">
            {/* Main Rounded Hero Frame */}
            <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-stone-100 border border-[#EAE5DC] shadow-sm aspect-4/3 sm:aspect-5/4">
              <SafeImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
                alt="Frankman Luxury Living Room and Electronics Showroom in Umuahia Nigeria"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Overlay pill: Explore Collection ↗ */}
              <button
                onClick={() => onNavigate('/shop/furniture')}
                className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-xs font-semibold text-stone-900 shadow-md hover:bg-white transition-all cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#B58235]" />
              </button>
            </div>

            {/* Side Floating Product Highlight Card (Lounge Chair) */}
            <div
              onClick={() => onNavigate('/product/modern-luxury-sofa')}
              className="absolute -bottom-6 sm:-bottom-8 right-3 sm:right-6 bg-white rounded-2xl border border-[#EAE5DC] p-3 shadow-lg flex items-center gap-3.5 max-w-xs cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                <SafeImage
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80"
                  alt="Modern Luxury Sofa"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-stone-900 block truncate">
                  Modular Living Sofa
                </span>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-stone-700">4.9 (120 reviews)</span>
                </div>
                <span className="text-xs font-bold text-[#B58235] tabular-nums">
                  ₦450,000
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#B58235] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR (4 Golden Circular Pillars matching Névo reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#EAE5DC] rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Free Shipping */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FDF8EE] text-[#B58235] flex items-center justify-center shrink-0 border border-[#EBD8B8]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Free Fast Delivery</h4>
                <p className="text-[11px] text-stone-500">Orders over ₦300k across Nigeria</p>
              </div>
            </div>

            {/* 2. Secure Paystack Payment */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FDF8EE] text-[#B58235] flex items-center justify-center shrink-0 border border-[#EBD8B8]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Paystack Secure Payment</h4>
                <p className="text-[11px] text-stone-500">Cards, Instant Transfer, USSD & QR</p>
              </div>
            </div>

            {/* 3. 24/7 Dedicated Support */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FDF8EE] text-[#B58235] flex items-center justify-center shrink-0 border border-[#EBD8B8]">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">24/7 Showroom Support</h4>
                <p className="text-[11px] text-stone-500">Direct WhatsApp consultation desk</p>
              </div>
            </div>

            {/* 4. 3-Year Hardwood Warranty */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FDF8EE] text-[#B58235] flex items-center justify-center shrink-0 border border-[#EBD8B8]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">3-Year Frame Warranty</h4>
                <p className="text-[11px] text-stone-500">100% Kiln-dried & anti-termite</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STATS STRIP (Clean editorial metrics) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-2xs">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              1,200+
            </span>
            <span className="text-xs text-stone-500 font-medium block mt-1">
              Happy Home Owners
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-2xs">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              150+
            </span>
            <span className="text-xs text-stone-500 font-medium block mt-1">
              Showroom Designs & Pieces
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-2xs">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 tabular-nums">
              98%
            </span>
            <span className="text-xs text-stone-500 font-medium block mt-1">
              Customer Recommendation
            </span>
          </div>
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 shadow-2xs">
            <span className="font-heading text-2xl sm:text-3xl font-bold text-[#B58235] tabular-nums">
              100%
            </span>
            <span className="text-xs text-stone-500 font-medium block mt-1">
              Kiln-Dried Hardwood
            </span>
          </div>
        </div>
      </section>

      {/* 4. FEATURED FURNITURE & ELECTRONICS (Tabbed filter & clean card grid from Névo reference) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
              Curated for Nigerian Homes
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Furniture & Living Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
            Handpicked living room suites, solid timber dining tables, and generator-ready home appliances.
          </p>
        </div>

        {/* Filter Tabs (Segmented pills) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {collectionTabs.map((tab) => {
            const isSelected = activeCollectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCollectionTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer ${
                  isSelected
                    ? 'bg-[#B58235] text-white shadow-xs'
                    : 'bg-white border border-[#EAE5DC] text-stone-700 hover:border-stone-400'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Showcase Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {filteredProducts.map((product) => {
            const primaryImage =
              product.images?.[0] ||
              'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={product.id}
                onClick={() => onNavigate(`/product/${product.slug}`)}
                className="group relative rounded-3xl overflow-hidden bg-white border border-[#EAE5DC] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Visual Area */}
                <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden">
                  <SafeImage
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  {/* Top Right Circular Arrow Icon in Warm Gold */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/95 text-stone-800 shadow-xs flex items-center justify-center group-hover:bg-[#B58235] group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#B58235] mb-1">
                      <span>{product.category?.name || 'Showroom Piece'}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-stone-700 text-[10px]">4.9</span>
                      </div>
                    </div>

                    <h3 className="font-heading text-base font-bold text-stone-900 group-hover:text-[#B58235] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {product.shortDescription && (
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-medium block">
                        Showroom Price
                      </span>
                      <span className="text-base font-bold text-stone-900 tabular-nums">
                        {formatNaira(product.basePriceKobo)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({
                          productId: product.id,
                          variationId: product.variations[0]?.id || null,
                          productName: product.name,
                          variationName: product.variations[0]?.name || null,
                          sku: product.variations[0]?.sku || product.sku,
                          unitPriceKobo: product.basePriceKobo,
                          image: primaryImage,
                          stockAvailable: product.variations[0]?.stockCount || 5,
                          slug: product.slug,
                        });
                      }}
                      className="px-4 py-2 bg-[#FDF8EE] hover:bg-[#B58235] hover:text-white text-[#B58235] text-xs font-semibold rounded-full border border-[#EBD8B8] transition-colors flex items-center gap-1.5 min-h-[36px] cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. "WHY CHOOSE US / TURN HOUSES INTO HOMES" BENTO BANNER (Matching Névo bento) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#EAE5DC] rounded-3xl sm:rounded-[36px] p-6 sm:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                CRAFTED WITH PASSION, BUILT FOR LIFE
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-stone-900 font-bold leading-tight">
                We Turn Nigerian Houses Into Modern Warm Homes
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                With a steadfast commitment to kiln-dried hardwood integrity, low-voltage generator compatibility, and personalized upholstery choices, Frankman creates furniture that lasts generations.
              </p>

              {/* 3 Value Pillars */}
              <div className="pt-2 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B58235] shrink-0 mt-0.5" />
                  <span><strong>100% Kiln-Dried Hardwood:</strong> Moisture-sealed framing that resists warping and wood-boring insects.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B58235] shrink-0 mt-0.5" />
                  <span><strong>Generator & Inverter Friendly:</strong> 4K TVs and refrigerators engineered for stable low-draw power.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B58235] shrink-0 mt-0.5" />
                  <span><strong>Bespoke Dimensions:</strong> Tailor dining and sectional sizes to fit your specific apartment or duplex layout.</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Learn More About Us</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[#EAE5DC] hover:border-stone-400 text-stone-800 rounded-full text-xs font-semibold shadow-2xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <span>Showroom Location</span>
                </button>
              </div>
            </div>

            {/* Right Showcase Photo Bento */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="rounded-2xl overflow-hidden aspect-3/4 bg-stone-100 shadow-xs border border-[#EAE5DC]">
                <SafeImage
                  src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80"
                  alt="Solid timber dining suite in Umuahia"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-3/4 bg-stone-100 shadow-xs border border-[#EAE5DC] mt-6">
                <SafeImage
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80"
                  alt="4K Smart television for Nigerian homes"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED NIGERIAN CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
            Customer Testimonials
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
            Trusted by Nigerian Homes & Interior Professionals
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Read what verified property owners, architects, and residents in Abia State and across Nigeria have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#EAE5DC] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{test.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FDF8EE] text-[#B58235] font-bold text-sm flex items-center justify-center shrink-0 border border-[#EBD8B8]">
                  {test.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {test.name}
                  </span>
                  <span className="text-[11px] text-stone-500 block truncate">
                    {test.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
            Need Assistance?
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Everything you need to know about purchasing, Paystack payment, and delivery in Umuahia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Showroom Visual */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden aspect-4/3 bg-stone-100 border border-[#EAE5DC] shadow-xs hidden sm:block">
            <SafeImage
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
              alt="Comfort bedroom suite and electronics in Umuahia showroom"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`border rounded-2xl transition-all cursor-pointer overflow-hidden ${
                    isOpen
                      ? 'border-[#B58235] bg-white shadow-2xs'
                      : 'border-[#EAE5DC] bg-white hover:border-stone-400'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">
                      {faq.q}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-stone-50 text-stone-700 flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#B58235]" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. SHOWROOM VISIT CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl sm:rounded-[36px] bg-[#1C1917] text-white p-8 sm:p-14 shadow-md space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <span className="text-[11px] uppercase tracking-widest font-semibold text-[#B58235]">
                VISIT FRANKMAN SHOWROOM
              </span>
              <h3 className="font-heading text-2xl sm:text-4xl font-bold leading-snug">
                Let's Furnish Your Space & Make Beautiful Homes!
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md">
                Visit our physical showroom in Umuahia, Abia State or complete your order online with instant Paystack checkout.
              </p>
              <div>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="px-6 py-3.5 bg-[#B58235] hover:bg-[#9E6F2B] text-white rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer min-h-[46px]"
                >
                  Contact Showroom Desk
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-xs text-stone-300">
              <div className="space-y-2">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                  Showroom Address
                </span>
                <p>14 Aba Road / City Center,</p>
                <p>Umuahia, Abia State, Nigeria</p>
                <p>+234 803 123 4567</p>
                <p className="text-[11px] text-stone-400">Mon - Sat: 8:30 AM - 6:30 PM</p>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                  Direct Connect
                </span>
                <p>
                  <a
                    href="https://www.facebook.com/profile.php?id=61569349703465"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-white"
                  >
                    Facebook Profile
                  </a>
                </p>
                <p>
                  <button onClick={() => onNavigate('/shop')} className="hover:underline text-white cursor-pointer">
                    Showroom Catalog
                  </button>
                </p>
                <p>
                  <button onClick={() => onNavigate('/checkout')} className="hover:underline text-white cursor-pointer">
                    Paystack Checkout
                  </button>
                </p>
                <p>
                  <button onClick={() => onNavigate('/admin')} className="hover:underline text-white cursor-pointer">
                    Admin Portal
                  </button>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
            <div className="font-heading text-lg sm:text-2xl tracking-wider text-white uppercase">
              FRANKMAN · UMUAHIA
            </div>
            <span>Where style truly meets comfort</span>
          </div>
        </div>
      </section>
    </div>
  );
};
