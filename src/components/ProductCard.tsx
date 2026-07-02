'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Heart, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import CategoryBadge from '@/components/CategoryBadge';
import PriceDisplay from '@/components/PriceDisplay';
import CompareButton from '@/components/CompareButton';
import StarRating from '@/components/StarRating';
import QuickViewModal, { QuickViewButton } from '@/components/QuickViewModal';
import { useFavoritesStore } from '@/lib/favorites-store';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu' | 'songket';
  price: number;
  description: string;
  specifications: string | null;
  artisanInfo: string | null;
  ikmName: string | null;
  whatsappNumber: string | null;
  marketplaceUrl: string | null;
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
  const waNumber = product.whatsappNumber || adminWa;
  const waMessage = `Halo, saya tertarik dengan produk *${product.name}* seharga Rp *${formattedPrice}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

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
      className="product-card group bg-card rounded-xl overflow-hidden border border-border/40 h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className={`relative ${imageHeight || 'h-48 sm:h-52'} overflow-hidden`}>
        <Link href={`/produk/${product.slug}`} className="relative block h-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap z-[2]">
          <CategoryBadge category={product.category} />
        </div>

        {/* Compare Button */}
        <CompareButton product={product} />

        {/* Favorite Button */}
        <motion.button
          type="button"
          onClick={handleFavoriteClick}
          title={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          aria-label={favorited ? `Hapus ${product.name} dari favorit` : `Tambah ${product.name} ke favorit`}
          whileTap={{ scale: 0.85 }}
          className={`absolute top-12 right-3 z-[4] flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
            favorited
              ? 'bg-red-500 text-white shadow-sm'
              : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${favorited ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Quick View Button */}
        {isHovered && (
          <QuickViewButton onClick={() => setQuickViewOpen(true)} />
        )}

        {/* WhatsApp Quick-Action */}
        <motion.a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.9,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute bottom-3 right-3 z-[3] flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-sm transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Tanya ${product.name} via WhatsApp`}
        >
          <MessageCircle className="h-4 w-4" />
        </motion.a>

        {/* Marketplace Quick-Action (only if URL exists) */}
        {product.marketplaceUrl && (
          <motion.a
            href={product.marketplaceUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.9,
            }}
            transition={{ duration: 0.15, ease: 'easeOut', delay: 0.05 }}
            className="absolute bottom-3 right-14 z-[3] flex items-center justify-center w-9 h-9 rounded-full bg-foreground/90 hover:bg-foreground text-background shadow-sm transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`Beli ${product.name} di Marketplace`}
            title="Beli di Marketplace"
          >
            <ExternalLink className="h-4 w-4" />
          </motion.a>
        )}
      </div>

      {/* Content Area */}
      <Link href={`/produk/${product.slug}`}>
        <div className="p-4">
          <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 line-clamp-1">
            {product.name}
          </h3>
          <div className="mb-1.5">
            <PriceDisplay price={product.price} className="text-base" />
          </div>
          <div className="mb-2">
            <StarRating
              productId={product.id}
              interactive={false}
              size="sm"
              showCount={true}
            />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </div>
  );
}
