import React, { useEffect, useState, useRef } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { clientStore } from '../lib/client-store';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Tv,
  Armchair,
  Utensils,
  Briefcase,
  Flame,
  Clock,
  CheckCircle2,
  Phone,
  Bed,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  whatsappNumber?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  const [products, setProducts] = useState<Product[]>(() => clientStore.getProducts());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Minimalist Flash Deals Countdown Timer (8 hours from now)
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  const scrollTrackRef = useRef<HTMLDivElement>(null);

  // Carousel lifestyle slides
  const carouselSlides = [
    {
      id: 'slide-1',
      title: 'Modern Living, Timeless Comfort',
      subtitle: 'Handcrafted kiln-dried hardwood sofas & plush bouclé sectionals built for distinguished Nigerian homes.',
      tag: 'NEW 2026 COLLECTION',
      cta: 'Explore Living Room',
      path: '/shop?category=living',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'slide-2',
      title: 'Solid Hardwood Dining Suites',
      subtitle: 'Heirloom solid oak & walnut dining sets with polyurethane scratch defense and cushioned ergonomic seating.',
      tag: 'DIRECT SHOWROOM PIECES',
      cta: 'Explore Dining Suites',
      path: '/shop?category=dining',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'slide-3',
      title: 'Executive Ergonomic Workspaces',
      subtitle: 'High-tensile Korean mesh, dynamic lumbar arch, and solid executive desks designed for all-day focus.',
      tag: 'OFFICE & PRODUCTIVITY',
      cta: 'Shop Office Furniture',
      path: '/shop?category=office',
      image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
    },
    {
      id: 'slide-4',
      title: 'Cinematic Entertainment & Cooling',
      subtitle: 'Generator-friendly 4K smart TVs, inverter multi-airflow refrigeration, and fluted media consoles.',
      tag: 'SMART HOME APPLIANCES',
      cta: 'Browse Electronics',
      path: '/shop/electronics',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Countdown timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
  useEffect(() => {
    fetch('/api/products?limit=24')
      .then((res) => {
        if (!res.ok) throw new Error('API non-200');
        return res.json();
      })
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        setProducts(clientStore.getProducts());
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter products by tab
  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'living') {
      return (
        p.slug.includes('sofa') ||
        p.slug.includes('chair') ||
        p.slug.includes('lounge') ||
        p.name.toLowerCase().includes('chair')
      );
    }
    if (activeTab === 'dining') return p.slug.includes('dining');
    if (activeTab === 'bedroom') return p.slug.includes('bed');
    if (activeTab === 'office') {
      return (
        p.slug.includes('office') ||
        p.slug.includes('chair') ||
        p.name.toLowerCase().includes('office')
      );
    }
    if (activeTab === 'electronics') return p.categoryId === 'cat-electronics';
    return true;
  });

  const scrollTrack = (direction: 'left' | 'right') => {
    if (scrollTrackRef.current) {
      const scrollAmount = 340;
      scrollTrackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const categories = [
    { label: 'Living Room & Sofas', icon: Armchair, path: '/shop?category=living' },
    { label: 'Dining Suites', icon: Utensils, path: '/shop?category=dining' },
    { label: 'Bedroom Furniture', icon: Bed, path: '/shop?category=bedroom' },
    { label: 'Office & Workspaces', icon: Briefcase, path: '/shop?category=office' },
    { label: 'TV & Media Consoles', icon: Tv, path: '/shop?category=consoles' },
    { label: 'Smart Electronics', icon: Sparkles, path: '/shop/electronics' },
    { label: 'Decor & Accent Lighting', icon: Layers, path: '/shop?category=decor' },
  ];

  const faqs = [
    {
      q: 'Do you deliver across Ibadan, Lagos, and other states in Nigeria?',
      a: 'Yes! We provide guaranteed door-to-door transit across Ibadan, Lagos, Umuahia, Aba, Port Harcourt, Owerri, Enugu, Asaba, and Abuja. Orders above ₦200,000 enjoy free subsidized delivery with full protective blanket wrapping and setup assistance.',
    },
    {
      q: 'How does the Paystack payment gateway work for card and bank transfer?',
      a: 'Paystack is natively integrated into our checkout. You can complete your order using any Nigerian Debit Card (Mastercard, Visa, Verve), instant Bank Transfer to a dedicated checkout account, or banking USSD codes. Your transaction is 100% encrypted and confirmed in seconds.',
    },
    {
      q: 'What is your timber treatment and termite protection guarantee?',
      a: 'All Frankman timber is kiln-dried to less than 12% moisture content to prevent twisting or cracking. We apply non-toxic deep organic wood preservatives that permanently repel termites and wood-boring insects, backed by a 3-year structural integrity guarantee.',
    },
    {
      q: 'Are your smart televisions and refrigerators generator-friendly?',
      a: 'Absolutely. Every appliance in our showroom is selected specifically for Nigerian power realities. They feature wide-voltage operation (135V–290V), low wattage start-up currents compatible with residential solar inverters and small gasoline generators.',
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12 pb-16 bg-[#F8FAFC]">
      {/* 1. HERO SECTION (Marketplace 3-Column Desktop Architecture) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* Left Column (20% width on Desktop): Vertical Category Menu */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-3">
            <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-3 h-full flex flex-col justify-between">
              <div>
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Categories
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">Showroom</span>
                </div>

                <div className="mt-2 space-y-1">
                  {categories.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.label}
                        onClick={() => onNavigate(cat.path)}
                        className="w-full text-left px-3 py-2.5 rounded-md text-xs font-medium text-[#0F172A] hover:text-amber-600 hover:bg-slate-100 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4 h-4 text-slate-500 group-hover:text-amber-600 transition-colors shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Help Card in Left Column */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200/70 rounded-md text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Showroom Advisory</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Need custom dimensions or bulk property fitouts?
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Hello Frankman Furnitures, I need custom furnishing advice.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Center Column (60% width on Desktop): Large Auto-Playing Carousel */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-auto lg:h-[430px] rounded-lg overflow-hidden shadow-xs border border-slate-200/90 group bg-slate-900">
              {carouselSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  {/* Background Image */}
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient Overlay for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent sm:bg-gradient-to-r sm:from-slate-950/90 sm:via-slate-950/50 sm:to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end sm:justify-center p-5 sm:p-8 max-w-lg space-y-2 sm:space-y-3 z-20 text-white">
                    <span className="inline-block bg-amber-600 text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded w-fit shadow-xs">
                      {slide.tag}
                    </span>

                    <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xs">
                      {slide.title}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed drop-shadow-xs">
                      {slide.subtitle}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => onNavigate(slide.path)}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold rounded-md shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit active:scale-95"
                      >
                        <span>{slide.cta}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Carousel Arrows */}
              <button
                onClick={() =>
                  setCurrentSlide((prev) =>
                    prev === 0 ? carouselSlides.length - 1 : prev - 1
                  )
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-900 shadow-md flex items-center justify-center transition-opacity opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {carouselSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentSlide
                        ? 'w-6 bg-amber-500'
                        : 'w-2 bg-white/50 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (20% width on Desktop): Two Stacked Promotional Banners */}
          <div className="hidden lg:flex lg:col-span-3 xl:col-span-3 flex-col gap-4">
            {/* Promo Banner 1: New Arrivals */}
            <div
              onClick={() => onNavigate('/shop?category=living')}
              className="group relative flex-1 rounded-lg overflow-hidden border border-slate-200/90 shadow-xs cursor-pointer bg-slate-900 p-4 flex flex-col justify-between"
            >
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
                alt="New Arrivals"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  New Arrivals
                </span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Artisan Hardwood &amp; Velvets
                  </h3>
                  <p className="text-xs text-amber-200 font-medium mt-1">
                    Up to 15% Off Introductory Sets
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-amber-300 transition-colors pt-1">
                  <span>Shop Showcase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Promo Banner 2: Office Collections */}
            <div
              onClick={() => onNavigate('/shop?category=office')}
              className="group relative flex-1 rounded-lg overflow-hidden border border-slate-200/90 shadow-xs cursor-pointer bg-slate-900 p-4 flex flex-col justify-between"
            >
              <img
                src="https://images.unsplash.com/photo-1580481077195-c3a82104e362?auto=format&fit=crop&w=800&q=80"
                alt="Office Collections"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="relative z-10 flex flex-col justify-between h-full space-y-2">
                <span className="bg-[#0F172A] text-amber-400 border border-amber-400/40 text-[10px] font-bold px-2 py-0.5 rounded w-fit uppercase tracking-wider">
                  Office Suites
                </span>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Executive Ergonomics
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    From ₦185,000 · Direct Delivery
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-amber-300 transition-colors pt-1">
                  <span>Explore Workspaces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLASH DEALS / TRENDING SECTION (Horizontal Scrolling with Minimalist Timer) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5">
          {/* Section Header: Bold Charcoal Navy title & Minimalist Countdown Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">
                  Trending Collections
                </h2>
                <p className="text-xs text-slate-500">
                  Best-selling furniture suites &amp; appliances with promotional pricing
                </p>
              </div>
            </div>

            {/* Minimalist Countdown Timer on the Right Side */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline uppercase tracking-wider text-[11px] text-slate-400">
                  Deals End In:
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono font-bold">
                <span className="bg-[#0F172A] text-white px-2 py-1 rounded shadow-2xs">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span className="text-slate-400 font-bold">:</span>
                <span className="bg-[#0F172A] text-white px-2 py-1 rounded shadow-2xs">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span className="text-slate-400 font-bold">:</span>
                <span className="bg-amber-600 text-white px-2 py-1 rounded shadow-2xs">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>

              {/* Scroll Navigation Chevrons */}
              <div className="hidden sm:flex items-center gap-1.5 ml-3">
                <button
                  onClick={() => scrollTrack('left')}
                  className="w-7 h-7 rounded-md border border-slate-200 hover:border-slate-400 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTrack('right')}
                  className="w-7 h-7 rounded-md border border-slate-200 hover:border-slate-400 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrolling Products Container */}
          <div
            ref={scrollTrackRef}
            className="flex gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth"
          >
            {products.slice(0, 8).map((product) => (
              <div
                key={product.id}
                className="w-[200px] sm:w-[230px] shrink-0"
              >
                <ProductCard
                  product={product}
                  onNavigate={onNavigate}
                  discountPercent={15}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SHOP BY ROOM & CATEGORY BENTO TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[#0F172A]">
            Shop By Room Category
          </h2>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
          >
            <span>See All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {[
            {
              title: 'Living Room',
              count: 'Sofas & Chairs',
              path: '/shop?category=living',
              img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
            },
            {
              title: 'Dining Suites',
              count: 'Solid Hardwood',
              path: '/shop?category=dining',
              img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
            },
            {
              title: 'Bedroom Sets',
              count: 'Teak Bedframes',
              path: '/shop?category=bedroom',
              img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80',
            },
            {
              title: 'Office Desks',
              count: 'Ergonomic Chairs',
              path: '/shop?category=office',
              img: 'https://images.unsplash.com/photo-1580481077195-c3a82104e362?auto=format&fit=crop&w=600&q=80',
            },
            {
              title: 'TV Consoles',
              count: 'Fluted Acoustic',
              path: '/shop?category=consoles',
              img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
            },
            {
              title: 'Smart Electronics',
              count: '4K TVs & Inverters',
              path: '/shop/electronics',
              img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80',
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(cat.path)}
              className="group relative rounded-lg overflow-hidden border border-slate-200/80 bg-white p-3 shadow-xs hover:shadow-md transition-all cursor-pointer text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 mb-2 border border-slate-200/70">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-amber-600 transition-colors">
                {cat.title}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MAIN PRODUCT SHOWCASE (Responsive: 2-Columns on Mobile, 4-Columns on Desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
              Recommended For Your Home &amp; Office
            </h2>
            <p className="text-xs text-slate-500">
              Verified inventory ready for rapid dispatch across Nigeria
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {[
              { id: 'all', label: 'All Catalog' },
              { id: 'living', label: 'Living Room' },
              { id: 'dining', label: 'Dining Sets' },
              { id: 'bedroom', label: 'Bedroom' },
              { id: 'office', label: 'Office' },
              { id: 'electronics', label: 'Electronics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Columns on Mobile, 4-Columns on Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
              discountPercent={15}
            />
          ))}
        </div>
      </section>

      {/* 5. NATIONWIDE DELIVERY & TRUST PROMISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0F172A] rounded-lg p-6 sm:p-10 text-white relative overflow-hidden shadow-md">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="bg-amber-600 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded">
              Direct Showroom Assurance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Furnishing Luxury Residences Across Ibadan, Lagos, &amp; The South-East
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every timber piece is kiln-dried and treated against termites before delivery. With Paystack instant confirmation and white-glove setup teams, furnishing your duplex, apartment, or corporate headquarters has never been smoother.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('/shop')}
                className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-md transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Shop Catalog Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  'Hello Frankman Furnitures, I would like to inquire about showroom delivery to my location.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-md border border-white/20 transition-all flex items-center gap-2"
              >
                <span>Speak with a Furnishing Expert</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED HOMEOWNER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Verified Customer Reviews
          </h2>
          <p className="text-xs text-slate-500">
            Real feedback from property owners and interior decorators across Nigeria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Dr. Emeka Nwosu',
              location: 'World Bank Housing Estate, Umuahia',
              review:
                'Frankman furnished our entire 5-bedroom duplex. The solid oak dining set and modular sofa exceeded expectations. Prompt delivery and courteous installation team.',
              product: 'Solid Oak Dining Suite',
            },
            {
              name: 'Arc. Chioma Adebayo',
              location: 'Interior Architect, Ibadan & Lagos',
              review:
                'As an architect designing modern residences across Nigeria, I recommend Frankman for custom finishes. Their timber is genuinely kiln-dried with zero warping or pest issues.',
              product: 'Executive Workstations & Consoles',
            },
            {
              name: 'Chief Kenneth Okoli',
              location: 'Commercial Property Investor, Aba',
              review:
                'The inverter double-door refrigerator and 65-inch 4K TV run effortlessly on our solar inverter. The online Paystack checkout made bank transfer instant and straightforward.',
              product: 'Inverter Appliances & Media Suite',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.location}</p>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Clear information about ordering, warranties, and payment security
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-slate-200/90 shadow-xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:text-amber-700 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
