'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import CompareButton from '@/components/CompareButton';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu';
  price: number;
  description: string;
  artisanInfo: string | null;
  imageUrl: string;
  isFeatured: boolean;
}

interface ProductCardProps {
  product: Product;
  showTrustBadge?: boolean;
  imageHeight?: string;
}

export default function ProductCard({ product, showTrustBadge = true, imageHeight }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || '6281234567890';
  const waMessage = `Halo Admin Perindag Ngada, saya tertarik dengan produk *${product.name}* seharga Rp *${formattedPrice}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;
  const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      className="product-card group bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 h-full relative transition-all duration-300 hover:ring-1 hover:ring-primary/20 hover:shadow-lg hover:shadow-primary/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className={`relative ${imageHeight || 'h-52 sm:h-56'} overflow-hidden`}>
        <Link href={`/produk/${product.slug}`} className="relative block h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110 hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Hover overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-[2]">
          <CategoryBadge category={product.category} />
          {showTrustBadge && <TrustBadge type="asli" />}
        </div>

        {/* Compare Button */}
        <CompareButton product={product} />

        {/* WhatsApp Quick-Action Button - appears on hover */}
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="absolute bottom-3 right-3 z-[3] flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Tanya ${product.name} via WhatsApp`}
        >
          <MessageCircle className="h-5 w-5" />
        </motion.a>
      </div>

      {/* Content Area */}
      <Link href={`/produk/${product.slug}`}>
        <div className="p-4 sm:p-5">
          <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="mb-2">
            <PriceDisplay price={product.price} className="text-lg" />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>
    </div>
  );
}
