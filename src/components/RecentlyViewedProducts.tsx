'use client';

import { useMemo, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import PriceDisplay from '@/components/PriceDisplay';

interface RecentlyViewedItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}

const STORAGE_KEY = 'recently_viewed_products';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || '[]';
  } catch {
    return '[]';
  }
}

function getServerSnapshot(): string {
  return '[]';
}

export function addToRecentlyViewed(product: {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
}) {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const existing: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];

    // Remove any existing entry with the same id
    const filtered = existing.filter((item) => item.id !== product.id);

    // Prepend the new product
    const updated = [
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        imageUrl: product.imageUrl,
        price: product.price,
      },
      ...filtered,
    ].slice(0, 8); // Limit to 8 items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage not available or parse error
  }
}

export default function RecentlyViewedProducts() {
  const rawProducts = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const products = useMemo<RecentlyViewedItem[]>(() => {
    try {
      const items: RecentlyViewedItem[] = JSON.parse(rawProducts);
      return items.slice(0, 4);
    } catch {
      return [];
    }
  }, [rawProducts]);

  if (products.length === 0) return null;

  return (
    <section className="py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            Terakhir Dilihat
          </h2>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Horizontal Scrollable Row */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/produk/${product.slug}`}
              className="flex-shrink-0 group"
            >
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card hover:shadow-md hover:border-border transition-all duration-200 w-[220px]">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <PriceDisplay price={product.price} className="text-sm mt-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
