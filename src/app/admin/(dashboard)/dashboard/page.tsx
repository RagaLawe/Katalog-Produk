'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  Palette,
  Coffee,
  Sprout,
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Loader2,
  ImageOff,
  BarChart3,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAdminAuth } from '@/lib/admin-auth';
import CategoryBadge from '@/components/CategoryBadge';
import { toast } from 'sonner';

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
  createdAt: string;
  updatedAt: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 30) return `${diffDays} hari yang lalu`;
  if (diffMonths < 12) return `${diffMonths} bulan yang lalu`;
  return `${diffYears} tahun yang lalu`;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (searchQuery) params.set('search', searchQuery);
      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch {
      toast.error('Gagal memuat produk');
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('Produk berhasil dihapus');
        fetchProducts();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Gagal menghapus produk');
      }
    } catch {
      toast.error('Gagal menghapus produk');
    } finally {
      setDeletingSlug(null);
    }
  };

  // Stats
  const totalProducts = products.length;
  const tenunCount = products.filter((p) => p.category === 'tenun').length;
  const kopiCount = products.filter((p) => p.category === 'kopi').length;
  const bambuCount = products.filter((p) => p.category === 'bambu').length;

  const stats = [
    {
      title: 'Total Produk',
      value: totalProducts,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Produk Tenun',
      value: tenunCount,
      icon: Palette,
      color: 'text-tenun-red',
      bgColor: 'bg-tenun-red/10',
    },
    {
      title: 'Produk Kopi',
      value: kopiCount,
      icon: Coffee,
      color: 'text-coffee-brown',
      bgColor: 'bg-coffee-brown/10',
    },
    {
      title: 'Produk Bambu',
      value: bambuCount,
      icon: Sprout,
      color: 'text-bamboo-green',
      bgColor: 'bg-bamboo-green/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola produk unggulan Kabupaten Ngada
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/dashboard/produk">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} rounded-lg p-2`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Product Distribution Chart */}
      {totalProducts > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Distribusi Produk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-8 sm:gap-16">
              {[
                { name: 'Tenun Ikat', count: tenunCount, color: 'bg-primary' },
                { name: 'Kopi Bajawa', count: kopiCount, color: 'bg-coffee-brown' },
                { name: 'Kerajinan Bambu', count: bambuCount, color: 'bg-bamboo-green' },
              ].map((cat) => {
                const maxCount = Math.max(tenunCount, kopiCount, bambuCount, 1);
                const barHeight = Math.max((cat.count / maxCount) * 120, 4);
                return (
                  <div key={cat.name} className="flex flex-col items-center gap-2">
                    <div
                      className={`${cat.color} rounded-t-md w-12 sm:w-16 transition-all duration-500`}
                      style={{ height: `${barHeight}px` }}
                    />
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground">{cat.count}</div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">{cat.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity Section */}
      {products.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...products]
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .slice(0, 5)
                .map((product) => {
                  const createdTime = new Date(product.createdAt).getTime();
                  const updatedTime = new Date(product.updatedAt).getTime();
                  const isUpdate = (updatedTime - createdTime) > 1000; // more than 1s difference = update
                  const ActionIcon = isUpdate ? Pencil : Plus;
                  const actionText = isUpdate ? 'Diperbarui' : 'Ditambahkan';
                  const actionColor = isUpdate ? 'text-coffee-brown' : 'text-bamboo-green';
                  const actionBg = isUpdate ? 'bg-coffee-brown/10' : 'bg-bamboo-green/10';

                  return (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${actionBg} shrink-0`}>
                        <ActionIcon className={`h-4 w-4 ${actionColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground text-sm truncate">
                            {product.name}
                          </span>
                          <CategoryBadge category={product.category} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-xs font-medium ${actionColor}`}>
                            {actionText}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            &middot; {formatRelativeTime(product.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-foreground shrink-0">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Table Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg">Daftar Produk</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="Semua kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="tenun">Tenun Ikat</SelectItem>
                  <SelectItem value="kopi">Kopi Bajawa</SelectItem>
                  <SelectItem value="bambu">Kerajinan Bambu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Memuat produk...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">Belum ada produk</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Klik &quot;Tambah Produk&quot; untuk menambahkan produk baru
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Gambar</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-center">Unggulan</TableHead>
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="pl-6">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted border">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML =
                                  '<div class="flex items-center justify-center h-full w-full"><svg class="h-4 w-4 text-muted-foreground/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                              }}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <ImageOff className="h-4 w-4 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground max-w-[200px] truncate">
                          {product.name}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.slug}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={product.category} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-center">
                        {product.isFeatured ? (
                          <Badge className="bg-gold-accent/10 text-gold-accent border-gold-accent/20 gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Unggulan
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              router.push(
                                `/admin/dashboard/produk?edit=${product.slug}`
                              )
                            }
                            title="Edit produk"
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Hapus produk"
                                onClick={() => setDeletingSlug(product.slug)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Produk
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus produk ini?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => setDeletingSlug(null)}
                                >
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-white hover:bg-destructive/90"
                                  onClick={() => handleDelete(product.slug)}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
