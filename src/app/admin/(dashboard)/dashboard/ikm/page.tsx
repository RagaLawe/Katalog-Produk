'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  Phone,
  MapPin,
  Calendar,
  Users,
  Building2,
  ShoppingBag,
  User,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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

type IkmCategory = 'tenun' | 'songket' | 'kopi' | 'bambu';

interface Ikm {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: IkmCategory;
  address: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  marketplaceUrl: string | null;
  establishedYear: number | null;
  leaderName: string | null;
  memberCount: number | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

const currentYear = new Date().getFullYear();

// Empty strings coerce to null so optional numeric fields can be left blank.
const nullableNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
  z.number().int().nullable().optional()
);

const ikmSchema = z.object({
  name: z.string().min(1, 'Nama IKM wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  description: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  marketplaceUrl: z
    .string()
    .url('Format URL tidak valid')
    .optional()
    .or(z.literal('')),
  establishedYear: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z
      .number()
      .int()
      .min(1900, 'Tahun tidak valid')
      .max(currentYear + 1, 'Tahun tidak valid')
      .nullable()
      .optional()
  ),
  leaderName: z.string().optional(),
  memberCount: nullableNumber,
  isFeatured: z.boolean().default(false),
});

type IkmFormValues = z.infer<typeof ikmSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function truncate(text: string | null, max: number): string {
  if (!text) return '';
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

function FieldGroupHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-3 pb-3 mb-4 border-b border-border/40">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- List View ---------------- */

function IkmListView({
  ikms,
  isLoading,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  onAdd,
  onEdit,
  onDelete,
}: {
  ikms: Ikm[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  categoryFilter: string;
  setCategoryFilter: (v: string) => void;
  onAdd: () => void;
  onEdit: (slug: string) => void;
  onDelete: (slug: string) => Promise<void>;
}) {
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const filteredIkms = useMemo(() => {
    let result = ikms;

    if (categoryFilter !== 'all') {
      result = result.filter((i) => i.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.slug.toLowerCase().includes(q) ||
          (i.address?.toLowerCase().includes(q) ?? false) ||
          (i.leaderName?.toLowerCase().includes(q) ?? false)
      );
    }

    return result;
  }, [ikms, searchQuery, categoryFilter]);

  const handleConfirmDelete = async () => {
    if (pendingDelete) {
      await onDelete(pendingDelete);
    }
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kelola IKM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data IKM (Industri Kecil Menengah) Kabupaten Ngada
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Tambah IKM
        </Button>
      </div>

      {/* Table Section */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Daftar IKM</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal">
                {filteredIkms.length} IKM
                {searchQuery.trim() || categoryFilter !== 'all'
                  ? ' ditemukan'
                  : ''}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, alamat, atau ketua..."
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
                  <SelectItem value="songket">Tenun Songket</SelectItem>
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
              <span className="ml-2 text-muted-foreground">Memuat IKM...</span>
            </div>
          ) : filteredIkms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground font-medium">
                {searchQuery.trim() || categoryFilter !== 'all'
                  ? 'Tidak ada IKM yang cocok'
                  : 'Belum ada IKM'}
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                {searchQuery.trim() || categoryFilter !== 'all'
                  ? 'Coba ubah kata kunci atau filter pencarian'
                  : 'Klik "Tambah IKM" untuk menambahkan IKM baru'}
              </p>
              {!searchQuery.trim() && categoryFilter === 'all' && (
                <Button className="mt-4" onClick={onAdd}>
                  <Plus className="h-4 w-4" />
                  Tambah IKM
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Nama IKM</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead className="text-center">Produk</TableHead>
                    <TableHead className="text-center">Unggulan</TableHead>
                    <TableHead className="text-right pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIkms.map((ikm) => {
                    const contact = ikm.whatsappNumber || ikm.phone || null;
                    return (
                      <TableRow key={ikm.id}>
                        <TableCell className="pl-6">
                          <div className="font-medium text-foreground max-w-[220px] truncate">
                            {ikm.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[220px]">
                            {ikm.slug}
                          </div>
                        </TableCell>
                        <TableCell>
                          <CategoryBadge category={ikm.category} />
                        </TableCell>
                        <TableCell>
                          {contact ? (
                            <span className="text-sm text-foreground flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="truncate max-w-[140px]">
                                {contact}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {ikm.address ? (
                            <span className="text-sm text-muted-foreground flex items-center gap-1.5 max-w-[220px]">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span className="truncate" title={ikm.address}>
                                {truncate(ikm.address, 40)}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className="font-medium text-xs"
                          >
                            {ikm._count?.products ?? 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {ikm.isFeatured ? (
                            <Badge className="bg-gold-accent/10 text-gold-accent border-gold-accent/20 gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              Unggulan
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(ikm.slug)}
                              title="Edit IKM"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </Button>

                            <AlertDialog
                              open={pendingDelete === ikm.slug}
                              onOpenChange={(open) =>
                                setPendingDelete(open ? ikm.slug : null)
                              }
                            >
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Hapus IKM"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Hapus IKM
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus IKM{' '}
                                    <span className="font-medium text-foreground">
                                      &ldquo;{ikm.name}&rdquo;
                                    </span>
                                    ? Produk-produknya tidak akan ikut terhapus
                                    (hanya dilepas dari IKM ini). Tindakan ini
                                    tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={handleConfirmDelete}
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Form View ---------------- */

function IkmFormView({
  editSlug,
  onCancel,
  onSuccess,
}: {
  editSlug: string | null;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const { token } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingIkm, setIsLoadingIkm] = useState(!!editSlug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const isEditMode = !!editSlug;

  const form = useForm<IkmFormValues>({
    resolver: zodResolver(ikmSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      description: '',
      address: '',
      phone: '',
      whatsappNumber: '',
      marketplaceUrl: '',
      establishedYear: '',
      leaderName: '',
      memberCount: '',
      isFeatured: false,
    },
  });

  const watchedName = form.watch('name');

  // Auto-generate slug from name (unless user edited it manually)
  useEffect(() => {
    if (!slugManuallyEdited && watchedName) {
      form.setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, slugManuallyEdited, form]);

  // Fetch IKM data for edit mode
  const fetchIkm = useCallback(async () => {
    if (!editSlug) return;
    try {
      setIsLoadingIkm(true);
      const response = await fetch(`/api/ikm/${editSlug}`);
      if (!response.ok) {
        toast.error('IKM tidak ditemukan');
        onCancel();
        return;
      }
      const ikm: Ikm = await response.json();
      setSlugManuallyEdited(true);
      form.reset({
        name: ikm.name,
        slug: ikm.slug,
        category: ikm.category,
        description: ikm.description || '',
        address: ikm.address || '',
        phone: ikm.phone || '',
        whatsappNumber: ikm.whatsappNumber || '',
        marketplaceUrl: ikm.marketplaceUrl || '',
        establishedYear:
          ikm.establishedYear != null ? String(ikm.establishedYear) : '',
        leaderName: ikm.leaderName || '',
        memberCount: ikm.memberCount != null ? String(ikm.memberCount) : '',
        isFeatured: ikm.isFeatured,
      });
    } catch {
      toast.error('Gagal memuat data IKM');
      onCancel();
    } finally {
      setIsLoadingIkm(false);
    }
  }, [editSlug, form, onCancel]);

  useEffect(() => {
    fetchIkm();
  }, [fetchIkm]);

  const onSubmit = async (data: IkmFormValues) => {
    setIsSubmitting(true);
    try {
      // Normalize empty strings to null for the API
      const payload: Record<string, unknown> = {
        name: data.name.trim(),
        slug: data.slug.trim() || generateSlug(data.name),
        category: data.category,
        description: data.description?.trim() || null,
        address: data.address?.trim() || null,
        phone: data.phone?.trim() || null,
        whatsappNumber: data.whatsappNumber?.trim() || null,
        marketplaceUrl: data.marketplaceUrl?.trim() || null,
        establishedYear:
          data.establishedYear == null ? null : Number(data.establishedYear),
        leaderName: data.leaderName?.trim() || null,
        memberCount: data.memberCount == null ? null : Number(data.memberCount),
        isFeatured: data.isFeatured,
      };

      const url = isEditMode ? `/api/ikm/${editSlug}` : '/api/ikm';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Gagal menyimpan IKM');
        return;
      }

      toast.success(
        isEditMode ? 'IKM berhasil diperbarui' : 'IKM berhasil ditambahkan'
      );
      onSuccess();
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingIkm) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data IKM...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          title="Kembali"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Edit IKM' : 'Tambah IKM Baru'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode
              ? 'Perbarui informasi IKM'
              : 'Isi formulir untuk menambahkan IKM baru'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* ===== Section: Identitas ===== */}
                  <div className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                    <FieldGroupHeader
                      icon={Building2}
                      title="Identitas IKM"
                      description="Informasi dasar tentang IKM"
                    />

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama IKM *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: IKM Sari Tenun Wolojita"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Slug */}
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="ikm-sari-tenun-wolojita"
                              {...field}
                              onChange={(e) => {
                                setSlugManuallyEdited(true);
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Akan otomatis dibuat dari nama IKM. Edit jika perlu.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategori *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tenun">Tenun Ikat</SelectItem>
                              <SelectItem value="songket">
                                Tenun Songket
                              </SelectItem>
                              <SelectItem value="kopi">Kopi Bajawa</SelectItem>
                              <SelectItem value="bambu">
                                Kerajinan Bambu
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deskripsi IKM</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Sejarah singkat, latar belakang, produk unggulan, teknik pembuatan, dll. Bisa multi-baris."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Deskripsi lengkap tentang IKM. Akan ditampilkan di
                            halaman publik IKM.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ===== Section: Kontak & Penjualan ===== */}
                  <div className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                    <FieldGroupHeader
                      icon={Phone}
                      title="Kontak & Penjualan"
                      description="Informasi kontak dan tempat menjual produk"
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            Nomor Telepon
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="0812-3456-7890 (opsional)"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* WhatsApp */}
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Nomor WhatsApp
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="6281234567890 (format internasional, opsional)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nomor WhatsApp resmi IKM untuk pemesanan. Format
                            internasional tanpa tanda &ldquo;+&rdquo;
                            (contoh: 6281234567890).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Marketplace */}
                    <FormField
                      control={form.control}
                      name="marketplaceUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <ShoppingBag className="h-3.5 w-3.5" />
                            Link Marketplace
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://www.tokopedia.com/... atau https://shopee.co.id/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tautan ke etalase marketplace IKM (Tokopedia,
                            Shopee, Facebook Marketplace, dll).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ===== Section: Lokasi ===== */}
                  <div className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                    <FieldGroupHeader
                      icon={MapPin}
                      title="Lokasi"
                      description="Alamat lengkap IKM"
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Desa, Kecamatan, Kabupaten Ngada, NTT (opsional)"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ===== Section: Organisasi ===== */}
                  <div className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                    <FieldGroupHeader
                      icon={Users}
                      title="Organisasi"
                      description="Informasi kepengurusan dan keanggotaan"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Leader name */}
                      <FormField
                        control={form.control}
                        name="leaderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5" />
                              Nama Ketua / Pimpinan
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nama ketua IKM (opsional)"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Established year */}
                      <FormField
                        control={form.control}
                        name="establishedYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              Tahun Berdiri
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="2015 (opsional)"
                                min={1900}
                                max={currentYear + 1}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Member count */}
                    <FormField
                      control={form.control}
                      name="memberCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            Jumlah Anggota
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              inputMode="numeric"
                              placeholder="25 (opsional)"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Jumlah anggota pengrajin dalam IKM ini.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* ===== Featured toggle ===== */}
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center gap-1.5">
                            <Star className="h-4 w-4 text-gold-accent" />
                            IKM Unggulan
                          </FormLabel>
                          <FormDescription>
                            Tampilkan IKM ini sebagai IKM unggulan di halaman
                            publik
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {isEditMode ? 'Perbarui IKM' : 'Simpan IKM'}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      disabled={isSubmitting}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Ringkasan IKM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Nama</p>
                  <p className="text-sm font-medium truncate">
                    {form.watch('name') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Slug</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {form.watch('slug') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kategori</p>
                  <div className="mt-0.5">
                    {form.watch('category') ? (
                      <CategoryBadge
                        category={form.watch('category') as IkmCategory}
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ketua</p>
                  <p className="text-sm font-medium truncate">
                    {form.watch('leaderName') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tahun Berdiri</p>
                  <p className="text-sm font-medium">
                    {form.watch('establishedYear') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Jumlah Anggota
                  </p>
                  <p className="text-sm font-medium">
                    {form.watch('memberCount') || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Unggulan</p>
                  <p className="text-sm font-medium">
                    {form.watch('isFeatured') ? 'Ya' : 'Tidak'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Page (root) ---------------- */

export default function AdminIkmPage() {
  const { token } = useAdminAuth();
  const [ikms, setIkms] = useState<Ikm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editSlug, setEditSlug] = useState<string | null>(null);

  const fetchIkms = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ikm?withProducts=true');
      if (response.ok) {
        const data = await response.json();
        setIkms(data);
      } else {
        toast.error('Gagal memuat daftar IKM');
      }
    } catch {
      toast.error('Gagal memuat daftar IKM');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIkms();
  }, [fetchIkms]);

  const handleAdd = () => {
    setEditSlug(null);
    setView('form');
  };

  const handleEdit = (slug: string) => {
    setEditSlug(slug);
    setView('form');
  };

  const handleCancel = () => {
    setEditSlug(null);
    setView('list');
  };

  const handleSuccess = () => {
    setEditSlug(null);
    setView('list');
    fetchIkms();
  };

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/ikm/${slug}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success('IKM berhasil dihapus');
        fetchIkms();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Gagal menghapus IKM');
      }
    } catch {
      toast.error('Gagal menghapus IKM');
    }
  };

  if (view === 'form') {
    return (
      <IkmFormView
        editSlug={editSlug}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <IkmListView
      ikms={ikms}
      isLoading={isLoading}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      categoryFilter={categoryFilter}
      setCategoryFilter={setCategoryFilter}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
