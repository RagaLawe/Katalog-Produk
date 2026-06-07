'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, User, Quote, CheckCircle, Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShareButton from '@/components/ShareButton';
import ImageLightbox from '@/components/ImageLightbox';
import RecentlyViewedProducts, { addToRecentlyViewed } from '@/components/RecentlyViewedProducts';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description: string;
  artisanInfo: string | null;
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
  imageUrl: string;
  isFeatured: boolean;
}

interface ProductDetailContentProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

const categoryIconMap: Record<string, string> = {
  tenun: '🧶',
  kopi: '☕',
  bambu: '🎋',
};

const categoryLabelMap: Record<string, string> = {
  tenun: 'Tenun Ikat',
  kopi: 'Kopi Bajawa',
  bambu: 'Kerajinan Bambu',
};

const categoryImageMap: Record<string, string> = {
  tenun: '/images/categories/tenun-ikat.png',
  kopi: '/images/categories/kopi-bajawa.png',
  bambu: '/images/categories/kerajinan-bambu.png',
};

const categorySlideLabelMap: Record<string, string> = {
  tenun: 'Koleksi Tenun Ikat Ngada',
  kopi: 'Koleksi Kopi Bajawa',
  bambu: 'Koleksi Kerajinan Bambu',
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function ProductDetailContent({
  product,
  relatedProducts,
}: ProductDetailContentProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categoryLabel = categoryLabelMap[product.category] || product.category;
  const categoryIcon = categoryIconMap[product.category] || '📦';
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

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

  // Track recently viewed product on mount
  useEffect(() => {
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.price,
    });
  }, [product]);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-primary/5 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
            <li className="text-foreground font-medium truncate max-w-[200px]">
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
                <CategoryBadge category={product.category as 'tenun' | 'kopi' | 'bambu'} />
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
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-5">
                <PriceDisplay price={product.price} className="text-2xl sm:text-3xl" />
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">
                  Deskripsi Produk
                </h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Artisan Info - Enhanced */}
              {product.artisanInfo && (
                <div className="mb-6 relative overflow-hidden rounded-lg border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent p-5 pl-6">
                  {/* Decorative quote icon */}
                  <Quote className="absolute top-3 right-4 h-10 w-10 text-primary/10" />
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">
                      Cerita Pengrajin
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed relative z-10 italic">
                    {product.artisanInfo}
                  </p>
                </div>
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
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
                />
                <ShareButton size="lg" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products Section */}
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
                  <Link
                    href={`/produk/${related.slug}`}
                    className="product-card block bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 h-full"
                  >
                    <div className="relative h-44 sm:h-48 overflow-hidden">
                      <Image
                        src={related.imageUrl}
                        alt={related.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <CategoryBadge category={related.category as 'tenun' | 'kopi' | 'bambu'} />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 line-clamp-1">
                        {related.name}
                      </h3>
                      <PriceDisplay price={related.price} className="text-base" />
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-2">
                        {related.description}
                      </p>
                    </div>
                  </Link>
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
            className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white wa-pulse"
          />
          <ShareButton size="lg" />
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
