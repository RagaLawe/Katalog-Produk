'use client';

import { useEffect, useState } from 'react';
import { Building2, Users } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import ScrollReveal from '@/components/ScrollReveal';
import { Skeleton } from '@/components/ui/skeleton';

type ProductCategory = 'tenun' | 'kopi' | 'bambu' | 'songket';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  ikmName: string | null;
  artisanInfo: string | null;
}

interface IKMGroup {
  ikmName: string;
  artisanInfo: string;
  categories: ProductCategory[];
  productCount: number;
}

export default function IKMListSection() {
  const [ikms, setIkms] = useState<IKMGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadIkms() {
      try {
        setIsLoading(true);
        setHasError(false);
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Gagal memuat data produk');
        const products: Product[] = await res.json();

        // Deduplicate by ikmName (case-sensitive). Filter out null/empty.
        const map = new Map<string, IKMGroup>();
        for (const p of products) {
          const name = p.ikmName?.trim();
          if (!name) continue;
          const existing = map.get(name);
          if (existing) {
            existing.productCount += 1;
            if (!existing.categories.includes(p.category)) {
              existing.categories.push(p.category);
            }
            // Prefer the longest artisanInfo (richest description).
            if (
              p.artisanInfo &&
              p.artisanInfo.trim().length > existing.artisanInfo.length
            ) {
              existing.artisanInfo = p.artisanInfo.trim();
            }
          } else {
            map.set(name, {
              ikmName: name,
              artisanInfo: p.artisanInfo?.trim() || '',
              categories: [p.category],
              productCount: 1,
            });
          }
        }

        if (cancelled) return;
        setIkms(Array.from(map.values()));
      } catch {
        if (cancelled) return;
        setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadIkms();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-14 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/5 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">
            Industri Kecil Menengah (IKM) Ngada
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Mengenal lebih dekat kelompok pengrajin di balik produk unggulan
            Ngada
          </p>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : hasError ? (
          <div className="max-w-xl mx-auto text-center py-10">
            <p className="text-sm text-muted-foreground">
              Gagal memuat daftar IKM. Silakan coba beberapa saat lagi.
            </p>
          </div>
        ) : ikms.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Belum ada data IKM yang tersedia saat ini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {ikms.map((ikm, idx) => (
              <ScrollReveal
                key={ikm.ikmName}
                delay={Math.min(idx * 60, 360)}
                className="h-full"
              >
                <article className="bg-card border border-border/50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  <header className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/5 shrink-0">
                        <Building2 className="h-4.5 w-4.5 text-primary" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground leading-tight break-words">
                        {ikm.ikmName}
                      </h3>
                    </div>
                  </header>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {ikm.categories.map((cat) => (
                      <CategoryBadge key={cat} category={cat} />
                    ))}
                    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {ikm.productCount} Produk
                    </span>
                  </div>

                  {ikm.artisanInfo ? (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {ikm.artisanInfo}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Deskripsi IKM akan diperbarui segera.
                    </p>
                  )}
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
