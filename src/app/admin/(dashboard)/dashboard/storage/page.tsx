'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Zap,
  Cloud,
  FileImage,
  Info,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/lib/admin-auth';
import { toast } from 'sonner';

interface StorageConfig {
  configured: boolean;
  supabaseUrl: string | null;
  bucketName: string;
  isVercel: boolean;
}

interface StorageProbe {
  reachable: boolean;
  bucketExists: boolean;
  buckets: string[];
  error?: string;
}

interface StorageStatus {
  config: StorageConfig;
  probe: StorageProbe;
}

export default function StorageSettingsPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAdminAuth();
  const [status, setStatus] = useState<StorageStatus | null>(null);
  const [fetching, setFetching] = useState(true);
  const [bootstrapping, setBootstrapping] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch('/api/admin/storage', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      toast.error('Gagal memeriksa status storage', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setFetching(false);
    }
  }, [token]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchStatus();
    }
  }, [isAuthenticated, token, fetchStatus]);

  const handleBootstrap = async () => {
    if (!token) return;
    setBootstrapping(true);
    try {
      const res = await fetch('/api/admin/storage', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error('Gagal membuat bucket', {
          description: data.error || `HTTP ${res.status}`,
        });
      } else if (data.created) {
        toast.success('Bucket berhasil dibuat!', {
          description: `Bucket "${data.bucketName}" kini aktif dan publik.`,
        });
      } else {
        toast.info('Bucket sudah ada', {
          description: `Bucket "${data.bucketName}" sudah tersedia.`,
        });
      }
      await fetchStatus();
    } catch (err) {
      toast.error('Gagal membuat bucket', {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setBootstrapping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const config = status?.config;
  const probe = status?.probe;
  const isConfigured = config?.configured ?? false;
  const isReachable = probe?.reachable ?? false;
  const bucketExists = probe?.bucketExists ?? false;
  const isVercel = config?.isVercel ?? false;

  const healthState: 'healthy' | 'needs-bootstrap' | 'needs-config' | 'local-only' =
    !isVercel && !isConfigured
      ? 'local-only'
      : !isConfigured
        ? 'needs-config'
        : !isReachable
          ? 'needs-config'
          : !bucketExists
            ? 'needs-bootstrap'
            : 'healthy';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/dashboard')}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Pengaturan Storage
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Kelola penyimpanan gambar produk
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchStatus}
          disabled={fetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${fetching ? 'animate-spin' : ''}`} />
          Muat Ulang
        </Button>
      </div>

      {/* Overall Status Banner */}
      <Card
        className={
          healthState === 'healthy'
            ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20'
            : healthState === 'local-only'
              ? 'border-sky-500/40 bg-sky-50/50 dark:bg-sky-950/20'
              : 'border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20'
        }
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {healthState === 'healthy' ? (
                <CheckCircle2 className="h-10 w-10 text-emerald-600" />
              ) : healthState === 'local-only' ? (
                <Info className="h-10 w-10 text-sky-600" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-amber-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground">
                {healthState === 'healthy' && 'Storage Siap Digunakan'}
                {healthState === 'local-only' && 'Mode Lokal (Development)'}
                {healthState === 'needs-bootstrap' && 'Bucket Belum Dibuat'}
                {healthState === 'needs-config' && 'Storage Belum Dikonfigurasi'}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {healthState === 'healthy' &&
                  `Bucket "${config?.bucketName}" aktif dan dapat menerima upload. Upload gambar produk akan langsung tersimpan ke Supabase Storage.`}
                {healthState === 'local-only' &&
                  'Server berjalan di mode development. Upload gambar disimpan ke public/uploads/ di filesystem lokal. Tidak perlu konfigurasi Supabase.'}
                {healthState === 'needs-bootstrap' &&
                  `Supabase terhubung tetapi bucket "${config?.bucketName}" belum ada. Klik tombol di bawah untuk membuatnya secara otomatis.`}
                {healthState === 'needs-config' &&
                  'Supabase Storage belum dikonfigurasi. Di Vercel, upload akan fallback ke data URL sementara. Lihat petunjuk di bawah.'}
              </p>
            </div>
            {(healthState === 'needs-bootstrap' || healthState === 'healthy') && (
              <Badge
                variant={healthState === 'healthy' ? 'default' : 'secondary'}
                className={
                  healthState === 'healthy'
                    ? 'bg-emerald-600 hover:bg-emerald-600'
                    : ''
                }
              >
                {healthState === 'healthy' ? 'Aktif' : 'Perlu Setup'}
              </Badge>
            )}
          </div>

          {healthState === 'needs-bootstrap' && (
            <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-800/50">
              <Button
                onClick={handleBootstrap}
                disabled={bootstrapping}
                className="w-full sm:w-auto"
              >
                {bootstrapping ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {bootstrapping ? 'Membuat bucket...' : 'Buat Bucket Otomatis'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Cloud className="h-4 w-4" />
              Konfigurasi Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ConfigRow
              label="Status"
              value={
                <Badge
                  variant={isConfigured ? 'default' : 'secondary'}
                  className={
                    isConfigured
                      ? 'bg-emerald-600 hover:bg-emerald-600'
                      : 'bg-muted-foreground/20'
                  }
                >
                  {isConfigured ? 'Terhubung' : 'Belum diatur'}
                </Badge>
              }
            />
            <ConfigRow
              label="Project URL"
              value={
                <code className="text-xs text-foreground break-all">
                  {config?.supabaseUrl || '—'}
                </code>
              }
            />
            <ConfigRow
              label="Bucket Name"
              value={
                <code className="text-xs text-foreground">
                  {config?.bucketName || '—'}
                </code>
              }
            />
            <ConfigRow
              label="Environment"
              value={
                <Badge variant="outline" className="text-xs">
                  {isVercel ? 'Vercel (Production)' : 'Lokal (Development)'}
                </Badge>
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Server className="h-4 w-4" />
              Status Koneksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ConfigRow
              label="API Reachable"
              value={
                <StatusIcon
                  ok={isReachable}
                  okLabel="Tercapai"
                  badLabel="Tidak terjangkau"
                />
              }
            />
            <ConfigRow
              label="Bucket Exists"
              value={
                <StatusIcon
                  ok={bucketExists}
                  okLabel="Ada"
                  badLabel={isConfigured ? 'Belum dibuat' : 'N/A'}
                />
              }
            />
            <ConfigRow
              label="Buckets Tersedia"
              value={
                <span className="text-xs text-foreground">
                  {probe?.buckets && probe.buckets.length > 0
                    ? probe.buckets.join(', ')
                    : '—'}
                </span>
              }
            />
            {probe?.error && (
              <div className="mt-3 p-3 rounded-md bg-destructive/5 border border-destructive/20">
                <p className="text-xs text-destructive flex items-start gap-2">
                  <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{probe.error}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Setup Guide */}
      {healthState !== 'healthy' && healthState !== 'local-only' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Panduan Setup Supabase Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-3">
              <SetupStep
                step={1}
                title="Dapatkan kredensial Supabase"
                description="Buka Supabase Dashboard → Project Settings → API. Salin Project URL dan service_role key."
              />
              <SetupStep
                step={2}
                title="Set environment variables di Vercel"
                description="Buka Vercel Project Settings → Environment Variables. Tambahkan:"
                codeBlock={`SUPABASE_URL=https://jscdahwphgfmfgwavhxn.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...`}
              />
              <SetupStep
                step={3}
                title="Redeploy aplikasi"
                description="Setelah env vars ditambahkan, trigger redeploy di Vercel (Push commit baru atau klik Redeploy)."
              />
              <SetupStep
                step={4}
                title="Klik tombol 'Buat Bucket Otomatis'"
                description="Setelah redeploy, kembali ke halaman ini dan klik tombol di atas. Bucket 'product-images' akan dibuat secara otomatis dengan akses publik."
              />
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Info: How upload works */}
      <Card className="border-sky-200/50 dark:border-sky-900/40 bg-sky-50/30 dark:bg-sky-950/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-sky-700 dark:text-sky-300">
            <Info className="h-4 w-4" />
            Cara Kerja Upload Gambar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FlowStep
              icon={FileImage}
              title="1. Admin Pilih File"
              description="Admin upload gambar dari form produk (drag & drop atau klik)."
            />
            <FlowStep
              icon={Cloud}
              title="2. Upload ke Storage"
              description={
                isConfigured
                  ? 'File dikirim ke Supabase Storage bucket.'
                  : 'File disimpan lokal (dev) atau sebagai data URL (Vercel tanpa Supabase).'
              }
            />
            <FlowStep
              icon={HardDrive}
              title="3. URL Disimpan"
              description="URL gambar disimpan di database produk dan ditampilkan di katalog."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ConfigRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-right min-w-0">{value}</div>
    </div>
  );
}

function StatusIcon({
  ok,
  okLabel,
  badLabel,
}: {
  ok: boolean;
  okLabel: string;
  badLabel: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      {ok ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted-foreground'}>
        {ok ? okLabel : badLabel}
      </span>
    </span>
  );
}

function SetupStep({
  step,
  title,
  description,
  codeBlock,
}: {
  step: number;
  title: string;
  description: string;
  codeBlock?: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
        {step}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        {codeBlock && (
          <pre className="mt-2 p-3 rounded-md bg-muted text-xs overflow-x-auto">
            <code className="text-foreground">{codeBlock}</code>
          </pre>
        )}
      </div>
    </li>
  );
}

function FlowStep({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-background border border-border/50">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-sky-100 dark:bg-sky-950/40">
          <Icon className="h-4 w-4 text-sky-700 dark:text-sky-300" />
        </div>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
