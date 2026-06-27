'use client';

import { Package, Users, MapPin, Sparkles } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

const stats = [
  { icon: Package, value: 3, suffix: '', label: 'Kategori Produk' },
  { icon: Users, value: 50, suffix: '+', label: 'Pengrajin Aktif' },
  { icon: MapPin, value: 10, suffix: '+', label: 'Desa Penghasil' },
  { icon: Sparkles, value: 1, suffix: '', label: 'Kabupaten, Banyak Potensi' },
];

export default function AboutStats() {
  return (
    <section className="py-14 sm:py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 mb-3">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-xs sm:text-sm text-white/70">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
