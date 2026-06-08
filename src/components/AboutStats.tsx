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
    <section className="py-14 sm:py-16 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="tenun-pattern w-full h-full" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-foreground/10 mb-3">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="text-sm text-primary-foreground/90">
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
