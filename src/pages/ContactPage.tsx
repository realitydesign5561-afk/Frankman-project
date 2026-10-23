import React, { useState } from 'react';
import { WhatsAppButton } from '../components/support/WhatsAppButton';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Send,
  CheckCircle2,
  Truck,
  RotateCcw,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  phone?: string;
  whatsapp?: string;
  email?: string;
  businessAddress?: string;
  businessHours?: string;
  facebookUrl?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  phone = '+234 803 123 4567',
  whatsapp = '+2348031234567',
  email = 'info@frankman.ng',
  businessAddress = 'Umuahia, Abia State, Nigeria',
  businessHours = 'Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed',
  facebookUrl = 'https://www.facebook.com/profile.php?id=61569349703465',
}) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.message) return;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro Header */}
      <div className="border-b border-stone-200 pb-6">
        <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
          Customer Service & Showroom
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-1">
          Contact Frankman Showroom
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Have an inquiry regarding living room furniture, TV consoles, or home appliances in Umuahia? We're here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Direct Info & Social */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100">
              Showroom Information
            </h3>

            <div className="space-y-4 text-xs text-stone-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Physical Location</span>
                  <span>{businessAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Telephone Hotline</span>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-stone-950">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Email Address</span>
                  <a href={`mailto:${email}`} className="hover:text-stone-950">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block">Operating Hours</span>
                  <span>{businessHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-3">
              <span className="text-xs font-semibold text-stone-700 block">
                Connect Directly via Channels:
              </span>
              <div className="flex flex-col sm:flex-row gap-3">
                <WhatsAppButton
                  phoneNumber={whatsapp}
                  message="Hello Frankman Furniture & Electronics, I am contacting you from your store website."
                  label="Message WhatsApp"
                  size="sm"
                  className="w-full sm:w-auto"
                />
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                  <span>Facebook Profile</span>
                </a>
              </div>
            </div>
          </div>

          {/* Showroom Logistics Notice */}
          <div className="bg-[#FAF9F5] border border-stone-200 p-6 rounded-xl space-y-3 text-xs text-stone-600">
            <h4 className="font-serif font-bold text-stone-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>Showroom Delivery & Inspection</span>
            </h4>
            <p className="leading-relaxed">
              We coordinate local delivery across all districts of Umuahia and major commercial routes in Abia State. Deliveries include physical inspection so you can verify timber, upholstery, and electronics functionality on arrival.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl border border-stone-200 p-6 sm:p-8 shadow-xs">
            <h3 className="font-serif text-lg font-bold text-stone-900 pb-3 border-b border-stone-100 mb-6">
              Send a Showroom Inquiry
            </h3>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-stone-900">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you, {contactForm.name}. A representative from our Umuahia sales team will respond promptly.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setContactForm({ name: '', email: '', phone: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-medium text-stone-800 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Your Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, name: e.target.value })
                      }
                      placeholder="e.g. Ngozi Ibe"
                      className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, phone: e.target.value })
                      }
                      placeholder="e.g. 0803 000 0000"
                      className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="e.g. ngozi@example.com"
                    className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Your Inquiry or Product Question <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, message: e.target.value })
                    }
                    placeholder="Inquire about sofas, dining sets, screen sizes, delivery to your address in Umuahia, or custom orders..."
                    className="w-full text-xs border border-stone-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1C1917] hover:bg-stone-800 text-white rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Inquiry to Showroom</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
