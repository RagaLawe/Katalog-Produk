'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, User, Quote, CheckCircle, Star, Heart, Eye, Printer, Package, Building2, ExternalLink, Ruler } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import type { CarouselApi } from '@/components/ui/carousel';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShareButton from '@/components/ShareButton';
import ProductCard from '@/components/ProductCard';
import ImageLightbox from '@/components/ImageLightbox';
import RecentlyViewedProducts, { addToRecentlyViewed } from '@/components/RecentlyViewedProducts';
import StarRating from '@/components/StarRating';
import ProductReviews from '@/components/ProductReviews';
import { useFavoritesStore } from '@/lib/favorites-store';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
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

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
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

interface ProductDetailContentProps {
  product: Product;
  relatedProducts: RelatedProduct[];
  crossCategoryProducts: RelatedProduct[];
}

const categoryIconMap: Record<string, string> = {
  tenun: '🧶',
  kopi: '☕',
  bambu: '🎋',
  songket: '🪡',
};

const categoryLabelMap: Record<string, string> = {
  tenun: 'Tenun Ikat',
  kopi: 'Kopi Bajawa',
  bambu: 'Kerajinan Bambu',
  songket: 'Tenun Songket',
};

const categorySlugMap: Record<string, string> = {
  tenun: 'tenun',
  kopi: 'kopi',
  bambu: 'bambu',
  songket: 'songket',
};

const categoryImageMap: Record<string, string> = {
  tenun: '/images/categories/tenun-ikat.png',
  kopi: '/images/categories/kopi-bajawa.png',
  bambu: '/images/categories/kerajinan-bambu.png',
  songket: '/images/categories/tenun-songket.png',
};

