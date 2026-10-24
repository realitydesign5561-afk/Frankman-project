import React from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, MessageCircle } from 'lucide-react';
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
  businessAddress = 'Umuahia, Abia State, Nigeria',
  businessHours = 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
  facebookUrl = 'https://www.facebook.com/profile.php?id=61569349703465',
}) => {
  return (
    <footer className="bg-[#17191A] text-[#F2F3F1] pt-12 sm:pt-16 pb-8 border-t border-[#303536]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl sm:text-3xl text-white tracking-tight uppercase">
              Frankman
            </h3>
            <p className="text-[#AFC5CF] font-editorial text-xs tracking-widest uppercase">
              Furniture · Interiors · Living
            </p>
            <p className="text-xs text-[#C8CDCC] leading-relaxed max-w-sm">
              Premium furniture and electronics retail destination in Umuahia, Abia State. Curated living room, dining sets, home theater, and household appliances designed to enrich modern Nigerian living.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-colors"
                aria-label="Visit Frankman Furniture & Electronics on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={formatWhatsAppUrl(whatsapp, 'Hello Frankman Furniture & Electronics, I am connecting from your website.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-[#1E7E34] text-stone-200 flex items-center justify-center transition-colors"
                aria-label="Chat with Frankman on WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Collections */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
              Showroom Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#C8CDCC]">
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Living Room Sofas & Sectionals
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Dining Tables & Chairs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/furniture')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Contemporary Media Consoles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Smart 4K & OLED Televisions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Inverter Refrigerators
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/shop/electronics')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Surround Sound Audio Systems
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-[#C8CDCC]">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  About Frankman
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Contact Showroom
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Returns & Refunds Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/admin')}
                  className="hover:text-[#AFC5CF] transition-colors"
                >
                  Store Administration
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold text-white tracking-wider uppercase">
              Showroom Location
            </h4>
            <div className="space-y-2.5 text-xs text-[#C8CDCC]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#AFC5CF] shrink-0 mt-0.5" />
                <span>{businessAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#AFC5CF] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#AFC5CF] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#AFC5CF] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{businessHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Local SEO Statement */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B9B8A9] gap-4">
          <p>
            &copy; {new Date().getFullYear()} Frankman Furniture & Electronics. All rights reserved. Umuahia, Abia State, Nigeria.
          </p>
          <div className="flex items-center gap-4 text-[#C8CDCC]">
            <span>Umuahia Furniture Retail</span>
            <span>·</span>
            <span>Home Electronics</span>
            <span>·</span>
            <span>Abia State</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
