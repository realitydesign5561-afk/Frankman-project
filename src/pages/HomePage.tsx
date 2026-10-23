import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { SafeImage } from '../components/ui/SafeImage';
import { WhatsAppButton } from '../components/support/WhatsAppButton';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Tv,
  Armchair,
  CheckCircle2,
  PhoneCall,
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

  useEffect(() => {
    fetch('/api/products?sortBy=featured&limit=6')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setFeaturedProducts(data.products);
        }
      })
      .catch((err) => console.error('Error fetching featured products:', err))
      .finally(() => setLoading(false));
  }, []);

  const categoryCollections = [
    {
      title: 'Living Room Furniture',
      subtitle: 'Ergonomic luxury sofas, modular sectionals & statement tables',
      path: '/shop/furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Dining Collections',
      subtitle: 'Hand-finished solid timber tables & cushioned dining suites',
      path: '/shop/furniture',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Television & Displays',
      subtitle: '4K Ultra HD smart screens, OLED displays & entertainment hubs',
      path: '/shop/electronics',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Contemporary TV Consoles',
      subtitle: 'Fluted wood media storage with concealed cable management',
      path: '/shop/furniture',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Refrigerators & Cooling',
      subtitle: 'Smart inverter multi-airflow units built for Nigerian climate',
      path: '/shop/electronics',
      image: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Home Theater Audio',
      subtitle: 'Immersive surround audio, wireless subwoofers & soundbars',
      path: '/shop/electronics',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#F5F2EB] border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-800">
              <span className="w-6 h-px bg-amber-800" />
              <span>Showroom in Umuahia, Abia State</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
              Premium Furniture & Electronics in Umuahia
            </h1>

            <p className="font-serif italic text-lg sm:text-xl text-stone-700">
              "Where style truly meets comfort."
            </p>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Discover stylish furniture and quality electronics selected to make your home more comfortable, functional, and beautiful.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/shop/furniture')}
                className="px-6 py-3.5 bg-[#1C1917] hover:bg-stone-800 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all"
              >
                <Armchair className="w-4 h-4" />
                <span>Shop Furniture</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => onNavigate('/shop/electronics')}
                className="px-6 py-3.5 border border-stone-400 hover:border-stone-800 bg-white hover:bg-stone-50 text-stone-900 text-sm font-semibold rounded-lg shadow-xs flex items-center gap-2 transition-all"
              >
                <Tv className="w-4 h-4" />
                <span>Shop Electronics</span>
              </button>
            </div>

            {/* Key trust indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-stone-300/80 text-xs text-stone-600">
              <div>
                <span className="block font-bold text-stone-900 text-sm">Verified</span>
                <span>Genuine Products</span>
              </div>
              <div>
                <span className="block font-bold text-stone-900 text-sm">Umuahia</span>
                <span>Prompt Local Delivery</span>
              </div>
              <div>
                <span className="block font-bold text-stone-900 text-sm">Transparent</span>
                <span>Fixed Naira Pricing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100 aspect-16/10">
              <SafeImage
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                alt="Frankman Furniture & Electronics Showroom in Umuahia"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="text-[11px] font-medium tracking-wider uppercase text-amber-300">
                    Curated Collection
                  </span>
                  <h3 className="font-serif text-lg font-semibold">
                    Luxury Sectionals & Smart Displays
                  </h3>
                  <p className="text-xs text-stone-300">
                    Visit our Umuahia showroom or order directly online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
              Explore By Category
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Refined Living Spaces
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-semibold text-stone-800 hover:text-amber-800 mt-2 sm:mt-0 flex items-center gap-1 transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryCollections.map((cat) => (
            <div
              key={cat.title}
              onClick={() => onNavigate(cat.path)}
              className="group relative h-64 rounded-xl overflow-hidden border border-stone-200/80 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300"
            >
              <SafeImage
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />
              <div className="absolute inset-x-5 bottom-5 text-white">
                <h3 className="font-serif text-lg font-bold group-hover:text-amber-300 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                  {cat.subtitle}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 mt-2 group-hover:underline">
                  Browse Selection &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS (FROM DATABASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
              Showroom Highlights
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Featured Products
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-3 sm:mt-0">
            <button
              onClick={() => onNavigate('/shop/furniture')}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-stone-300 hover:border-stone-800 transition-colors"
            >
              Furniture
            </button>
            <button
              onClick={() => onNavigate('/shop/electronics')}
              className="text-xs font-medium px-3 py-1.5 rounded-md border border-stone-300 hover:border-stone-800 transition-colors"
            >
              Electronics
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-stone-100 rounded-lg h-80 animate-pulse border border-stone-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL SPLIT SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Living Room Upgrade */}
          <div className="relative rounded-2xl overflow-hidden bg-[#2D211A] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] shadow-lg">
            <div className="relative z-10 max-w-md space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Interior Elegance
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                Custom Woodwork & Luxury Modular Seating
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Experience heirloom craftsmanship designed to withstand humidity and daily family use. Sourced and inspected for lasting comfort.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <button
                onClick={() => onNavigate('/shop/furniture')}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Explore Furniture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 pointer-events-none">
              <SafeImage
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Sofa"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card 2: Modern Home Entertainment */}
          <div className="relative rounded-2xl overflow-hidden bg-[#1E252B] text-white p-8 sm:p-10 flex flex-col justify-between min-h-[360px] shadow-lg">
            <div className="relative z-10 max-w-md space-y-3">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">
                Modern Technology
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                Cinematic Smart Displays & Surge-Resistant Appliances
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Curated electronics engineered with wide-voltage protection and generator compatibility for uninterrupted home relaxation.
              </p>
            </div>
            <div className="relative z-10 pt-6">
              <button
                onClick={() => onNavigate('/shop/electronics')}
                className="px-5 py-2.5 bg-stone-100 hover:bg-white text-stone-950 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span>Shop Electronics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-25 pointer-events-none">
              <SafeImage
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80"
                alt="Smart Television"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY SHOP WITH FRANKMAN? */}
      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-800">
              The Frankman Distinction
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              Why Shop With Frankman?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Serving homeowners, interior decorators, and corporate offices across Umuahia and Abia State with trusted retail excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C1917] text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Furniture & Electronics Together
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Outfit your entire living room, dining space, or bedroom in one stop with matched palettes, media consoles, and screens.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C1917] text-white flex items-center justify-center">
                <Truck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Local Umuahia Logistics
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enjoy safe handling and direct delivery to your residence in Umuahia. Free delivery on orders over ₦300,000.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#FAF9F5] border border-stone-200/80 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C1917] text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Personalized Showroom Consultation
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Get direct product advice, fabric options, and dimensions via WhatsApp or in person at our Umuahia store.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER SUPPORT & WHATSAPP CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#F5F2EB] border border-stone-300 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
              Direct Showroom Connection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Need Personalized Guidance or a Custom Order?
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our showroom advisors are ready to share high-resolution videos, fabric swatches, or coordinate delivery times right to your doorstep in Umuahia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <WhatsAppButton
              phoneNumber={whatsappNumber}
              message="Hello Frankman Furniture & Electronics, I am browsing your website and would like personalized product assistance."
              label="Chat on WhatsApp"
              size="lg"
            />
            <a
              href="tel:+2348031234567"
              className="px-5 py-3 border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-stone-600" />
              <span>Call Showroom</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
