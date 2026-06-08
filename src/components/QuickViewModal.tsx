'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, MessageCircle, Heart, User, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import StarRating from '@/components/StarRating';
import { useFavoritesStore } from '@/lib/favorites-store';
import { toast } from 'sonner';

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

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({
  product,
  open,
  onOpenChange,
}: QuickViewModalProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  if (!product) return null;

  const favorited = isFavorite(product.id);
  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || '6281313620658';

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  const waMessage = `Halo Admin Perindag Ngada, saya tertarik dengan produk *${product.name}* seharga Rp *${formattedPrice}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;
  const waUrl = `https://wa.me/${adminWa}?text=${encodeURIComponent(waMessage)}`;

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
    if (favorited) {
      toast.success('Dihapus dari favorit');
    } else {
      toast.success('Ditambahkan ke favorit ❤️');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col md:flex-row"
            >
              {/* Image - left on desktop, top on mobile */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[400px] overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Decorative pattern overlay */}
                <div className="absolute inset-0 tenun-pattern opacity-20 pointer-events-none" />
                {/* Gold border glow */}
                <div className="absolute inset-0 ring-1 ring-inset ring-gold-accent/10 pointer-events-none" />
                {/* Category badge overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <CategoryBadge category={product.category} />
                </div>
              </div>

              {/* Info - right on desktop, bottom on mobile */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col">
                <DialogHeader className="p-0 mb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <DialogTitle className="text-lg sm:text-xl font-bold text-foreground leading-tight">
                        {product.name}
                      </DialogTitle>
                    </div>
                  </div>
                </DialogHeader>

                {/* Trust Badge */}
                <div className="mb-3">
                  <TrustBadge type="asli" />
                </div>

                {/* Star Rating */}
                <div className="mb-3">
                  <StarRating
                    productId={product.id}
                    interactive={false}
                    size="sm"
                    showCount={true}
                  />
                </div>

                {/* Price */}
                <div className="mb-4">
                  <PriceDisplay price={product.price} className="text-xl sm:text-2xl" />
                </div>

                {/* Description */}
                <div className="mb-4 flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                </div>

                {/* Artisan Info */}
                {product.artisanInfo && (
                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border-l-3 border-l-primary">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-semibold text-foreground">
                        Cerita Pengrajin
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      {product.artisanInfo}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-auto">
                  {/* Lihat Detail Lengkap */}
                  <Button asChild className="w-full gap-2">
                    <Link href={`/produk/${product.slug}`}>
                      <ExternalLink className="h-4 w-4" />
                      Lihat Detail Lengkap
                    </Link>
                  </Button>

                  <div className="flex gap-2">
                    {/* WhatsApp Button */}
                    <Button
                      asChild
                      className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white gap-2"
                    >
                      <a href={waUrl} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </a>
                    </Button>

                    {/* Favorite Button */}
                    <Button
                      variant="outline"
                      onClick={handleFavoriteClick}
                      className={`gap-2 ${
                        favorited
                          ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                          : 'hover:text-red-500 hover:border-red-200'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">
                        {favorited ? 'Favorit' : 'Tambah ke Favorit'}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// Quick View Button Overlay - to be used on ProductCard
export function QuickViewButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="absolute bottom-3 left-3 z-[3] flex items-center justify-center w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border/50 text-foreground hover:bg-foreground hover:text-background shadow-lg transition-colors cursor-pointer"
      aria-label="Quick view"
      title="Quick View"
    >
      <Eye className="h-5 w-5" />
    </motion.button>
  );
}
