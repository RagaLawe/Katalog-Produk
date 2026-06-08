'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  productName: string;
  price: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export default function WhatsAppButton({
  productName,
  price,
  className,
  size = 'default',
}: WhatsAppButtonProps) {
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || '6281313620658';

  const message = `Halo Admin Perindag Ngada, saya tertarik dengan produk *${productName}* seharga Rp *${price}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;

  const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(message)}`;

  return (
    <Button
      asChild
      size={size}
      className={`bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse ${className || ''}`}
    >
      <a href={waUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        <span>Tanya via WhatsApp</span>
      </a>
    </Button>
  );
}
