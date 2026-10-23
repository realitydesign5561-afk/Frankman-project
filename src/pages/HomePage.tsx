import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { SafeImage } from '../components/ui/SafeImage';
import { formatNaira } from '../lib/pricing';
import { useCartStore } from '../store/cart-store';
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
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCollectionTab, setActiveCollectionTab] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { addItem } = useCartStore();

  useEffect(() => {
    fetch('/api/products?sortBy=featured&limit=12')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setFeaturedProducts(data.products);
        }
      })
      .catch((err) => console.error('Error fetching products:', err))
      .finally(() => setLoading(false));
  }, []);

  const collectionTabs = [
    { id: 'all', label: 'All Collections' },
    { id: 'living', label: 'Living Room' },
    { id: 'dining', label: 'Dining' },
    { id: 'consoles', label: 'TV & Consoles' },
    { id: 'electronics', label: 'Smart TVs' },
    { id: 'appliances', label: 'Cooling & Audio' },
  ];

  const filteredProducts = featuredProducts.filter((p) => {
    if (activeCollectionTab === 'all') return true;
    if (activeCollectionTab === 'living') return p.categoryId === 'cat-furniture' && p.slug.includes('sofa');
    if (activeCollectionTab === 'dining') return p.categoryId === 'cat-furniture' && p.slug.includes('dining');
    if (activeCollectionTab === 'consoles') return p.categoryId === 'cat-furniture' && p.slug.includes('console');
    if (activeCollectionTab === 'electronics') return p.categoryId === 'cat-electronics' && p.slug.includes('television');
    if (activeCollectionTab === 'appliances') return p.categoryId === 'cat-electronics' && !p.slug.includes('television');
    return true;
  });

  const faqs = [
    {
      q: 'Where are you located in Umuahia?',
      a: 'Our physical showroom is conveniently situated in Umuahia, Abia State, Nigeria. We welcome visits Monday through Saturday from 8:30 AM to 6:30 PM for personal furniture inspection, fabric selections, and live electronics demonstrations.',
    },
    {
      q: 'How can I pay using Paystack (Card, Transfer, USSD)?',
      a: 'We have integrated Paystack directly into checkout. You can securely complete your payment with any Nigerian debit/credit card (Mastercard, Visa, Verve), instant Bank Transfer to a generated virtual account, USSD banking code, or direct online bank authorization.',
    },
    {
      q: 'How long does delivery take within Abia State?',
      a: 'Orders within Umuahia are dispatched promptly within 24–48 hours by our specialized delivery team. Deliveries to Aba, Ohafia, and other parts of Abia State typically arrive within 2–3 business days with full transit protection.',
    },
    {
      q: 'What is your product warranty and inspection policy?',
      a: 'Every furniture piece features kiln-dried hardwood framing with a structural integrity warranty. Our electronics come with manufacturer protection and surge-resistant engineering. Customers can inspect all goods upon showroom collection or doorstep delivery.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (Matching "URBAN FURNISH" layout from Screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4">
        <div className="relative rounded-[24px] sm:rounded-[36px] overflow-hidden bg-[#EAE7DF] border border-stone-200/90 shadow-sm min-h-[520px] sm:min-h-[620px] flex flex-col justify-between p-6 sm:p-12">
          {/* Background showroom imagery */}
          <div className="absolute inset-0 z-0">
            <SafeImage
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
              alt="Frankman Urban Living Showroom"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5F3EC]/70 via-[#F5F3EC]/40 to-[#EFECE4]/85" />
          </div>

          {/* Hero Top / Headline Area */}
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[#2E3725] leading-none uppercase">
              URBAN<br />FURNISH
            </h1>

            <p className="text-xs sm:text-sm text-stone-700 max-w-lg mx-auto font-medium leading-relaxed px-2">
              Discover handcrafted pieces that blend comfort, style, and durability. Designed to transform every room into a reflection of you.
            </p>

            {/* Center Pill Action */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={() => onNavigate('/shop')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A5538] hover:bg-[#3D472D] text-white rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-md transition-all transform hover:scale-102"
              >
                <span>Explore Showroom</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Hero Bottom Floating Elements (Responsive for mobile & desktop) */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            {/* Left Floating Product Card */}
            <div
              onClick={() => onNavigate('/product/modern-luxury-sofa')}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/80 p-3 flex items-center gap-3 shadow-lg max-w-xs cursor-pointer hover:bg-white transition-all transform hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0">
                <SafeImage
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"
                  alt="Sofa with Table"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-stone-900 block truncate">
                  Sofa with table 2026
                </span>
                <span className="text-xs font-semibold text-[#4A5538] tabular-nums">
                  ₦450,000
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#4A5538] text-white flex items-center justify-center shrink-0 ml-auto">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Right Feature Callout Tag */}
            <div className="bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-2.5 text-right hidden sm:block shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A5538] block">
                Handcrafted Finishes
              </span>
              <span className="text-xs text-stone-700 font-semibold block">
                100% Solid Kiln-Dried Hardwood
              </span>
              <span className="text-[10px] text-stone-500">
                Umuahia Showroom Stock
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR MOST POPULAR FURNITURE (Asymmetric Bento Grid from Screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="max-w-md">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#4A5538]">
              Featured Collections
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight mt-1">
              Our most <span className="underline decoration-[#4A5538] underline-offset-4">popular furniture</span>, trusted by thousands of happy homes.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 max-w-sm leading-relaxed">
            Discover handcrafted pieces that blend comfort, style, and durability. Designed to transform every room into a reflection of you.
          </p>
        </div>

        {/* Asymmetric 2-Card Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Wide Card */}
          <div
            onClick={() => onNavigate('/shop/furniture')}
            className="md:col-span-7 relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-stone-100 min-h-[340px] sm:min-h-[420px] group cursor-pointer border border-stone-200/90 shadow-sm"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
              alt="Living room popular sofa collection"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Top Right Learn More Button */}
            <div className="absolute top-5 right-5 z-10">
              <button className="px-4 py-2 bg-[#4A5538]/90 hover:bg-[#4A5538] text-white text-xs font-semibold rounded-full shadow-md backdrop-blur-xs transition-colors">
                Learn More
              </button>
            </div>
            {/* Bottom Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                Living Room Upgrade
              </span>
              <h3 className="font-heading text-lg sm:text-xl font-bold">
                Ergonomic Modular Sofas & Natural Timber Coffee Sets
              </h3>
            </div>
          </div>

          {/* Right Tall Accent Card */}
          <div
            onClick={() => onNavigate('/shop/furniture')}
            className="md:col-span-5 relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-stone-100 min-h-[340px] sm:min-h-[420px] group cursor-pointer border border-stone-200/90 shadow-sm"
          >
            <SafeImage
              src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
              alt="Handcrafted dining suites"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute top-5 right-5 z-10">
              <div className="w-9 h-9 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-md group-hover:bg-[#4A5538] group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent text-white">
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                Dining & Hosting
              </span>
              <h3 className="font-heading text-lg font-bold">
                Hand-Finished Oak & Walnut Suites
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE OUR SIGNATURE COLLECTIONS (Filter Pills & Cards from Screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
              Explore Our Signature Collections
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">
              Handpicked pieces designed for comfort, style, and everyday resilience.
            </p>
          </div>
        </div>

        {/* Horizontal Category Filter Pills (Swipable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {collectionTabs.map((tab) => {
            const isSelected = activeCollectionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCollectionTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] ${
                  isSelected
                    ? 'bg-[#4A5538] text-white shadow-xs'
                    : 'bg-[#EDE9E1] text-stone-700 hover:bg-[#E2DDD3]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Showcase Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredProducts.map((product) => {
            const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={product.id}
                onClick={() => onNavigate(`/product/${product.slug}`)}
                className="group relative rounded-[28px] overflow-hidden bg-white border border-stone-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Visual Area */}
                <div className="relative aspect-4/3 w-full bg-[#F5F2EB] overflow-hidden">
                  <SafeImage
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  {/* Circular Arrow Action on Top Right (Exact match to screenshot) */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 rounded-full bg-white/95 text-stone-900 shadow-sm flex items-center justify-center group-hover:bg-[#4A5538] group-hover:text-white transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#4A5538] mb-1">
                      <span>{product.category?.name || 'Showroom Piece'}</span>
                      <span>·</span>
                      <span className="text-stone-400 font-normal">
                        {product.variations.length} options
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold text-stone-900 group-hover:text-[#4A5538] transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {product.shortDescription && (
                      <p className="text-xs text-stone-500 line-clamp-1 mt-1">
                        {product.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-medium block">
                        Price
                      </span>
                      <span className="text-base font-extrabold text-stone-950 tabular-nums">
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
                      className="px-3.5 py-1.5 bg-stone-100 hover:bg-[#4A5538] hover:text-white text-stone-800 text-xs font-semibold rounded-full transition-colors flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SCROLLING MARQUEE TICKER (Matching olive ticker strip from screenshot) */}
      <section className="w-full bg-[#4A5538] text-[#EDE8DE] py-5 sm:py-6 overflow-hidden border-y border-[#3E482F]">
        <div className="flex whitespace-nowrap animate-marquee text-lg sm:text-2xl font-editorial tracking-[0.2em] uppercase font-bold items-center select-none">
          <span className="mx-6">FURNITURE</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">INTERIOR</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">DESIGN</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">ELECTRONICS</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">UMUAHIA</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">LUXURY COMFORT</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">FURNITURE</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">INTERIOR</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">DESIGN</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">ELECTRONICS</span>
          <span className="text-amber-300">·</span>
          <span className="mx-6">UMUAHIA</span>
        </div>
      </section>

      {/* 5. CRAFTING WARMTH & STATS SECTION (Matching screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F4] border border-stone-200 rounded-[28px] sm:rounded-[36px] p-6 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Mission text */}
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3.5 py-1 rounded-full bg-[#E5E0D5] text-[#4A5538] text-xs font-bold inline-block">
                About Frankman
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
                We craft warmth, beauty, and meaningful spaces that feel like home. Elevate your living space with timeless furniture.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                With a commitment to craftsmanship, sustainable materials, and personalized service, we provide furnishings and home electronics that stand the test of time. Whether outfitting an apartment or executive residence in Umuahia, we deliver perfection.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/about')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A5538] hover:text-[#323B25] transition-colors"
                >
                  <span>Learn More About Our Heritage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Stat Cards (Matching screenshot 50+ / 2M+) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-[#4A5538] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[160px] shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading tabular-nums">
                  50+
                </span>
                <span className="text-xs text-stone-200 font-medium">
                  Showroom Curated Collections
                </span>
              </div>

              <div className="bg-[#3D472D] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[160px] shadow-sm">
                <span className="text-3xl sm:text-4xl font-extrabold font-heading tabular-nums">
                  100%
                </span>
                <span className="text-xs text-stone-200 font-medium">
                  Kiln-Dried Hardwood & Genuine Tech
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ECO-FRIENDLY & TIMELESS QUALITY SPOTLIGHT (Matching screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs uppercase font-bold tracking-wider text-[#4A5538]">
              Sustainable By Design
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 leading-tight">
              Eco-Friendly Designs, Timeless Quality
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We select woods treated with organic, low-emission lacquers and stock inverter cooling electronics that draw minimal generator power during load shedding.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4A5538]" />
                <span>Generator Friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4A5538]" />
                <span>Zero Termite Risk</span>
              </div>
            </div>
          </div>

          {/* Bento Images */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-3">
            <div className="rounded-2xl overflow-hidden aspect-3/4 bg-stone-100 shadow-xs">
              <SafeImage
                src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80"
                alt="Living details"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-3/4 bg-stone-100 shadow-xs">
              <SafeImage
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80"
                alt="Minimalist lamp"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden aspect-3/4 bg-stone-100 shadow-xs">
              <SafeImage
                src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80"
                alt="Lighting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (Matching pill accordion layout from screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Everything you need to know about purchasing, Paystack payment, and delivery in Umuahia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Showroom Visual */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200 shadow-sm hidden sm:block">
            <SafeImage
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
              alt="Comfort bedroom suite"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Pill Accordion Items */}
          <div className="lg:col-span-7 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className={`border rounded-2xl transition-all cursor-pointer overflow-hidden ${
                    isOpen
                      ? 'border-[#4A5538] bg-white shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
                    <span className="font-heading font-bold text-xs sm:text-sm text-stone-900">
                      {faq.q}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#4A5538]" />
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

      {/* 8. FOOTER / LET'S WORK TOGETHER (Matching olive container footer from screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] sm:rounded-[40px] bg-[#3B472C] text-[#EDE8DE] p-8 sm:p-14 shadow-xl space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <h3 className="font-heading font-extrabold text-2xl sm:text-4xl leading-snug">
                Let's Furnish Your Space & Make Beautiful Homes!
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md">
                Visit our showroom in Umuahia, Abia State or complete your order online with instant Paystack checkout.
              </p>
              <div>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="px-6 py-3 bg-white text-[#3B472C] hover:bg-stone-100 rounded-full text-xs font-bold tracking-wide transition-colors"
                >
                  Get in Touch
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
                  <button onClick={() => onNavigate('/shop')} className="hover:underline text-white">
                    Showroom Catalog
                  </button>
                </p>
                <p>
                  <button onClick={() => onNavigate('/admin')} className="hover:underline text-white">
                    Admin Portal
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Large bottom editorial text (Exact match to "Casa * Verde" in screenshot) */}
          <div className="pt-8 border-t border-white/15">
            <div className="font-heading font-extrabold text-3xl sm:text-6xl tracking-tight text-white/90 select-none uppercase">
              FRANKMAN · UMUAHIA
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
