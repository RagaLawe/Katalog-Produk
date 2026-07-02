'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Loader2,
  Save,
  Building2,
  MapPin,
  Mail,
  Phone,
  Clock,
  History,
  User,
  Eye,
  Target,
  Briefcase,
  MapPinned,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const profileSchema = z.object({
  officeName: z.string().min(1, 'Nama kantor wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'),
  history: z.string().min(10, 'Sejarah minimal 10 karakter'),
  leaderName: z.string().optional(),
  leaderPosition: z.string().optional(),
  leaderPhoto: z.string().optional(),
  vision: z.string().min(5, 'Visi minimal 5 karakter'),
  mission: z.string().min(5, 'Misi minimal 5 karakter'),
  duties: z.string().optional(),
  functions: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  workingHours: z.string().optional(),
  mapEmbed: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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

export default function AdminProfilPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      officeName: '',
      address: '',
      history: '',
      leaderName: '',
      leaderPosition: '',
      leaderPhoto: '',
      vision: '',
      mission: '',
      duties: '',
      functions: '',
      email: '',
      phone: '',
      workingHours: '',
      mapEmbed: '',
    },
  });

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/profil');
        if (!res.ok) throw new Error('Gagal memuat profil');
        const data = await res.json();
        if (cancelled) return;
        form.reset({
          officeName: data.officeName ?? '',
          address: data.address ?? '',
          history: data.history ?? '',
          leaderName: data.leaderName ?? '',
          leaderPosition: data.leaderPosition ?? '',
          leaderPhoto: data.leaderPhoto ?? '',
          vision: data.vision ?? '',
          mission: data.mission ?? '',
          duties: data.duties ?? '',
          functions: data.functions ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          workingHours: data.workingHours ?? '',
          mapEmbed: data.mapEmbed ?? '',
        });
      } catch {
        if (cancelled) return;
        toast.error('Gagal memuat data profil');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!token) {
      toast.error('Sesi telah berakhir. Silakan login kembali.');
      router.push('/admin');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profil', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || 'Gagal menyimpan profil');
        return;
      }
      toast.success('Profil Dinas berhasil disimpan');
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Memuat data profil...</span>
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
          <h1 className="text-2xl font-bold text-foreground">Profil Dinas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola informasi profil Dinas Perindag yang tampil di halaman
            Tentang
          </p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Edit Profil Dinas Perindag</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Informasi Kantor */}
              <section className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                <FieldGroupHeader
                  icon={Building2}
                  title="Informasi Kantor"
                  description="Identitas dan kontak resmi dinas."
                />

                <FormField
                  control={form.control}
                  name="officeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        Nama Kantor *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dinas Perdagangan dan Perindustrian Kabupaten Ngada"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        Alamat *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Jl. Ahmed Suhadi, Bajawa, Kecamatan Bajawa, Kabupaten Ngada, Nusa Tenggara Timur 86412"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="perindag@ngadakab.go.id"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5" />
                          Telepon
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+62 384 21023"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="workingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Jam Kerja
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Senin-Kamis 08.00-16.00 WITA"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Contoh: Senin-Kamis 08.00-16.00 WITA
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mapEmbed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <MapPinned className="h-3.5 w-3.5" />
                        Embed Google Maps
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tempel URL src dari iframe embed Google Maps"
                          className="min-h-[70px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL embed Google Maps (src dari iframe embed). Buka
                        Google Maps &rarr; Share &rarr; Embed a map &rarr;
                        salin hanya bagian URL pada atribut{' '}
                        <code>src=&quot;...&quot;</code>.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Sejarah & Pimpinan */}
              <section className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                <FieldGroupHeader
                  icon={History}
                  title="Sejarah & Pimpinan"
                  description="Latar belakang dinas dan profil pimpinan."
                />

                <FormField
                  control={form.control}
                  name="history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <History className="h-3.5 w-3.5" />
                        Sejarah Singkat *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tuliskan sejarah singkat dinas..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Sejarah singkat dinas. Pisahkan paragraf dengan baris
                        kosong (Enter dua kali).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leaderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          Nama Pimpinan
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nama Kepala Dinas"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leaderPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <Briefcase className="h-3.5 w-3.5" />
                          Jabatan
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kepala Dinas Perdagangan dan Perindustrian Kabupaten Ngada"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="leaderPhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        URL Foto Pimpinan
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://contoh.com/foto-pimpinan.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        URL foto pimpinan (opsional). Kosongkan jika belum
                        tersedia.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Visi & Misi */}
              <section className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                <FieldGroupHeader
                  icon={Eye}
                  title="Visi & Misi"
                  description="Arah dan tujuan dinas."
                />

                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        Visi *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Terwujudnya Kabupaten Ngada yang Maju..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" />
                        Misi *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tuliskan satu misi per baris..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tuliskan satu misi per baris. Setiap baris akan menjadi
                        satu poin misi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Tugas & Fungsi */}
              <section className="rounded-lg border border-border/60 p-4 sm:p-5 bg-muted/30 space-y-4">
                <FieldGroupHeader
                  icon={Briefcase}
                  title="Tugas & Fungsi"
                  description="Tugas pokok dan fungsi dinas."
                />

                <FormField
                  control={form.control}
                  name="duties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        Tugas
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Satu tugas per baris..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Tugas pokok. Satu tugas per baris.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="functions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <Target className="h-3.5 w-3.5" />
                        Fungsi
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Satu fungsi per baris..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Fungsi dinas. Satu fungsi per baris.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/dashboard')}
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Profil
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
