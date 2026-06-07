'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import TrustBadge from '@/components/TrustBadge';
import PriceDisplay from '@/components/PriceDisplay';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductCard from '@/components/ProductCard';
import FloatingOrbs from '@/components/FloatingOrbs';
import TestimonialsSection from '@/components/TestimonialsSection';
import HomeStatsSection from '@/components/HomeStatsSection';
import NewsletterSection from '@/components/NewsletterSection';
import CompareDrawer from '@/components/CompareDrawer';
import { ProductCardSkeletonGrid } from '@/components/ProductCardSkeleton';

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

const categories = [
  {
    title: 'Tenun Ikat Ngada',
    description: 'Kain tenun tradisional dengan motif khas yang ditenun secara tangan oleh pengrajin lokal',
    image: '/images/categories/tenun-ikat.png',
    href: '/katalog?category=tenun',
    count: 3,
    countLabel: '3 Produk',
    accentColor: 'bg-primary',
    accentBorder: 'border-b-primary',
    badgeBg: 'bg-primary/90',
    patternColor: 'rgba(139, 0, 0, 0.08)',
  },
  {
    title: 'Kopi Bajawa',
    description: 'Kopi arabika premium dari dataran tinggi Bajawa dengan cita rasa yang Mendunia',
    image: '/images/categories/kopi-bajawa.png',
    href: '/katalog?category=kopi',
    count: 3,
    countLabel: '3 Produk',
    accentColor: 'bg-secondary',
    accentBorder: 'border-b-secondary',
    badgeBg: 'bg-secondary/90',
    patternColor: 'rgba(111, 78, 55, 0.08)',
  },
  {
    title: 'Kerajinan Bambu',
    description: 'Aneka kerajinan tangan dari bambu yang dibuat dengan keahlian turun-temurun',
    image: '/images/categories/kerajinan-bambu.png',
    href: '/katalog?category=bambu',
    count: 3,
    countLabel: '3 Produk',
    accentColor: 'bg-bamboo-green',
    accentBorder: 'border-b-bamboo-green',
    badgeBg: 'bg-bamboo-green/90',
    patternColor: 'rgba(91, 117, 83, 0.08)',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const heroWordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Parallax scroll transforms
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  return (
    <div>
      {/* Hero Section with Parallax */}
      <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/images/hero-ngada.png"
            alt="Pemandangan Kabupaten Ngada - Bumi Todo Ngada"
            fill
            className="object-cover scale-110"
            sizes="100vw"
            priority
          />
        </motion.div>
        <div className="hero-gradient absolute inset-0" />
        <FloatingOrbs />
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 sm:pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              <motion.span
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                initial="hidden"
                animate="visible"
                className="inline-flex flex-wrap"
              >
                {'Katalog Produk Unggulan Kabupaten Ngada'.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    variants={heroWordVariants}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.span>
            </h1>
            <p className="text-base sm:text-lg text-white/85 leading-relaxed mb-8">
              Temukan kekayaan budaya dan produk lokal dari Bumi Todo Ngada.
              Dari tenun ikat yang memukau hingga kopi Bajawa yang Mendunia.
            </p>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/katalog">
                  Jelajahi Katalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white">
                <Link href="/tentang">
                  Tentang Kami
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Decorative gradient overlay at bottom blending into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Kategori Produk Section */}
      <section className="py-16 sm:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 section-accent">
              Kategori Produk
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Jelajahi produk unggulan berdasarkan kategori
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.title} variants={fadeInUp} custom={i}>
                <Link href={cat.href} className={`category-card block rounded-xl overflow-hidden shadow-md group border-b-4 ${cat.accentBorder}`}>
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Gradient overlay with decorative pattern texture */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    {/* Subtle decorative pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        backgroundImage: `repeating-linear-gradient(45deg, ${cat.patternColor} 0px, ${cat.patternColor} 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, ${cat.patternColor} 0px, ${cat.patternColor} 1px, transparent 1px, transparent 8px)`,
                        backgroundSize: '12px 12px',
                      }}
                    />
                    {/* Product count badge */}
                    <div className={`absolute top-3 right-3 ${cat.badgeBg} backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm`}>
                      {cat.countLabel}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-white/80 line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-gold-accent group-hover:translate-x-1 transition-transform">
                        Lihat Produk
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats/Impact Section */}
      <HomeStatsSection />

      {/* Produk Unggulan Section */}
      <section className="py-16 sm:py-20 bg-warm-cream-dark/50 tenun-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 section-accent">
              Produk Unggulan
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Pilihan terbaik dari koleksi kami
            </p>
          </motion.div>

          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {products.map((product, i) => (
                <motion.div key={product.id} variants={fadeInUp} custom={i}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 bg-primary overflow-hidden">
        {/* Decorative top wave divider */}
        <div className="absolute top-0 left-0 right-0 -translate-y-[99%] z-10">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto block"
            preserveAspectRatio="none"
          >
            <path
              d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z"
              className="fill-primary"
            />
          </svg>
        </div>
        {/* Tenun pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="tenun-pattern w-full h-full" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
              Tertarik dengan Produk Kami?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-8 leading-relaxed">
              Hubungi admin kami melalui WhatsApp untuk informasi lebih lanjut tentang produk yang Anda minati.
            </p>
            <WhatsAppButton
              productName="Produk Unggulan Ngada"
              price="sesuai katalog"
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Compare Drawer */}
      <CompareDrawer />
    </div>
  );
}
