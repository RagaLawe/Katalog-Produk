'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  Calendar,
  Package,
  Users,
  ArrowRight,
  ArrowLeft,
  Star,
  Phone,
  MessageCircle,
  ExternalLink,
  User,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Breadcrumb from '@/components/Breadcrumb';
import ScrollReveal from '@/components/ScrollReveal';
import ProductCard from '@/components/ProductCard';
import {
  CATEGORY_META,
  getIkmInitials,
  getIkmAvatarColor,
  getIkmHeroGradient,
  getIkmCategoryBadgeClasses,
  formatIkmAddress,
  buildIkmWhatsappUrl,
  type IkmCategory,
} from '@/lib/ikm-utils';

interface IkmProduct {
  id: string;
  name: string;
  slug: string;
  category: IkmCategory;
  price: number;
  description: string;
  imageUrl: string;
  isFeatured: boolean;
  whatsappNumber?: string | null;
  marketplaceUrl?: string | null;
}

interface Ikm {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: IkmCategory;
  address?: string | null;
  phone?: string | null;
  whatsappNumber?: string | null;
  marketplaceUrl?: string | null;
  establishedYear?: number | null;
  leaderName?: string | null;
  memberCount?: number | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  products: IkmProduct[];
  _count?: { products: number };
}

interface ProductCardProduct {
  id: string;
  name: string;
  slug: string;
  category: IkmCategory;
  price: number;
  description: string;
  specifications: string | null;
  artisanInfo: string | null;
  ikmName: string | null;
  whatsappNumber: string | null;
  marketplaceUrl: string | null;
  imageUrl: string;
  isFeatured: boolean;
}

export default function IkmProfilePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [ikm, setIkm] = useState<Ikm | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchIkm() {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`/api/ikm/${encodeURIComponent(slug || '')}`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setIkm(data);
        } else {
          if (!cancelled) setNotFound(true);
        }
      } catch (err) {
        console.error('Failed to fetch IKM:', err);
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (slug) fetchIkm();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <IkmProfileSkeleton />;
  }

  if (notFound || !ikm) {
    return <IkmNotFound />;
  }

  return <IkmProfileContent ikm={ikm} />;
}

/* ---------------- Main content ---------------- */

