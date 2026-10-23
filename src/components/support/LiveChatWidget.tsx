import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl } from './WhatsAppButton';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const LiveChatWidget: React.FC<{ whatsappNumber?: string }> = ({
  whatsappNumber = '2348031234567',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Welcome to Frankman Furniture & Electronics in Umuahia. How may we assist your home or office upgrade today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const createMessageId = () =>
    `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const getSupportReply = (question: string) => {
    const lower = question.toLowerCase().replace(/[?!.,]/g, ' ');
    const has = (...terms: string[]) => terms.some((term) => lower.includes(term));

    if (has('hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening')) {
      return 'Hello and welcome to Frankman. I can help with products, prices, stock, delivery, payments, discounts, orders, returns, warranty, our showroom, and property enquiries. What would you like to know?';
    }
    if (has('deliver', 'shipping', 'delivery', 'ship')) {
      return 'We deliver within Umuahia and across Abia State. Standard local delivery is ₦15,000, while orders above ₦300,000 qualify for free local delivery. Please contact us for a quote to another Nigerian city.';
    }
    if (has('discount', 'promo', 'coupon', 'offer', 'sale')) {
      return 'Use code WELCOME10 at checkout for 10% off your purchase. If it does not apply to an item, our sales desk can confirm current promotions for you.';
    }
    if (has('payment', 'paystack', 'pay online', 'transfer', 'card')) {
      return 'You can place your order online and choose a secure payment option at checkout. We accept card and transfer payments, and our sales desk will confirm your order before fulfillment.';
    }
    if (has('location', 'address', 'where are', 'store', 'showroom', 'open', 'hours', 'close')) {
      return 'Our showroom is in Umuahia, Abia State, Nigeria. We are open Monday to Saturday, 8:30 AM to 6:30 PM. Use the WhatsApp button below for the exact location pin.';
    }
    if (has('price', 'cost', 'how much', '₦', 'naira')) {
      return 'Current prices are shown on each product page in Nigerian naira. Add an item to your cart or send us its name on WhatsApp and we will confirm availability and the latest price.';
    }
    if (has('available', 'in stock', 'stock', 'sold out')) {
      return 'Availability is shown on each product page and can change quickly. If an item is out of stock, message us on WhatsApp and we can suggest a similar option or confirm the next restock.';
    }
    if (has('product', 'furniture', 'sofa', 'bed', 'dining', 'table', 'chair', 'electronics', 'tv', 'fridge', 'appliance')) {
      return 'We offer furniture and home electronics for living rooms, bedrooms, dining spaces, offices, and more. Browse the shop by category, then open a product to see its details, variants, price, and stock.';
    }
    if (has('order', 'track', 'tracking', 'order number', 'confirmation')) {
      return 'After checkout, you will receive an order reference on the confirmation page. Keep it handy and contact our team on WhatsApp with the reference so we can help with status updates.';
    }
    if (has('return', 'refund', 'exchange', 'cancel')) {
      return 'For returns, exchanges, refunds, or order changes, please contact our sales desk as soon as possible with your order reference. We will review the item condition and order status and guide you through the next step.';
    }
    if (has('warranty', 'guarantee', 'damaged', 'faulty', 'repair')) {
      return 'Warranty coverage depends on the product and supplier. If an item arrives damaged or develops a fault, contact us with your order reference and photos so the team can assist promptly.';
    }
    if (has('property', 'house', 'home', 'apartment', 'land', 'real estate')) {
      return 'We can help with furniture and home styling for Nigerian spaces. For available property or bespoke interior enquiries, send your preferred location, budget, and requirements to our team on WhatsApp.';
    }
    if (has('contact', 'phone', 'whatsapp', 'agent', 'human', 'help')) {
      return 'Our team is ready to help. Tap WhatsApp below for a human agent, and include the product name, your location, and any order reference so we can respond faster.';
    }

    return 'I can help with products, prices, stock, delivery, payments, discounts, orders, returns, warranty, our Umuahia showroom, and property or interior enquiries. Tell me what you need, or tap WhatsApp to speak with a human agent.';
  };

  const handleSend = (userMessage?: string) => {
    const textToSend = (userMessage || inputText).trim();
    if (!textToSend) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { id: createMessageId(), sender: 'user', text: textToSend, timestamp: now }]);
    if (!userMessage) setInputText('');

    window.setTimeout(() => {
      setMessages((prev) => [...prev, { id: createMessageId(), sender: 'bot', text: getSupportReply(textToSend), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 450);
  };

  const quickActions = [
    { label: 'Delivery', query: 'What are your delivery options?' },
    { label: 'Prices & stock', query: 'How can I check prices and availability?' },
    { label: 'Payments', query: 'What payment options do you accept?' },
    { label: 'Returns', query: 'What is your return or exchange process?' },
    { label: 'Location & hours', query: 'Where is your showroom and when are you open?' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-[360px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[calc(100vh-6rem)] bg-white rounded-xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#1C1917] text-white px-4 py-3.5 flex items-center justify-between">
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wide">
                Frankman Customer Desk
              </h4>
              <p className="text-[11px] text-stone-300">
                Umuahia, Abia State · Support Assistant
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white transition-colors p-1 rounded-md"
              aria-label="Close support chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#1C1917] text-white'
                      : 'bg-white border border-stone-200 text-stone-800 shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickActions.map((qa) => (
              <button
                key={qa.label}
                onClick={() => handleSend(qa.query)}
                className="text-[11px] font-medium text-stone-700 bg-white border border-stone-200 hover:border-stone-400 px-2.5 py-1 rounded-md whitespace-nowrap transition-colors"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* WhatsApp Handoff Strip */}
          <div className="px-3 py-1.5 bg-[#EBF7EE] border-t border-[#D0ECD5] flex items-center justify-between text-[11px] text-[#1E7E34]">
            <span>Need human agent assistance?</span>
            <a
              href={formatWhatsAppUrl(
                whatsappNumber,
                'Hello Frankman Furniture & Electronics, I am requesting live customer assistance regarding an inquiry in Umuahia.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline flex items-center gap-1 hover:text-[#186629]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about furniture, electronics..."
              className="flex-1 text-xs border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:border-stone-800 focus:ring-1 focus:ring-stone-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#1C1917] disabled:bg-stone-300 text-white p-2 rounded-md transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1C1917] hover:bg-stone-800 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2.5 text-xs font-medium tracking-wide transition-all transform hover:scale-105"
          aria-label="Open customer support chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Support Desk</span>
        </button>
      )}
    </div>
  );
};
