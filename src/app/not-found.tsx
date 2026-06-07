'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Tenun pattern background */}
      <div className="absolute inset-0 tenun-pattern opacity-40" />

      {/* Decorative circles */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-gold-accent/5 blur-3xl" />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Large 404 */}
          <h1 className="text-8xl sm:text-9xl font-black text-primary/20 leading-none mb-2 select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gold-accent/40" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <div className="h-px w-12 bg-gold-accent/40" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8">
            Maaf, halaman yang Anda cari tidak tersedia. Mungkin telah dipindahkan atau dihapus.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Kembali ke Beranda
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
              <Link href="/katalog">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Jelajahi Katalog
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Decorative tenun stripe at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex items-center justify-center gap-1"
        >
          <div className="h-1 w-8 rounded-full bg-primary/20" />
          <div className="h-1 w-4 rounded-full bg-gold-accent/30" />
          <div className="h-1 w-12 rounded-full bg-primary/15" />
          <div className="h-1 w-4 rounded-full bg-gold-accent/30" />
          <div className="h-1 w-8 rounded-full bg-primary/20" />
        </motion.div>
      </div>
    </div>
  );
}
