'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, PackageOpen, ArrowUpDown, ChevronLeft, ChevronRight, LayoutGrid, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeletonGrid } from '@/components/ProductCardSkeleton';
import Breadcrumb from '@/components/Breadcrumb';
import CompareDrawer from '@/components/CompareDrawer';
import FavoritesSection from '@/components/FavoritesSection';
import { useFavoritesStore } from '@/lib/favorites-store';
import { getIkmInitials, getIkmAvatarColor, formatIkmAddress } from '@/lib/ikm-utils';

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
  ikm?: {
    id: string;
    name: string;
    slug: string;
    category: string;
  } | null;
}

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
}

interface IkmOption {
  id: string;
  name: string;
  slug: string;
  category: string;
  _count?: { products: number };
}

const categoryFilters = [
  { value: '', label: 'Semua' },
  { value: 'tenun', label: 'Tenun Ikat' },
  { value: 'songket', label: 'Tenun Songket' },
  { value: 'kopi', label: 'Kopi Bajawa' },
  { value: 'bambu', label: 'Kerajinan Bambu' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: 'easeOut' as const },
  }),
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState<'category' | 'ikm'>('category');
  const [ikmOptions, setIkmOptions] = useState<IkmOption[]>([]);
  const [selectedIkmId, setSelectedIkmId] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const itemsPerPage = 6;

  const { favorites } = useFavoritesStore();

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
        break;
    }
    return sorted;
  }, [products, sortBy]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const startItem = sortedProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedProducts.length);

  // Group products by IKM for "Per IKM" view mode
  // Includes ALL IKMs (even those with 0 products) so the catalog shows every registered IKM.
  const productsByIkm = useMemo(() => {
    const groups = new Map<string, { ikm: IkmOption | null; products: Product[] }>();

    // First, group products by their IKM
    for (const p of sortedProducts) {
      const key = p.ikm?.id || '__no_ikm__';
      if (!groups.has(key)) {
        const ikm = p.ikm
          ? ikmOptions.find((i) => i.id === p.ikm!.id) || {
              id: p.ikm.id,
              name: p.ikm.name,
              slug: p.ikm.slug,
              category: p.ikm.category,
            }
          : null;
        groups.set(key, { ikm, products: [] });
      }
      groups.get(key)!.products.push(p);
    }

    // Then, ensure every IKM in ikmOptions appears as a group (even with 0 products).
    // This makes the catalog a complete directory of all registered IKMs.
    for (const ikm of ikmOptions) {
      if (!groups.has(ikm.id)) {
        groups.set(ikm.id, { ikm, products: [] });
      }
    }

    // Sort: IKMs with products first (by name), then IKMs with 0 products, then "no IKM" at the end
    return Array.from(groups.values()).sort((a, b) => {
      if (!a.ikm && b.ikm) return 1;
      if (a.ikm && !b.ikm) return -1;
      // Both have IKM — sort by name (ikmOptions is already sorted by isFeatured desc, name asc,
      // but we re-sort here for stable display regardless of insertion order)
      return (a.ikm?.name || '').localeCompare(b.ikm?.name || '', 'id');
    });
  }, [sortedProducts, ikmOptions]);

  // Total IKM count for the counter (all IKMs except the synthetic "no IKM" group)
  const totalIkmCount = useMemo(
    () => productsByIkm.filter((g) => g.ikm).length,
    [productsByIkm]
  );

  const fetchProducts = useCallback(async (category: string, search: string, ikmId: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (ikmId) params.set('ikmId', ikmId);

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

  // Fetch IKM list once for the IKM-mode filter
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/ikm');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setIkmOptions(data);
        }
      } catch (err) {
        console.error('Failed to fetch IKM list:', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory, searchQuery, selectedIkmId);
  }, [activeCategory, searchQuery, selectedIkmId, fetchProducts]);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data: Product[] = await res.json();
        setSuggestions(data.slice(0, 5).map((p) => ({ id: p.id, name: p.name, slug: p.slug })));
      }
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    setCurrentPage(1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 2) {
      debounceRef.current = setTimeout(() => {
        fetchSuggestions(value);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 400);
  }, [fetchSuggestions]);

  const handleSuggestionClick = useCallback((slug: string) => {
    setShowSuggestions(false);
    setSuggestions([]);
    router.push(`/produk/${slug}`);
  }, [router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setShowSuggestions(false);
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    router.push(`/katalog?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Beranda', href: '/' }, { label: 'Katalog' }]} />

      {/* Page Header */}
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">
              Katalog Produk
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Jelajahi seluruh koleksi produk unggulan Kabupaten Ngada
            </p>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 bg-primary/5 text-primary text-xs font-medium px-3 py-1.5 rounded-full"
              >
                <PackageOpen className="h-3.5 w-3.5" />
                {sortedProducts.length} Produk Tersedia
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
            <div ref={searchRef} className="relative w-full sm:w-64">
              <form onSubmit={handleSearch}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                  className="pl-9 pr-4 h-9 bg-muted/50 border-border/40 rounded-lg text-sm"
                  autoComplete="off"
                />
              </form>

              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.slug)}
                        className="flex items-center gap-3 w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors text-sm"
                      >
                        <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground truncate">{suggestion.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* View Mode Toggle: Per Kategori ↔ Per IKM */}
            <div className="flex gap-1 p-1 bg-muted/60 rounded-lg">
              <button
                type="button"
                onClick={() => { setViewMode('category'); setSelectedIkmId(''); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'category'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={viewMode === 'category'}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Per Kategori
              </button>
              <button
                type="button"
                onClick={() => { setViewMode('ikm'); setCurrentPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'ikm'
                    ? 'bg-background shadow-sm text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-pressed={viewMode === 'ikm'}
              >
                <Users className="h-3.5 w-3.5" />
                Per IKM
              </button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setCurrentPage(1); }}>
              <SelectTrigger size="sm" className="w-full sm:w-[160px] h-9 rounded-lg">
                <ArrowUpDown className="h-3.5 w-3.5" />
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

            {/* Category Filters (only in category mode) */}
            {viewMode === 'category' && (
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
            )}

            {/* IKM Filter (only in IKM mode) */}
            {viewMode === 'ikm' && (
              <Select value={selectedIkmId} onValueChange={(v) => { setSelectedIkmId(v === '__all__' ? '' : v); setCurrentPage(1); }}>
                <SelectTrigger size="sm" className="w-full sm:w-[220px] h-9 rounded-lg">
                  <Users className="h-3.5 w-3.5" />
                  <SelectValue placeholder="Semua IKM" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Semua IKM</SelectItem>
                  {ikmOptions
                    .filter((ikm) => !activeCategory || ikm.category === activeCategory)
                    .map((ikm) => (
                      <SelectItem key={ikm.id} value={ikm.id}>
                        {ikm.name} ({ikm._count?.products || 0})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Product Count */}
          <div className="mt-2">
            {!loading && (
              <p className="text-xs text-muted-foreground">
                {viewMode === 'ikm' && productsByIkm.length > 0
                  ? `${totalIkmCount} IKM • ${sortedProducts.length} produk`
                  : `Menampilkan ${startItem}-${endItem} dari ${sortedProducts.length} produk`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {favorites.length > 0 && viewMode === 'category' && (
            <FavoritesSection products={products} />
          )}

          {loading ? (
            <ProductCardSkeletonGrid count={6} />
          ) : sortedProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <PackageOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Tidak ada produk yang sesuai dengan pencarian Anda. Coba ubah filter atau kata kunci.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  setActiveCategory('');
                  setInputValue('');
                  setSearchQuery('');
                  setSelectedIkmId('');
                  setCurrentPage(1);
                  router.push('/katalog');
                }}
              >
                Reset Filter
              </Button>
            </motion.div>
          ) : viewMode === 'ikm' ? (
            /* === Per IKM View: products grouped by IKM with section headers === */
            <div className="space-y-10">
              {productsByIkm.map((group, gi) => (
                <motion.div
                  key={group.ikm?.id || '__no_ikm__'}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.06, duration: 0.35 }}
                  className="space-y-4"
                >
                  {/* IKM Section Header */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
                    {group.ikm ? (
                      <div className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full font-bold text-white ${getIkmAvatarColor(group.ikm.category)}`}>
                        {getIkmInitials(group.ikm.name)}
                      </div>
                    ) : (
                      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-muted-foreground/20 text-muted-foreground">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      {group.ikm ? (
                        <>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-foreground truncate">
                              {group.ikm.name}
                            </h3>
                            <span className="text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded-full border border-border/40">
                              {group.products.length} produk
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Kategori utama: {group.ikm.category}
                          </p>
                        </>
                      ) : (
                        <h3 className="text-lg font-semibold text-foreground">
                          Produk tanpa IKM
                        </h3>
                      )}
                    </div>
                    {group.ikm && (
                      <Link
                        href={`/ikm/${group.ikm.slug}`}
                        className="flex-shrink-0 text-xs text-primary hover:text-primary/80 font-medium transition-colors flex items-center gap-1"
                      >
                        Lihat Profil
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>

                  {/* Product grid for this IKM (or empty state) */}
                  {group.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                      {group.products.map((product, i) => (
                        <motion.div
                          key={product.id}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          custom={i}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>
                  ) : group.ikm ? (
                    /* Empty state for IKM with 0 products */
                    <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Belum ada produk dari IKM ini di katalog.
                      </p>
                      <Link
                        href={`/ikm/${group.ikm.slug}`}
                        className="inline-flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Lihat profil IKM
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ) : null}
                </motion.div>
              ))}
            </div>
          ) : (
            /* === Per Category View (default): paginated flat grid === */
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, i) => (
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

          {/* Pagination (only in category mode) */}
          {viewMode === 'category' && totalPages > 1 && !loading && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="gap-1 rounded-lg h-8 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Sebelumnya
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`rounded-lg h-8 w-8 p-0 text-xs ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="gap-1 rounded-lg h-8 text-xs"
              >
                Selanjutnya
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <CompareDrawer />
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
