'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useFavoritesStore } from '@/lib/favorites-store';
import PriceDisplay from '@/components/PriceDisplay';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu' | 'songket';
  price: number;
  description: string;
  artisanInfo: string | null;
  imageUrl: string;
  isFeatured: boolean;
}

interface FavoritesSectionProps {
  products: Product[];
}

export default function FavoritesSection({ products }: FavoritesSectionProps) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const [isOpen, setIsOpen] = useState(true);

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  if (favoriteProducts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-primary/20 bg-primary/5 shadow-sm">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between w-full p-4 hover:bg-primary/5 transition-colors rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary fill-primary" />
                  <span className="font-semibold text-foreground">
                    Favorit Saya
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({favoriteProducts.length} produk)
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 pb-4 px-4">
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {favoriteProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex-shrink-0"
                    >
                      <Link
                        href={`/produk/${product.slug}`}
                        className="group block"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border/50 bg-muted mb-1.5">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="80px"
                          />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-background shadow-sm border border-border/50 flex items-center justify-center hover:bg-destructive/10 transition-colors"
                            aria-label={`Hapus ${product.name} dari favorit`}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-foreground line-clamp-1 w-20">
                          {product.name}
                        </p>
                        <PriceDisplay price={product.price} className="text-[10px]" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
