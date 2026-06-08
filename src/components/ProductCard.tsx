'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import CompareButton from '@/components/CompareButton';
import StarRating from '@/components/StarRating';
import QuickViewModal, { QuickViewButton } from '@/components/QuickViewModal';
import { useFavoritesStore } from '@/lib/favorites-store';

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
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || '6281313620658';
  const waMessage = `Halo Admin Perindag Ngada, saya tertarik dengan produk *${product.name}* seharga Rp *${formattedPrice}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;
  const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(waMessage)}`;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
    if (favorited) {
      toast.success('Dihapus dari favorit');
    } else {
      toast.success('Ditambahkan ke favorit');
    }
  };

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

        {/* Compare Button - top right */}
        <CompareButton product={product} />

        {/* Favorite Button - top right, below Compare Button */}
        <motion.button
          type="button"
          onClick={handleFavoriteClick}
          title={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          aria-label={favorited ? `Hapus ${product.name} dari favorit` : `Tambah ${product.name} ke favorit`}
          whileTap={{ scale: 0.8 }}
          className={`absolute top-12 right-3 z-[4] flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
            favorited
              ? 'bg-red-500/90 backdrop-blur-sm text-white shadow-md'
              : 'bg-background/80 backdrop-blur-sm text-muted-foreground border border-border/50 hover:bg-background hover:text-red-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Quick View Button - appears on hover */}
        {isHovered && (
          <QuickViewButton onClick={() => setQuickViewOpen(true)} />
        )}

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
          <div className="mb-1.5">
            <PriceDisplay price={product.price} className="text-lg" />
          </div>
          <div className="mb-2">
            <StarRating
              productId={product.id}
              interactive={false}
              size="sm"
              showCount={true}
            />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}
