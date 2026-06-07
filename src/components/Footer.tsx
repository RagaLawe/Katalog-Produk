'use client';

import Link from 'next/link';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/katalog', label: 'Katalog' },
  { href: '/tentang', label: 'Tentang' },
];

export default function Footer() {
  return (
    <footer className="mt-auto tenun-border-top bg-warm-cream-dark tenun-pattern">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Dinas Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
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
            <div className="space-y-2">
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
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/70 hover:text-primary transition-colors w-fit"
                >
                  {link.label}
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
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <p className="text-xs text-center text-foreground/50">
            © 2024 Dinas Perindag Kabupaten Ngada. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
