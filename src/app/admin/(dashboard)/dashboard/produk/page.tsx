'use client';

import { Suspense, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Loader2,
  Save,
  ImageIcon,
  Upload,
  Link2,
  X,
  Building2,
  Phone,
  ShoppingBag,
  Ruler,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useAdminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(1, 'Nama produk wajib diisi'),
  slug: z.string().min(1, 'Slug wajib diisi'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  price: z.coerce.number().min(1, 'Harga wajib diisi'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  specifications: z.string().optional(),
  ikmName: z.string().optional(),
  artisanInfo: z.string().optional(),
  whatsappNumber: z.string().optional(),
  marketplaceUrl: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  imageUrl: z.string().min(1, 'Gambar wajib disediakan'),
  isFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'tenun' | 'kopi' | 'bambu' | 'songket';
  price: number;
  description: string;
  specifications: string | null;
  artisanInfo: string | null;
  ikmName: string | null;
  whatsappNumber: string | null;
  marketplaceUrl: string | null;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams.get('edit');
  const { token } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(!!editSlug);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!editSlug;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      price: 0,
      description: '',
      specifications: '',
      ikmName: '',
      artisanInfo: '',
      whatsappNumber: '',
      marketplaceUrl: '',
      imageUrl: '',
      isFeatured: false,
    },
  });

  const watchedName = form.watch('name');
  const watchedImageUrl = form.watch('imageUrl');

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && watchedName) {
      form.setValue('slug', generateSlug(watchedName));
    }
  }, [watchedName, slugManuallyEdited, form]);

  // Reset image preview error when URL changes
  useEffect(() => {
    setImagePreviewError(false);
  }, [watchedImageUrl]);

  // Fetch product data for edit mode
  const fetchProduct = useCallback(async () => {
    if (!editSlug) return;
    try {
      setIsLoadingProduct(true);
      const response = await fetch(`/api/products/${editSlug}`);
      if (!response.ok) {
        toast.error('Produk tidak ditemukan');
        router.push('/admin/dashboard');
        return;
      }
      const product: Product = await response.json();
      setSlugManuallyEdited(true);
      // If the product has a local upload path, switch to URL mode to show it
      if (product.imageUrl.startsWith('/uploads/')) {
        setImageMode('upload');
      } else {
        setImageMode('url');
      }
      form.reset({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        description: product.description,
        specifications: product.specifications || '',
        ikmName: product.ikmName || '',
        artisanInfo: product.artisanInfo || '',
        whatsappNumber: product.whatsappNumber || '',
        marketplaceUrl: product.marketplaceUrl || '',
        imageUrl: product.imageUrl,
        isFeatured: product.isFeatured,
      });
    } catch {
      toast.error('Gagal memuat data produk');
      router.push('/admin/dashboard');
    } finally {
      setIsLoadingProduct(false);
    }
  }, [editSlug, form, router]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Gagal mengunggah gambar');
        return;
      }

      form.setValue('imageUrl', result.url);
      toast.success('Gambar berhasil diunggah');
    } catch {
      toast.error('Gagal mengunggah gambar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file);
      } else {
        toast.error('Hanya file gambar yang diizinkan');
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      const url = isEditMode
        ? `/api/products/${editSlug}`
        : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || 'Gagal menyimpan produk');
        return;
      }

      toast.success(
        isEditMode
          ? 'Produk berhasil diperbarui'
          : 'Produk berhasil ditambahkan'
      );
      router.push('/admin/dashboard');
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data produk...</span>
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
          onClick={() => router.push('/admin/dashboard')}
          title="Kembali"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEditMode
              ? 'Perbarui informasi produk'
              : 'Isi formulir untuk menambahkan produk baru'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Produk *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Tenun Ikat Motif Ngada"
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
                            placeholder="tenun-ikat-motif-ngada"
                            {...field}
                            onChange={(e) => {
                              setSlugManuallyEdited(true);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Akan otomatis dibuat dari nama produk. Edit jika perlu.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category & Price row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              <SelectItem value="songket">Tenun Songket</SelectItem>
                              <SelectItem value="kopi">Kopi Bajawa</SelectItem>
                              <SelectItem value="bambu">Kerajinan Bambu</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga (Rp) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="500000"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi Produk *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Jelaskan detail produk, bahan, proses pembuatan, dll."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Specifications */}
                  <FormField
                    control={form.control}
                    name="specifications"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Ruler className="h-3.5 w-3.5" />
                          Spesifikasi Produk
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ukuran: 200cm x 80cm\nBahan: Katun + Benang Emas\nBerat: 350 gram\nTeknik: Tenun sungkit manual\nPerawatan: Cuci tangan"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Spesifikasi barang seperti ukuran, bahan, berat, dan perawatan. Pisahkan tiap spesifikasi dengan baris baru. Akan ditampilkan di halaman detail produk.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Artisan Info */}
                  <FormField
                    control={form.control}
                    name="artisanInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi IKM / Pengrajin</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ceritakan tentang IKM pembuat produk: nama, lokasi, jumlah anggota, sejarah singkat, teknik pembuatan, dll. Bisa multi-baris."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Deskripsi lengkap tentang IKM (Industri Kecil Menengah) atau pengrajin pembuat produk. Akan ditampilkan di halaman detail produk.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* IKM & Contact Section */}
                  <div className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-border/40">
                      <Building2 className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Informasi IKM & Kontak Pembelian
                      </h3>
                    </div>

                    {/* IKM Name */}
                    <FormField
                      control={form.control}
                      name="ikmName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama IKM / Kelompok Pengrajin</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Contoh: IKM Sari Tenun Wolojita"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nama resmi IKM atau kelompok pengrajin pembuat produk (opsional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* WhatsApp Number */}
                    <FormField
                      control={form.control}
                      name="whatsappNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />
                            Nomor WhatsApp Produk
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="6281234567890 (kosongkan untuk pakai nomor admin)"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nomor WA khusus untuk produk ini. Jika dikosongkan, tombol "Pesan via WA" akan otomatis menggunakan nomor admin pusat.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Marketplace URL */}
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
                              placeholder="https://www.facebook.com/marketplace/... atau https://www.tokopedia.com/..."
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Tautan ke marketplace (Facebook Marketplace, Tokopedia, Shopee, dll). Jika diisi, tombol "Beli di Marketplace" akan muncul di produk.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Image Upload / URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gambar Produk *</FormLabel>

                        {/* Mode Toggle Tabs */}
                        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-3">
                          <button
                            type="button"
                            onClick={() => setImageMode('upload')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              imageMode === 'upload'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Unggah File
                          </button>
                          <button
                            type="button"
                            onClick={() => setImageMode('url')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                              imageMode === 'url'
                                ? 'bg-background shadow-sm text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            Tautan URL
                          </button>
                        </div>

                        {/* Upload Mode */}
                        {imageMode === 'upload' && (
                          <div className="space-y-3">
                            <div
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              onDrop={handleDrop}
                              className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
                                isDragging
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
                              } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
                              onClick={() => fileInputRef.current?.click()}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  fileInputRef.current?.click();
                                }
                              }}
                            >
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileInputChange}
                              />

                              {isUploading ? (
                                <>
                                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
                                  <p className="text-sm font-medium text-foreground">
                                    Mengunggah gambar...
                                  </p>
                                </>
                              ) : watchedImageUrl && watchedImageUrl.startsWith('/uploads/') ? (
                                <>
                                  <div className="relative mb-3">
                                    <img
                                      src={watchedImageUrl}
                                      alt="Gambar terunggah"
                                      className="h-20 w-20 object-cover rounded-lg border shadow-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        form.setValue('imageUrl', '');
                                      }}
                                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Klik atau seret file untuk mengganti gambar
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-muted-foreground/60 mb-3" />
                                  <p className="text-sm font-medium text-foreground mb-1">
                                    Klik atau seret file ke sini
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    JPG, PNG, WebP (maks 5MB)
                                  </p>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      fileInputRef.current?.click();
                                    }}
                                  >
                                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                                    Pilih File
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* URL Mode */}
                        {imageMode === 'url' && (
                          <FormControl>
                            <Input
                              placeholder="https://contoh.com/gambar.jpg"
                              {...field}
                            />
                          </FormControl>
                        )}

                        <FormDescription>
                          {imageMode === 'upload'
                            ? 'Unggah file gambar dari perangkat Anda'
                            : 'Masukkan URL gambar produk'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Is Featured */}
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Produk Unggulan
                          </FormLabel>
                          <FormDescription>
                            Tampilkan produk ini sebagai produk unggulan di halaman utama
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
                          {isEditMode ? 'Perbarui Produk' : 'Simpan Produk'}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push('/admin/dashboard')}
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
            {/* Image Preview */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Pratinjau Gambar
                </CardTitle>
              </CardHeader>
              <CardContent>
                {watchedImageUrl && !imagePreviewError ? (
                  <div className="rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={watchedImageUrl}
                      alt="Pratinjau"
                      className="w-full h-48 object-cover"
                      onError={() => setImagePreviewError(true)}
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border bg-muted flex flex-col items-center justify-center h-48 text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2 opacity-40" />
                    <p className="text-sm">Belum ada gambar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Ringkasan Produk
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
                  <p className="text-sm font-medium">
                    {form.watch('category') === 'tenun'
                      ? 'Tenun Ikat'
                      : form.watch('category') === 'songket'
                        ? 'Tenun Songket'
                        : form.watch('category') === 'kopi'
                          ? 'Kopi Bajawa'
                          : form.watch('category') === 'bambu'
                            ? 'Kerajinan Bambu'
                            : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Harga</p>
                  <p className="text-sm font-medium">
                    {form.watch('price')
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                        }).format(form.watch('price'))
                      : '-'}
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

function ProductFormFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Memuat formulir...</span>
    </div>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<ProductFormFallback />}>
      <ProductFormContent />
    </Suspense>
  );
}
