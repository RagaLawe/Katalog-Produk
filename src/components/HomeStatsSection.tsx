'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Users, MapPin, Shield } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

interface CategoryCounts {
  tenun: number;
  kopi: number;
  bambu: number;
  total: number;
}

const statsConfig = [
  {
    key: 'total',
    icon: Package,
    valueKey: 'total' as const,
    suffix: '',
    label: 'Total Produk',
    iconColor: 'text-primary',
  },
  {
    key: 'pengrajin',
    icon: Users,
    value: 50,
    suffix: '+',
    label: 'Pengrajin Aktif',
    iconColor: 'text-coffee-brown',
  },
  {
    key: 'desa',
    icon: MapPin,
    value: 10,
    suffix: '+',
    label: 'Desa Penghasil',
    iconColor: 'text-bamboo-green',
  },
  {
    key: 'kabupaten',
    icon: Shield,
    value: 1,
    suffix: '',
    label: 'Kabupaten Ngada',
    iconColor: 'text-gold-accent',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function HomeStatsSection() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCounts | null>(null);

  useEffect(() => {
    async function fetchCounts() {
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
    fetchCounts();
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Dampak & Jangkauan
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Mendukung UMKM lokal di seluruh Kabupaten Ngada
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {statsConfig.map((stat) => {
            const Icon = stat.icon;
            const displayValue = stat.key === 'total' ? (categoryCounts?.total ?? 0) : (stat.value ?? 0);
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className="bg-card rounded-xl border border-border/40 p-5 sm:p-6 text-center"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted mb-3`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                  <AnimatedCounter
                    value={displayValue}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
