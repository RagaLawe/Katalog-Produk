'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import TestimonialsSection from '@/components/TestimonialsSection';
import HomeStatsSection from '@/components/HomeStatsSection';
import NewsletterSection from '@/components/NewsletterSection';
import CompareDrawer from '@/components/CompareDrawer';
import { ProductCardSkeletonGrid } from '@/components/ProductCardSkeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu' | 'songket';
  price: number;
  description: string;
  artisanInfo: string | null;
  imageUrl: string;
  isFeatured: boolean;
}

interface CategoryCounts {
  tenun: number;
  kopi: number;
  bambu: number;
  songket: number;
  total: number;
}

const categories = [
  {
    key: 'tenun' as const,
    title: 'Tenun Ikat',
    subtitle: 'Warisan Budaya',
    description: 'Kain tenun tradisional dengan motif khas yang ditenun secara tangan oleh pengrajin lokal',
    image: '/images/categories/tenun-ikat.png',
    href: '/katalog?category=tenun',
    accent: 'bg-tenun-red',
    textAccent: 'text-tenun-red',
  },
  {
    key: 'songket' as const,
    title: 'Tenun Songket',
    subtitle: 'Keindahan Sungkit Emas',
    description: 'Kain songket mewah dengan benang emas yang ditenun dengan teknik sungkit khas Ngada',
    image: '/images/categories/tenun-songket.png',
    href: '/katalog?category=songket',
    accent: 'bg-songket-gold',
    textAccent: 'text-songket-gold',
  },
  {
    key: 'kopi' as const,
    title: 'Kopi Bajawa',
    subtitle: 'Cita Rasa Mendunia',
    description: 'Kopi arabika premium dari dataran tinggi Bajawa dengan cita rasa yang Mendunia',
    image: '/images/categories/kopi-bajawa.png',
    href: '/katalog?category=kopi',
    accent: 'bg-coffee-brown',
    textAccent: 'text-coffee-brown',
  },
  {
    key: 'bambu' as const,
    title: 'Kerajinan Bambu',
    subtitle: 'Keahlian Turun-Temurun',
    description: 'Aneka kerajinan tangan dari bambu yang dibuat dengan keahlian turun-temurun',
    image: '/images/categories/kerajinan-bambu.png',
    href: '/katalog?category=bambu',
    accent: 'bg-bamboo-green',
    textAccent: 'text-bamboo-green',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts>({ tenun: 3, kopi: 3, bambu: 3, songket: 3, total: 12 });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 120]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    async function fetchData() {
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

      try {
        const res = await fetch('/api/products/count');
        if (res.ok) {
          const data = await res.json();
          setCategoryCounts(data);
        }
      } catch {
        // Keep default counts on error
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[75vh] min-h-[520px] max-h-[800px] overflow-hidden">
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

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16 sm:pb-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-xl"
          >
            <p className="text-sm font-medium text-white/60 uppercase tracking-widest mb-3">
              Etalase IKM Ngada
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-4 tracking-tight">
              Katalog Produk IKM Unggulan
            </h1>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed mb-8">
              Temukan kekayaan budaya dan produk lokal dari Bumi Todo Ngada.
              Dari tenun ikat yang memukau hingga kopi Bajawa yang Mendunia.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-11">
                <Link href="/katalog">
                  Jelajahi Katalog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white rounded-lg h-11">
                <Link href="/tentang">
                  Tentang Kami
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          type="button"
          onClick={() => {
            const el = document.getElementById('kategori-produk');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 cursor-pointer group"
          aria-label="Gulir ke bawah"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-white/50 text-[10px] font-medium tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-white/50" />
          </motion.div>
        </motion.button>

        {/* Bottom gradient blend */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
      </section>

      {/* Kategori Produk Section */}
      <section id="kategori-produk" className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Kategori Produk
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Jelajahi produk unggulan berdasarkan kategori
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
          >
            {categories.map((cat, i) => (
              <motion.div key={cat.title} variants={fadeInUp} custom={i}>
                <Link href={cat.href} className="category-card block rounded-xl overflow-hidden group">
                  <div className="relative h-64 sm:h-80 overflow-hidden">
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* Count badge */}
                    <div className={`absolute top-3 right-3 ${cat.accent} text-white text-xs font-semibold px-2.5 py-1 rounded-md`}>
                      {categoryCounts[cat.key]} Produk
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-1">
                        {cat.subtitle}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                        {cat.title}
                      </h3>
                      <p className="text-sm text-white/70 line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                        Lihat Produk
                        <ArrowRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <HomeStatsSection />

      {/* Produk Unggulan Section */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10 sm:mb-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Produk Unggulan
              </h2>
              <p className="text-muted-foreground text-base">
                Pilihan terbaik dari koleksi kami
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-lg shrink-0">
              <Link href="/katalog">
                Lihat Semua
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
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
      <section className="py-16 sm:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
              Tertarik dengan Produk Kami?
            </h2>
            <p className="text-white/70 text-base sm:text-lg mb-8 leading-relaxed">
              Hubungi admin kami melalui WhatsApp untuk informasi lebih lanjut tentang produk yang Anda minati.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg h-12 px-8 wa-pulse"
            >
              <a
                href={`https://wa.me/6281313620658?text=${encodeURIComponent('Halo Admin Etalase IKM Ngada, saya tertarik dengan produk unggulan Ngada. Mohon informasinya. Terima kasih.')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Tanya via WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Compare Drawer */}
      <CompareDrawer />
    </div>
  );
}
