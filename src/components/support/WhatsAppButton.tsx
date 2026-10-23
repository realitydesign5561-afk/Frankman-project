import React from 'react';
import { MessageCircle } from 'lucide-react';

export function formatWhatsAppUrl(phoneNumber: string, message: string): string {
  // Normalize phone number: remove +, spaces, dashes
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = '2348031234567',
  message = 'Hello Frankman Furniture & Electronics, I would like to inquire about your products in Umuahia.',
  label = 'Chat on WhatsApp',
  className = '',
  size = 'md',
  variant = 'solid',
}) => {
  const url = formatWhatsAppUrl(phoneNumber, message);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  const variantClasses = {
    solid: 'bg-[#1E7E34] hover:bg-[#186629] text-white shadow-sm',
    outline: 'border border-[#1E7E34] text-[#1E7E34] hover:bg-[#1E7E34]/10',
    subtle: 'bg-[#EBF7EE] text-[#1E7E34] hover:bg-[#DCF2E0]',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </a>
  );
};
