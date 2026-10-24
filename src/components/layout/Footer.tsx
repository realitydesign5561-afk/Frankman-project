import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  MessageCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Award,
} from 'lucide-react';
import { formatWhatsAppUrl } from '../support/WhatsAppButton';

interface FooterProps {
  onNavigate: (path: string) => void;
  phone?: string;
  whatsapp?: string;
  email?: string;
  businessAddress?: string;
  businessHours?: string;
  facebookUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  phone = '+234 803 123 4567',
  whatsapp = '+2348031234567',
  email = 'info@frankman.ng',
  businessAddress = '14 Aba Road, Umuahia, Abia State, Nigeria',
  businessHours = 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
  facebookUrl = 'https://www.facebook.com/profile.php?id=61569349703465',
}) => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Strip (Charcoal Navy + Slate-800 background) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Fast Nationwide Delivery
              </h4>
              <p className="text-[11px] text-slate-400">
                Padded transit across Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Paystack Verified Security
              </h4>
              <p className="text-[11px] text-slate-400">
                Cards, Instant Transfer &amp; USSD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                100% Kiln-Dried Hardwood
              </h4>
              <p className="text-[11px] text-slate-400">
                Anti-termite treated timber
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-amber-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                3-Year Frame Warranty
              </h4>
              <p className="text-[11px] text-slate-400">
                Structural integrity guarantee
              </p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                F
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                Frankman <span className="text-amber-500 font-extrabold">Furnitures</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria&apos;s premier furniture marketplace and electronics showroom. Where style truly meets comfort with handcrafted hardwood suites, ergonomic workspaces, and generator-friendly appliances.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={formatWhatsAppUrl(whatsapp, 'Hello Frankman Furnitures, I am connecting from your website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Showroom Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Showroom Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/shop?category=living')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Living Room &amp; Modular Sofas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop?category=dining')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Solid Timber Dining Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop?category=bedroom')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Bedroom &amp; Platform Bedframes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop?category=office')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Executive Ergonomic Office Chairs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop?category=consoles')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Acoustic Fluted TV Consoles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Inverter Appliances &amp; 4K TVs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Customer Support &amp; Payment
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  About Frankman Furnitures
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer"
                >
                  Delivery Coverage (Ibadan, Lagos, Umuahia)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop?deals=true')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer text-amber-500 font-semibold"
                >
                  Flash Deals &amp; Discounts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-amber-500 transition-colors text-left cursor-pointer text-slate-500 hover:text-slate-300"
                >
                  Admin Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Showroom Hub Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Umuahia Showroom Hub
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Copyright & Paystack Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Frankman Furnitures. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Paystack</span>
            <span>·</span>
            <span>Debit Cards</span>
            <span>·</span>
            <span>Bank Transfer</span>
            <span>·</span>
            <span>USSD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
