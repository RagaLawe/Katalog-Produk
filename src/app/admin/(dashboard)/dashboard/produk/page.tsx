'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Loader2,
  Save,
  ImageIcon,
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
  artisanInfo: z.string().optional(),
  imageUrl: z.string().min(1, 'URL gambar wajib diisi').url('URL gambar tidak valid'),
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
  category: 'tenun' | 'kopi' | 'bambu';
  price: number;
  description: string;
  artisanInfo: string | null;
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

  const isEditMode = !!editSlug;

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      slug: '',
      category: '',
      price: 0,
      description: '',
      artisanInfo: '',
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
      form.reset({
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        description: product.description,
        artisanInfo: product.artisanInfo || '',
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

                  {/* Artisan Info */}
                  <FormField
                    control={form.control}
                    name="artisanInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Informasi Pengrajin</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Contoh: Dibuat oleh Ibu Maria dari Desa Soa"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Informasi tentang pengrajin atau pembuat produk (opsional)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Image URL */}
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Gambar *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://contoh.com/gambar.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Masukkan URL gambar produk
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
