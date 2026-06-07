'use client';

import { motion } from 'framer-motion';
import { Package, Users, MapPin, Shield } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

const stats = [
  {
    icon: Package,
    value: 3,
    suffix: '',
    label: 'Kategori Produk',
    color: 'primary',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    borderColor: 'border-primary/20',
    accentBg: 'bg-primary',
  },
  {
    icon: Users,
    value: 50,
    suffix: '+',
    label: 'Pengrajin Aktif',
    color: 'secondary',
    bgColor: 'bg-secondary/10',
    iconColor: 'text-secondary',
    borderColor: 'border-secondary/20',
    accentBg: 'bg-secondary',
  },
  {
    icon: MapPin,
    value: 10,
    suffix: '+',
    label: 'Desa Penghasil',
    color: 'bamboo',
    bgColor: 'bg-bamboo-green/10',
    iconColor: 'text-bamboo-green',
    borderColor: 'border-bamboo-green/20',
    accentBg: 'bg-bamboo-green',
  },
  {
    icon: Shield,
    value: 1,
    suffix: '',
    label: 'Kabupaten Ngada',
    color: 'gold',
    bgColor: 'bg-gold-accent/10',
    iconColor: 'text-gold-accent',
    borderColor: 'border-gold-accent/20',
    accentBg: 'bg-gold-accent',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export default function HomeStatsSection() {
  return (
    <section className="py-14 sm:py-16 bg-warm-cream-dark/30 tenun-pattern relative overflow-hidden">
      {/* Decorative top/bottom gradient fades */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 section-accent">
            Dampak & Jangkauan
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
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
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={cardVariants}
                className={`relative bg-card rounded-xl border ${stat.borderColor} p-5 sm:p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group`}
              >
                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${stat.accentBg} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Decorative corner pattern */}
                <div className="absolute -top-6 -right-6 w-16 h-16 opacity-[0.04] pointer-events-none">
                  <svg viewBox="0 0 64 64" fill="currentColor" className={`${stat.iconColor} w-full h-full`}>
                    <path d="M0 0h16v16H0V0zm24 0h16v16H24V0zm24 0h16v16H48V0zM0 24h16v16H0V24zm24 0h16v16H24V24zm24 0h16v16H48V24zM0 48h16v16H0V48zm24 0h16v16H24V48zm24 0h16v16H48V48z" />
                  </svg>
                </div>

                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1.5">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
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
