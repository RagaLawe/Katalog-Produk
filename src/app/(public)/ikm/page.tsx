'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Calendar,
  Package,
  Users,
  ArrowRight,
  Star,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Breadcrumb from '@/components/Breadcrumb';
import {
  CATEGORY_META,
  getIkmInitials,
  getIkmAvatarColor,
  getIkmCategoryBadgeClasses,
  formatIkmAddress,
  type IkmCategory,
} from '@/lib/ikm-utils';

interface IkmProductPreview {
  id: string;
  name: string;
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
  products?: IkmProductPreview[];
  _count?: { products: number };
}

interface CategoryFilter {
  value: '' | IkmCategory;
  label: string;
}

const categoryFilters: CategoryFilter[] = [
  { value: '', label: 'Semua' },
  { value: 'tenun', label: 'Tenun Ikat' },
  { value: 'songket', label: 'Tenun Songket' },
  { value: 'kopi', label: 'Kopi Bajawa' },
  { value: 'bambu', label: 'Kerajinan Bambu' },
];

export default function IkmListPage() {
  const [ikms, setIkms] = useState<Ikm[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'' | IkmCategory>('');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch IKMs whenever category changes (search is done client-side for snappy UX)
  useEffect(() => {
    let cancelled = false;
    async function fetchIkms() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('withProducts', 'true');
        if (activeCategory) params.set('category', activeCategory);
        const res = await fetch(`/api/ikm?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setIkms(data);
        }
      } catch (err) {
        console.error('Failed to fetch IKM list:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchIkms();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  // Debounced search → state
  useEffect(() => {
    const handle = setTimeout(() => setSearchQuery(searchInput.trim()), 250);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // Client-side filter by search query (name contains, case-insensitive)
  const visibleIkms = useMemo(() => {
    if (!searchQuery) return ikms;
    const q = searchQuery.toLowerCase();
    return ikms.filter((ikm) => ikm.name.toLowerCase().includes(q));
  }, [ikms, searchQuery]);

  const handleCategoryChange = (value: '' | IkmCategory) => {
    setActiveCategory(value);
  };

  const handleResetFilters = () => {
    setActiveCategory('');
    setSearchInput('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb
        items={[
          { label: 'Beranda', href: '/' },
          { label: 'IKM' },
        ]}
      />

      {/* Page Header */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Daftar IKM Ngada
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Kenali para pelaku IKM penghasil produk unggulan Kabupaten Ngada
            </p>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <Building2 className="h-3.5 w-3.5" />
                {ikms.length} IKM Terdaftar
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Cari nama IKM..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-4 h-9 bg-muted/50 border-border/40 rounded-lg text-sm"
                autoComplete="off"
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeCategory === filter.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange(filter.value)}
                  className={
                    activeCategory === filter.value
                      ? 'bg-primary text-primary-foreground h-8 rounded-lg text-xs'
                      : 'text-muted-foreground hover:text-foreground h-8 rounded-lg text-xs'
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <div className="mt-2">
            {!loading && (
              <p className="text-xs text-muted-foreground">
                Menampilkan {visibleIkms.length} IKM
                {searchQuery && ` untuk pencarian "${searchQuery}"`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* IKM Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <IkmCardSkeletonGrid />
          ) : visibleIkms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Building2 className="h-7 w-7 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                IKM Tidak Ditemukan
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Tidak ada IKM yang sesuai dengan pencarian Anda. Coba ubah filter
                atau kata kunci.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={handleResetFilters}
              >
                Reset Filter
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {visibleIkms.map((ikm, idx) => (
                <motion.div
                  key={ikm.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(idx * 0.06, 0.36),
                    ease: 'easeOut',
                  }}
                  className="h-full"
                >
                  <IkmCard ikm={ikm} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------- IKM Card ---------------- */

function IkmCard({ ikm }: { ikm: Ikm }) {
  const productCount = ikm._count?.products ?? ikm.products?.length ?? 0;
  const meta = CATEGORY_META[ikm.category];
  const Icon = meta?.icon ?? Building2;
  const description = ikm.description?.trim() || null;
  const initials = getIkmInitials(ikm.name);
  const address = formatIkmAddress(ikm.address);
  const badgeClasses = getIkmCategoryBadgeClasses(ikm.category);

  return (
    <article className="group bg-card rounded-xl border border-border/40 overflow-hidden h-full flex flex-col hover:shadow-md hover:border-border/60 transition-all duration-200">
      {/* Card header with avatar */}
      <div className="p-5 sm:p-6 pb-4 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-4">
          <div
            className={`flex items-center justify-center w-14 h-14 rounded-full shrink-0 font-bold text-lg ${getIkmAvatarColor(
              ikm.category
            )}`}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <Badge
                variant="outline"
                className={`${badgeClasses} text-[10px] font-medium px-2 py-0.5`}
              >
                <Icon className="h-3 w-3 mr-1" />
                {meta.label}
              </Badge>
              {ikm.isFeatured && (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] font-medium px-2 py-0.5">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Unggulan
                </Badge>
              )}
            </div>
            <Link href={`/ikm/${ikm.slug}`} className="block">
              <h3 className="font-semibold text-foreground text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {ikm.name}
              </h3>
            </Link>
          </div>
        </div>

        {/* Description */}
        {description ? (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground/60 italic line-clamp-2">
            Deskripsi IKM belum tersedia.
          </p>
        )}

        {/* Meta info */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
            <span className="truncate">{address}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 text-muted-foreground/70" />
              {productCount} Produk
            </span>
            {ikm.establishedYear && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground/70" />
                Sejak {ikm.establishedYear}
              </span>
            )}
            {ikm.memberCount != null && ikm.memberCount > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
                {ikm.memberCount} Anggota
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="px-5 sm:px-6 py-3 border-t border-border/40 bg-muted/20">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full h-9 text-primary hover:text-primary hover:bg-primary/5 rounded-lg group/btn"
        >
          <Link href={`/ikm/${ikm.slug}`}>
            Lihat Profil
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

/* ---------------- Skeleton ---------------- */

function IkmCardSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-xl border border-border/40 overflow-hidden p-5 sm:p-6 flex flex-col gap-4"
        >
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
          <div className="space-y-2 mt-auto">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
