import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle, ShieldCheck } from 'lucide-react';
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
    <footer className="bg-[#F7F4EE] text-stone-700 pt-16 pb-12 border-t border-[#EAE5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#EAE5DC]">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#B58235] text-white flex items-center justify-center shadow-xs">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6zm-2-8a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl font-bold text-stone-900 tracking-tight">
                Frankman
              </h3>
            </div>
            <p className="text-[#B58235] font-editorial italic text-sm">
              "Where style truly meets comfort."
            </p>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Handcrafted kiln-dried hardwood furniture and smart home electronics in Umuahia, Abia State. Direct delivery to luxury homes, duplexes, and commercial properties across Nigeria.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-[#EAE5DC] hover:border-[#B58235] text-stone-700 hover:text-[#B58235] flex items-center justify-center transition-colors shadow-xs"
                aria-label="Visit Frankman Furniture & Electronics on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={formatWhatsAppUrl(whatsapp, 'Hello Frankman Furniture & Electronics, I am connecting from your website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center transition-colors shadow-xs"
                aria-label="Chat with Frankman on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Showroom Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 tracking-wider uppercase">
              Showroom Collections
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Living Room Sofas & Sectionals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Solid Timber Dining Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Contemporary Media TV Consoles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Smart 4K & OLED Televisions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Inverter Double-Door Refrigerators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Surround Sound Home Theaters
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Paystack Checkout */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 tracking-wider uppercase">
              Customer Support & Payment
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  About Frankman
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Contact Showroom Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/checkout')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Paystack Online Checkout
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/cart')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer"
                >
                  Shopping Bag
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-[#B58235] transition-colors text-left cursor-pointer text-stone-500"
                >
                  Store Administration Portal
                </button>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-stone-500 space-y-1">
              <span className="font-semibold text-stone-800 block">Verified Payment Channels:</span>
              <p>Debit Card · Bank Transfer · USSD · Cash on Delivery</p>
            </div>
          </div>

          {/* Col 4: Store Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 tracking-wider uppercase">
              Showroom Location
            </h4>
            <div className="space-y-2.5 text-xs text-stone-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B58235] shrink-0 mt-0.5" />
                <span>{businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B58235] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-stone-900">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B58235] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-stone-900">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B58235] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Local SEO Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Frankman Furniture & Electronics. All rights reserved. Umuahia, Abia State, Nigeria.
          </p>
          <div className="flex flex-wrap items-center gap-2.5 text-stone-500">
            <span>Umuahia Furniture Retail</span>
            <span>·</span>
            <span>Home Electronics Nigeria</span>
            <span>·</span>
            <span>Abia State Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
