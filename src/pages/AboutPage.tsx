import React from 'react';
import { SafeImage } from '../components/ui/SafeImage';
import { WhatsAppButton } from '../components/support/WhatsAppButton';
import { Armchair, Tv, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void; whatsappNumber?: string }> = ({
  onNavigate,
  whatsappNumber = '+2348031234567',
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Umuahia, Abia State, Nigeria
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-tight">
          Where Style Truly Meets Comfort
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Frankman Furniture & Electronics is Umuahia's premier destination for curated living spaces. We bring together bespoke furniture craftsmanship and advanced home electronics under one roof.
        </p>
      </div>

      {/* Story & Image Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-4/3 bg-stone-100 border border-stone-200">
          <SafeImage
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
            alt="Frankman Showroom in Umuahia"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Rooted in Umuahia, Built for Comfort
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Founded to provide discerning residents of Umuahia and Abia State with furniture and electronics that balance aesthetics, enduring quality, and honest local support.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FAF9F5] border border-stone-200 flex items-center justify-center shrink-0">
                <Armchair className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Tropical Hardwood & Resilient Upholstery
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Our living room sofas, dining suites, and TV consoles use kiln-dried tropical timber treated to resist humidity, warping, and everyday wear.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FAF9F5] border border-stone-200 flex items-center justify-center shrink-0">
                <Tv className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Surge-Tolerant, Energy-Smart Electronics
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  We curate 4K smart TVs, inverter refrigerators, and acoustic sound systems built with wide-voltage protection and generator friendliness.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#FAF9F5] border border-stone-200 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-serif text-base font-semibold text-stone-900">
                  Local Presence & Prompt Delivery
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  No distant logistics uncertainties. Products are stocked locally in Umuahia with direct doorstep delivery across Abia State.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showroom CTA */}
      <div className="rounded-2xl bg-[#1C1917] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-serif text-2xl font-bold">
            Visit Our Showroom or Connect with Us
          </h3>
          <p className="text-xs text-stone-300 max-w-md">
            Our team is available Monday through Saturday in Umuahia to assist your interior styling and electronics requirements.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message="Hello Frankman Furniture & Electronics, I read your About page and would like to learn more about visiting your showroom in Umuahia."
            label="Message Showroom"
            variant="solid"
          />
          <button
            onClick={() => onNavigate('/shop')}
            className="px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-100 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
