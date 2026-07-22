import { Shirt, Coffee, TreePine, type LucideIcon } from 'lucide-react';

export type IkmCategory = 'tenun' | 'songket' | 'kopi' | 'bambu';

interface CategoryMeta {
  label: string;
  color: 'amber' | 'rose' | 'orange' | 'emerald';
  icon: LucideIcon;
}

/**
 * Metadata untuk setiap kategori IKM.
 * - tenun   → Tenun Ikat       (amber)
 * - songket → Tenun Songket    (rose)
 * - kopi    → Kopi Bajawa      (orange)
 * - bambu   → Kerajinan Bambu  (emerald)
 */
export const CATEGORY_META: Record<IkmCategory, CategoryMeta> = {
  tenun: { label: 'Tenun Ikat', color: 'amber', icon: Shirt },
  songket: { label: 'Tenun Songket', color: 'rose', icon: Shirt },
  kopi: { label: 'Kopi Bajawa', color: 'orange', icon: Coffee },
  bambu: { label: 'Kerajinan Bambu', color: 'emerald', icon: TreePine },
};

/**
 * Ambil inisial dari nama IKM.
 * Mengambil huruf pertama dari 2 kata pertama (uppercase).
 * Contoh:
 *   "Kelompok Pengrajin Tenun Bajawa" → "KP"
 *   "Sanggar Tenun"                   → "ST"
 *   "Koperasi"                        → "K"
 */
export function getIkmInitials(name: string): string {
  if (!name) return '?';
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const initials = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '');
  return initials.join('') || '?';
}

/**
 * Kembalikan kelas Tailwind untuk avatar berdasarkan kategori IKM.
 * Menggunakan warna solid + teks putih agar kontras di lingkaran avatar.
 */
export function getIkmAvatarColor(category: string): string {
  switch (category) {
    case 'tenun':
      return 'bg-amber-500 text-white';
    case 'songket':
      return 'bg-rose-500 text-white';
    case 'kopi':
      return 'bg-orange-500 text-white';
    case 'bambu':
      return 'bg-emerald-500 text-white';
    default:
      return 'bg-primary text-primary-foreground';
  }
}

/**
 * Kembalikan kelas Tailwind untuk hero gradient background berdasarkan kategori.
 */
export function getIkmHeroGradient(category: string): string {
  switch (category) {
    case 'tenun':
      return 'from-amber-50 via-amber-100/50 to-background';
    case 'songket':
      return 'from-rose-50 via-rose-100/50 to-background';
    case 'kopi':
      return 'from-orange-50 via-orange-100/50 to-background';
    case 'bambu':
      return 'from-emerald-50 via-emerald-100/50 to-background';
    default:
      return 'from-primary/5 via-primary/10 to-background';
  }
}

/**
 * Format alamat IKM. Truncate jika terlalu panjang, atau fallback
 * ke "Kabupaten Ngada, NTT" bila alamat kosong.
 */
export function formatIkmAddress(address?: string | null): string {
  if (!address || !address.trim()) {
    return 'Kabupaten Ngada, NTT';
  }
  const trimmed = address.trim();
  if (trimmed.length <= 80) return trimmed;
  return trimmed.slice(0, 77).trimEnd() + '...';
}

/**
 * Normalisasi nomor WhatsApp ke format internasional tanpa tanda +/strip/spasi.
 * Bila diawali "0", ganti dengan "62" (kode negara Indonesia).
 */
export function normalizeWhatsappNumber(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('62')) return cleaned;
  if (cleaned.startsWith('0')) return '62' + cleaned.slice(1);
  return '62' + cleaned;
}

/**
 * Bangun URL wa.me dengan pesan default yang ramah untuk IKM.
 */
export function buildIkmWhatsappUrl(
  ikmName: string,
  whatsappNumber?: string | null
): string | null {
  const normalized = normalizeWhatsappNumber(whatsappNumber);
  if (!normalized) return null;
  const message = `Halo, saya tertarik dengan produk dari IKM *${ikmName}*. Mohon informasi ketersediaan dan pemesanannya. Terima kasih.`;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

/**
 * Kembalikan string kelas Tailwind lengkap untuk badge kategori IKM.
 * Penting: Tailwind tidak mendukung interpolasi string seperti `bg-${color}-50`,
 * jadi kita harus mengembalikan kelas lengkap yang sudah statis.
 */
export function getIkmCategoryBadgeClasses(category: string): string {
  switch (category) {
    case 'tenun':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'songket':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'kopi':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'bambu':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-primary/5 text-primary border-primary/10';
  }
}