function IkmProfileContent({ ikm }: { ikm: Ikm }) {
  const meta = CATEGORY_META[ikm.category] ?? CATEGORY_META.tenun;
  const CategoryIcon = meta.icon;
  const initials = getIkmInitials(ikm.name);
  const waUrl = buildIkmWhatsappUrl(ikm.name, ikm.whatsappNumber);
  const badgeClasses = getIkmCategoryBadgeClasses(ikm.category);
  const productCount = ikm._count?.products ?? ikm.products.length;
  const description = ikm.description?.trim();
  const address = formatIkmAddress(ikm.address);

  // Adapt products to ProductCard's interface (add missing fields with sensible defaults)
  const productCardProducts: ProductCardProduct[] = useMemo(
    () =>
      ikm.products.map((p) => ({
        ...p,
        specifications: null,
        artisanInfo: null,
        ikmName: ikm.name,
        whatsappNumber: p.whatsappNumber ?? null,
        marketplaceUrl: p.marketplaceUrl ?? null,
      })),
    [ikm.products, ikm.name]
  );

  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'IKM', href: '/ikm' },
          { label: ikm.name },
        ]}
      />

      {/* Hero Section */}
      <section
        className={`bg-gradient-to-br ${getIkmHeroGradient(ikm.category)} border-b border-border/40`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7"
          >
            {/* Avatar */}
            <div
              className={`flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0 font-bold text-2xl sm:text-3xl shadow-md ${getIkmAvatarColor(
                ikm.category
              )}`}
              aria-hidden="true"
            >
              {initials}
            </div>

            {/* Title + badges */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge
                  variant="outline"
                  className={`${badgeClasses} text-xs font-medium`}
                >
                  <CategoryIcon className="h-3 w-3 mr-1" />
                  {meta.label}
                </Badge>
                {ikm.isFeatured && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-xs font-medium">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    IKM Unggulan
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 tracking-tight leading-tight">
                {ikm.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-muted-foreground">
                {ikm.establishedYear && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Berdiri sejak {ikm.establishedYear}
                  </span>
                )}
                {ikm.memberCount != null && ikm.memberCount > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {ikm.memberCount} anggota pengrajin
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  {productCount} produk
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          {(waUrl || ikm.marketplaceUrl) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3"
            >
              {waUrl && (
                <Button
                  asChild
                  size="default"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg h-10"
                >
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              )}
              {ikm.marketplaceUrl && (
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="rounded-lg h-10"
                >
                  <a
                    href={ikm.marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Kunjungi Marketplace
                    <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                  </a>
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Description (left, 2 cols) */}
            <ScrollReveal className="lg:col-span-2" direction="up">
              <div className="bg-card rounded-xl border border-border/40 p-6 sm:p-7">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Tentang IKM Ini
                </h2>
                {description ? (
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground/60 italic">
                    Belum ada deskripsi untuk IKM ini.
                  </p>
                )}
              </div>
            </ScrollReveal>

            {/* Info card (right, 1 col) */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="bg-card rounded-xl border border-border/40 p-6 sm:p-7 h-full">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Informasi Kontak
                </h2>
                <dl className="space-y-3 text-sm">
                  <InfoRow
                    icon={MapPin}
                    label="Alamat"
                    value={address}
                  />
                  {ikm.phone && (
                    <InfoRow icon={Phone} label="Telepon" value={ikm.phone} />
                  )}
                  {ikm.whatsappNumber && (
                    <InfoRow
                      icon={MessageCircle}
                      label="WhatsApp"
                      value={ikm.whatsappNumber}
                    />
                  )}
                  {ikm.leaderName && (
                    <InfoRow
                      icon={User}
                      label="Ketua/Pimpinan"
                      value={ikm.leaderName}
                    />
                  )}
                  {ikm.memberCount != null && ikm.memberCount > 0 && (
                    <InfoRow
                      icon={Users}
                      label="Jumlah Anggota"
                      value={`${ikm.memberCount} orang`}
                    />
                  )}
                  {ikm.establishedYear && (
                    <InfoRow
                      icon={Calendar}
                      label="Tahun Berdiri"
                      value={String(ikm.establishedYear)}
                    />
                  )}
                  <div className="flex items-start gap-3 pt-2 border-t border-border/40">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground/70 shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs text-muted-foreground mb-1">
                        Kategori Utama
                      </dt>
                      <dd>
                        <Badge
                          variant="outline"
                          className={`${badgeClasses} text-xs font-medium`}
                        >
                          {meta.label}
                        </Badge>
                      </dd>
                    </div>
                  </div>
                </dl>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 tracking-tight">
                  Produk dari IKM Ini
                </h2>
                <p className="text-sm text-muted-foreground">
                  {productCount > 0
                    ? `${productCount} produk ditemukan`
                    : 'Belum ada produk terdaftar'}
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-lg">
                <Link href="/katalog">
                  Lihat Katalog Lengkap
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          {productCardProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 sm:py-16 text-center bg-card rounded-xl border border-dashed border-border/50"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Package className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                Belum ada produk dari IKM ini
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Hubungi IKM melalui WhatsApp atau marketplace untuk informasi
                produk yang tersedia.
              </p>
              {waUrl && (
                <Button
                  asChild
                  size="sm"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg"
                >
                  <a href={waUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Tanya via WhatsApp
                  </a>
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {productCardProducts.map((product, i) => (
                <ScrollReveal
                  key={product.id}
                  delay={Math.min(i * 60, 360)}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back Button */}
      <section className="py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Button asChild variant="outline" size="default" className="rounded-lg">
            <Link href="/ikm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar IKM
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Sub-components ---------------- */

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground/70 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-muted-foreground mb-0.5">{label}</dt>
        <dd className="text-sm text-foreground break-words">{value}</dd>
      </div>
    </div>
  );
}

/* ---------------- 404 ---------------- */

function IkmNotFound() {
  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'IKM', href: '/ikm' },
          { label: 'Tidak Ditemukan' },
        ]}
      />
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-5">
              <Building2 className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
              IKM tidak ditemukan
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              IKM yang Anda cari mungkin telah dihapus atau URL tidak valid.
              Silakan kembali ke daftar IKM.
            </p>
            <Button asChild className="rounded-lg">
              <Link href="/ikm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Daftar IKM
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Skeleton ---------------- */

function IkmProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'IKM', href: '/ikm' },
          { label: 'Memuat...' },
        ]}
      />
      <section className="bg-muted/30 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-7">
            <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full shrink-0" />
            <div className="flex-1 space-y-3 min-w-0">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-9 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Skeleton className="h-10 w-48 rounded-lg" />
            <Skeleton className="h-10 w-44 rounded-lg" />
          </div>
        </div>
      </section>
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </section>
      <section className="py-8 sm:py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-64 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
