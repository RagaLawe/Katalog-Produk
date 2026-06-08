'use client';

import Link from 'next/link';
import { Shield, Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight, Package, Users, MapPin as MapPinIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog Produk' },
  { href: '/tentang', label: 'Tentang Kami' },
];

const socialLinks = [
  { href: '#', label: 'Facebook', icon: Facebook },
  { href: '#', label: 'Instagram', icon: Instagram },
  { href: '#', label: 'YouTube', icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* CTA Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-1">
                Tertarik dengan Produk Kami?
              </h3>
              <p className="text-primary-foreground/75 text-sm sm:text-base">
                Jelajahi koleksi produk unggulan Kabupaten Ngada
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground shrink-0"
            >
              <Link href="/katalog">
                Lihat Katalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Wave Divider */}
      <div className="relative bg-warm-cream-dark">
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
              className="fill-warm-cream-dark"
            />
          </svg>
        </div>

        {/* Tenun border between CTA and main footer */}
        <div className="tenun-border-top tenun-pattern">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Dinas Info */}
              <div className="space-y-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-primary leading-tight">
                      Perindag
                    </span>
                    <span className="text-xs text-secondary leading-tight">
                      Kabupaten Ngada
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Dinas Perdagangan dan Perindustrian Kabupaten Ngada
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2 text-sm text-foreground/70">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      Jl. Soekarno No. 1, Bajawa, Kabupaten Ngada, NTT
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>(0384) 21001</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <span>perindag@ngadakab.go.id</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Tautan Cepat
                </h3>
                <nav className="flex flex-col gap-2.5">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-foreground/70 hover:text-primary transition-colors w-fit group"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Tentang Katalog
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  Katalog digital produk unggulan Kabupaten Ngada yang dikurasi oleh
                  Dinas Perdagangan dan Perindustrian. Mendukung UMKM lokal dan
                  melestarikan kearifan budaya NTT.
                </p>
              </div>

              {/* Social Media */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                  Ikuti Kami
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats Mini Section */}
            <div className="mt-8 pt-5 border-t border-border/30">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm text-foreground/50">
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5" />
                  <span>3 Kategori</span>
                </div>
                <span className="text-border/50">•</span>
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>50+ Pengrajin</span>
                </div>
                <span className="text-border/50">•</span>
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="h-3.5 w-3.5" />
                  <span>10+ Desa</span>
                </div>
              </div>
            </div>

            {/* Separator & Copyright */}
            <div className="mt-5 pt-5 border-t border-border/50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary/50" />
                  <p className="text-xs text-foreground/50">
                    © {new Date().getFullYear()} Dinas Perindag Kabupaten Ngada. Hak Cipta Dilindungi.
                  </p>
                </div>
                <p className="text-xs text-foreground/50">
                  Dibuat dengan ❤️ untuk UMKM Ngada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