const categorySlideLabelMap: Record<string, string> = {
  tenun: 'Koleksi Tenun Ikat Ngada',
  kopi: 'Koleksi Kopi Bajawa',
  bambu: 'Koleksi Kerajinan Bambu',
  songket: 'Koleksi Tenun Songket Ngada',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

// Price range constants
const PRICE_MIN = 50000;
const PRICE_MAX = 750000;

export default function ProductDetailContent({
  product,
  relatedProducts,
  crossCategoryProducts,
}: ProductDetailContentProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [viewCount, setViewCount] = useState<number | null>(null);
  const hasRecordedView = useRef(false);

  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  const handleFavoriteToggle = () => {
    toggleFavorite(product.id);
    if (favorited) {
      toast.success('Dihapus dari favorit');
    } else {
      toast.success('Ditambahkan ke favorit ❤️');
    }
  };

  const categoryLabel = categoryLabelMap[product.category] || product.category;
  const categoryIcon = categoryIconMap[product.category] || '📦';
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  // Availability status based on product
  const availabilityStatus = product.isFeatured
    ? { label: 'Stok Terbatas', icon: '⚡', color: 'text-amber-600 dark:text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800' }
    : { label: 'Tersedia', icon: '✓', color: 'text-emerald-600 dark:text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' };

  // Price range calculation
  const pricePosition = Math.max(0, Math.min(100, ((product.price - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100));

  // Build carousel slides: product image + category showcase image
  const slides = [
    {
      url: product.imageUrl,
      alt: product.name,
    },
    {
      url: categoryImageMap[product.category] || product.imageUrl,
      alt: categorySlideLabelMap[product.category] || categoryLabel,
    },
  ];

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  // Listen to carousel changes
  if (api) {
    api.on('select', onSelect);
  }

  // Track recently viewed product on mount and record view
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
    });

    // Record a product view (only once per mount)
    if (!hasRecordedView.current) {
      hasRecordedView.current = true;
      fetch(`/api/products/${product.slug}/view`, { method: 'POST' })
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.viewCount !== undefined) {
            setViewCount(data.viewCount);
          }
        })
        .catch(() => {
          // Silently fail - view tracking is non-essential
        });
    }
  }, [product]);

  return (
    <div className="min-h-screen">
      {/* Enhanced Breadcrumb */}
      <nav className="bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Beranda
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link href="/katalog" className="hover:text-primary transition-colors">
                Katalog
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link
                href={`/katalog?kategori=${categorySlugMap[product.category] || product.category}`}
                className="hover:text-primary transition-colors"
              >
                {categoryLabel}
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="text-primary font-semibold truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {/* Product Image Carousel */}
            <div>
              <Carousel
                setApi={setApi}
                className="w-full"
                opts={{ loop: true }}
              >
                <CarouselContent>
                  {slides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <button
                        type="button"
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                        className="relative aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-muted shadow-lg border-2 border-gold-accent/20 w-full cursor-zoom-in block"
                      >
                        <Image
                          src={slide.url}
                          alt={slide.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority={index === 0}
                        />
                        {/* Decorative pattern overlay */}
                        <div className="absolute inset-0 tenun-pattern opacity-30 pointer-events-none" />
                        {/* Subtle gold border glow */}
                        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-gold-accent/10 pointer-events-none" />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>

              {/* Indicator Dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => api?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      current === index
                        ? 'w-8 bg-primary'
                        : 'w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap mb-4">
                <CategoryBadge category={product.category as 'tenun' | 'kopi' | 'bambu' | 'songket'} />
                <TrustBadge type="asli" />
                <TrustBadge type="dikurasi" />
              </div>

              {/* Product Quick Info Bar */}
              <div className="flex items-center gap-4 flex-wrap mb-4 p-3 bg-warm-cream-dark/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-1.5 text-sm text-foreground/80">
                  <span className="text-base">{categoryIcon}</span>
                  <span className="font-medium">{categoryLabel}</span>
                </div>
                <div className="w-px h-4 bg-border/70" />
                <div className="flex items-center gap-1.5 text-sm text-bamboo-green">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Produk Asli</span>
                </div>
                {product.isFeatured && (
                  <>
                    <div className="w-px h-4 bg-border/70" />
                    <div className="flex items-center gap-1.5 text-sm text-gold-accent">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">Unggulan</span>
                    </div>
                  </>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>

              {/* View Count */}
              {viewCount !== null && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                  <Eye className="h-4 w-4" />
                  <span>Dilihat {viewCount} kali</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-3">
                <PriceDisplay price={product.price} className="text-2xl sm:text-3xl" />
              </div>

              {/* Availability Status Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${availabilityStatus.bg} ${availabilityStatus.color} ${availabilityStatus.border}`}>
                  <span>{availabilityStatus.icon}</span>
                  {availabilityStatus.label}
                </span>
              </div>

              {/* Price Range Indicator */}
              <div className="mb-5 p-3 bg-muted/50 rounded-lg border border-border/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Kisaran Harga</span>
                  <span className="text-xs text-muted-foreground">
                    Rp50.000 — Rp750.000
                  </span>
                </div>
                <div className="relative h-2 bg-gradient-to-r from-emerald-200 via-amber-200 to-primary/30 rounded-full overflow-visible">
                  {/* Marker dot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-white shadow-md transition-all duration-500"
                    style={{ left: `${pricePosition}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-muted-foreground">Murah</span>
                  <span className="text-[10px] text-muted-foreground">Mahal</span>
                </div>
              </div>

              {/* Description */}
              {product.description ? (
                <div className="mb-6">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                    Deskripsi Produk
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              ) : null}

              {/* Product Specifications */}
              {product.specifications && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-6 rounded-xl border border-border/60 bg-muted/30 p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Ruler className="h-4 w-4 text-songket-gold" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Spesifikasi Produk
                    </h3>
                  </div>
                  <div className="w-10 h-0.5 bg-songket-gold/30 rounded-full mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.specifications}
                  </p>
                </motion.div>
              )}

              {/* Star Rating */}
              <div className="mb-6">
                <StarRating
                  productId={product.id}
                  interactive={true}
                  size="lg"
                  showCount={true}
                />
              </div>

              {/* IKM / Artisan Info - Enhanced with decorative elements */}
              {(product.ikmName || product.artisanInfo) && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="mb-6 relative overflow-hidden rounded-xl border-l-4 border-l-primary bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-6 pl-7"
                >
                  {/* Large decorative quote mark SVG - behind text */}
                  <svg
                    className="absolute top-2 right-3 h-24 w-24 text-primary/[0.06] pointer-events-none"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M25 45 C25 30, 35 20, 50 20 L50 30 C40 30, 35 35, 35 45 L35 55 L50 55 L50 75 L25 75 Z" />
                    <path d="M60 45 C60 30, 70 20, 85 20 L85 30 C75 30, 70 35, 70 45 L70 55 L85 55 L85 75 L60 75 Z" />
                  </svg>

                  {/* Section header with decorative line */}
                  <div className="flex items-center gap-2 mb-4">
                    {product.ikmName ? (
                      <Building2 className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                    <h3 className="text-sm font-semibold text-foreground">
                      {product.ikmName || 'Cerita Pengrajin'}
                    </h3>
                  </div>

                  {/* Decorative line above IKM name */}
                  <div className="w-10 h-0.5 bg-primary/30 rounded-full mb-3" />

                  {/* IKM badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gold-accent/10 text-gold-accent border border-gold-accent/20">
                      <Package className="h-2.5 w-2.5" />
                      IKM Lokal Ngada
                    </span>
                  </div>

                  {/* IKM story text */}
                  {product.artisanInfo && (
                    <p className="text-sm text-muted-foreground leading-relaxed relative z-10 whitespace-pre-line">
                      {product.artisanInfo}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Category Info */}
              <div className="mb-6 p-4 bg-warm-cream-dark/50 rounded-lg border border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Kategori:</span>
                  <span className="text-sm font-medium text-foreground">{categoryLabel}</span>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden lg:flex gap-3">
                <WhatsAppButton
                  productName={product.name}
                  price={formattedPrice}
                  size="lg"
                  whatsappNumber={product.whatsappNumber}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
                />
                {product.marketplaceUrl && (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <a href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      <span>Marketplace</span>
                    </a>
                  </Button>
                )}
                <ShareButton size="lg" />
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.print()}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span>Cetak</span>
                </Button>
                <motion.button
                  type="button"
                  onClick={handleFavoriteToggle}
                  whileTap={{ scale: 0.9 }}
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-md border transition-all duration-200 cursor-pointer ${
                    favorited
                      ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                      : 'bg-background border-input text-muted-foreground hover:text-red-500 hover:border-red-200'
                  }`}
                  aria-label={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                  title={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                >
                  <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Reviews Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProductReviews productId={product.id} />
        </div>
      </section>

      {/* Related Products Section (Same Category) */}
      {relatedProducts.length > 0 && (
        <section className="py-12 sm:py-16 bg-warm-cream-dark/50 tenun-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Produk Serupa
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                Produk lain dalam kategori yang sama
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {relatedProducts.map((related, i) => (
                <motion.div key={related.id} variants={fadeInUp} custom={i}>
                  <ProductCard product={related} imageHeight="h-44 sm:h-48" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Cross-Category Recommendations Section */}
      {crossCategoryProducts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 sm:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Anda Juga Mungkin Suka
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                Produk dari kategori lain yang mungkin menarik
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {crossCategoryProducts.map((crossProduct, i) => (
                <motion.div key={crossProduct.id} variants={fadeInUp} custom={i}>
                  <ProductCard product={crossProduct} imageHeight="h-44 sm:h-48" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      <RecentlyViewedProducts />

      {/* WhatsApp CTA - Mobile (Sticky Bottom) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border/50 p-4" style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
        <div className="flex gap-3">
          <WhatsAppButton
            productName={product.name}
            price={formattedPrice}
            size="lg"
            whatsappNumber={product.whatsappNumber}
            className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
          />
          {product.marketplaceUrl && (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="shrink-0 gap-2"
            >
              <a href={product.marketplaceUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <ShareButton size="lg" />
          <motion.button
            type="button"
            onClick={handleFavoriteToggle}
            whileTap={{ scale: 0.9 }}
            className={`inline-flex items-center justify-center h-10 w-10 rounded-md border transition-all duration-200 cursor-pointer shrink-0 ${
              favorited
                ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400'
                : 'bg-background border-input text-muted-foreground hover:text-red-500 hover:border-red-200'
            }`}
            aria-label={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
            title={favorited ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Spacer for mobile sticky button */}
      <div className="lg:hidden h-20" />

      {/* Image Lightbox */}
      <ImageLightbox
        images={slides}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
