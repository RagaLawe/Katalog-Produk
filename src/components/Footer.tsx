'use client';

import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/tentang', label: 'Tentang Kami' },
];

const categoryLinks = [
  { href: '/katalog?category=tenun', label: 'Tenun Ikat' },
  { href: '/katalog?category=songket', label: 'Tenun Songket' },
  { href: '/katalog?category=kopi', label: 'Kopi Bajawa' },
  { href: '/katalog?category=bambu', label: 'Kerajinan Bambu' },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50">
      {/* CTA Bar */}
      <div className="bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Tertarik dengan Produk Kami?
              </h3>
              <p className="text-white/70 text-sm sm:text-base">
                Jelajahi koleksi produk unggulan Kabupaten Ngada
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white shrink-0 rounded-lg"
            >
              <Link href="/katalog">
                Lihat Katalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Dinas Info */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground leading-tight">
                    Perindag
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight tracking-wide uppercase">
                    Kab. Ngada
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Dinas Perdagangan dan Perindustrian Kabupaten Ngada
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
                  <span>Jl. Soekarno No. 1, Bajawa, Kabupaten Ngada, NTT</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary/60 shrink-0" />
                  <span>(0384) 21001</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary/60 shrink-0" />
                  <span>perindag@ngadakab.go.id</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Navigasi
              </h3>
              <nav className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Category Links */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Kategori Produk
              </h3>
              <nav className="flex flex-col gap-2">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* About Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Tentang Katalog
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Katalog digital produk unggulan Kabupaten Ngada yang dikurasi oleh
                Dinas Perdagangan dan Perindustrian.
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-border/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} Dinas Perindag Kabupaten Ngada
              </p>
              <p className="text-xs text-muted-foreground">
                Dibuat dengan ❤️ untuk UMKM Ngada
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
