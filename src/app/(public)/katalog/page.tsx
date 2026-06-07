'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PackageOpen, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeletonGrid } from '@/components/ProductCardSkeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu';
  price: number;
  description: string;
  artisanInfo: string | null;
  imageUrl: string;
  isFeatured: boolean;
}

const categoryFilters = [
  { value: '', label: 'Semua' },
  { value: 'tenun', label: 'Tenun Ikat' },
  { value: 'kopi', label: 'Kopi Bajawa' },
  { value: 'bambu', label: 'Kerajinan Bambu' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: 'easeOut' },
  }),
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'id'));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name, 'id'));
        break;
      case 'newest':
      default:
        // Default order from API (newest first)
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const fetchProducts = useCallback(async (category: string, search: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory, searchQuery);
  }, [activeCategory, searchQuery, fetchProducts]);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    router.push(`/katalog?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(activeCategory, searchQuery);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-primary/5 tenun-pattern py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 section-accent">
              Katalog Produk
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Jelajahi seluruh koleksi produk unggulan Kabupaten Ngada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
              />
            </form>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger size="sm" className="w-full sm:w-[180px]">
                <ArrowUpDown className="h-4 w-4" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="price-asc">Harga Terendah</SelectItem>
                <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
                <SelectItem value="name-asc">Nama A-Z</SelectItem>
                <SelectItem value="name-desc">Nama Z-A</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap">
              {categoryFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeCategory === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(filter.value)}
                  className={
                    activeCategory === filter.value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground/70 hover:text-primary'
                  }
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Product Count */}
          <div className="mt-3">
            {!loading && (
              <p className="text-sm text-muted-foreground">
                Menampilkan {sortedProducts.length} produk
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : sortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <PackageOpen className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-muted-foreground max-w-md">
                Maaf, tidak ada produk yang sesuai dengan pencarian Anda. Coba ubah filter atau kata kunci pencarian.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setActiveCategory('');
                  setSearchQuery('');
                  router.push('/katalog');
                }}
              >
                Reset Filter
              </Button>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    custom={i}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function KatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <section className="py-8 sm:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ProductCardSkeletonGrid count={6} />
            </div>
          </section>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
