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

  const handleSend = (userMessage?: string) => {
    const textToSend = userMessage || inputText;
    if (!textToSend.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!userMessage) setInputText('');

    // Automated smart customer response
    setTimeout(() => {
      let reply = 'Thank you for your enquiry. Our showroom team in Umuahia is at your service. For instant personalized quotes or showroom visits, you can also reach us directly via WhatsApp.';
      const lower = textToSend.toLowerCase();

      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('umuahia')) {
        reply = 'We deliver safely within Umuahia and across Abia State. Standard delivery is ₦15,000, and orders above ₦300,000 enjoy free local delivery!';
      } else if (lower.includes('discount') || lower.includes('promo') || lower.includes('coupon')) {
        reply = 'You can use code WELCOME10 at checkout to receive 10% off your purchase!';
      } else if (lower.includes('payment') || lower.includes('paystack')) {
        reply = 'Orders can be submitted online with PENDING status. Our sales desk will verify your order items and facilitate secure payment upon order processing.';
      } else if (lower.includes('location') || lower.includes('address') || lower.includes('store')) {
        reply = 'Frankman Furniture & Electronics is proudly located in Umuahia, Abia State. Open Monday through Saturday, 8:30 AM to 6:30 PM.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'bot',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const quickActions = [
    { label: 'Delivery in Umuahia', query: 'What are your delivery options in Umuahia?' },
    { label: 'Available Discounts', query: 'Do you have any discount codes active?' },
    { label: 'Store Location & Hours', query: 'Where is your showroom located in Umuahia?' },
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
