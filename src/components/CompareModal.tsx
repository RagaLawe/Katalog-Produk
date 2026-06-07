'use client';

import Image from 'next/image';
import { X, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/CategoryBadge';
import PriceDisplay from '@/components/PriceDisplay';
import { useCompareStore } from '@/lib/compare-store';

interface CompareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompareModal({ open, onOpenChange }: CompareModalProps) {
  const { compareItems, removeItem } = useCompareStore();

  const adminWa = process.env.NEXT_PUBLIC_ADMIN_WA || '6281234567890';

  const getWaUrl = (productName: string, price: number) => {
    const formattedPrice = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
    const message = `Halo Admin Perindag Ngada, saya tertarik dengan produk *${productName}* seharga Rp *${formattedPrice}*. Apakah stok masih tersedia? Mohon informasinya. Terima kasih.`;
    return `https://wa.me/${adminWa}?text=${encodeURIComponent(message)}`;
  };

  const rows = [
    {
      label: 'Gambar',
      render: (item: typeof compareItems[number]) => (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-border/50">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      ),
    },
    {
      label: 'Nama Produk',
      render: (item: typeof compareItems[number]) => (
        <p className="font-semibold text-foreground text-sm sm:text-base">{item.name}</p>
      ),
    },
    {
      label: 'Kategori',
      render: (item: typeof compareItems[number]) => (
        <CategoryBadge category={item.category as 'tenun' | 'kopi' | 'bambu'} />
      ),
    },
    {
      label: 'Harga',
      render: (item: typeof compareItems[number]) => (
        <PriceDisplay price={item.price} className="text-base sm:text-lg" />
      ),
    },
    {
      label: 'Deskripsi',
      render: (item: typeof compareItems[number]) => (
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
      ),
    },
    {
      label: 'Info Pengrajin',
      render: (item: typeof compareItems[number]) => (
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          {item.description ? item.description.split('.').slice(0, 2).join('.') + '.' : '—'}
        </p>
      ),
    },
    {
      label: 'WhatsApp',
      render: (item: typeof compareItems[number]) => (
        <Button
          asChild
          size="sm"
          className="bg-[#25D366] hover:bg-[#20BD5A] text-white gap-1.5"
        >
          <a href={getWaUrl(item.name, item.price)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            <span>Tanya</span>
          </a>
        </Button>
      ),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            Perbandingan Produk
          </DialogTitle>
        </DialogHeader>

        {compareItems.length < 2 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>Pilih minimal 2 produk untuk dibandingkan</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3 w-28 shrink-0">
                    &nbsp;
                  </th>
                  {compareItems.map((item) => (
                    <th key={item.id} className="p-3 text-center relative">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`Hapus ${item.name} dari perbandingan`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-border/50">
                    <td className="p-3 text-xs font-medium text-muted-foreground uppercase tracking-wider align-top whitespace-nowrap">
                      {row.label}
                    </td>
                    {compareItems.map((item) => (
                      <td key={item.id} className="p-3 text-center align-top">
                        <div className="flex flex-col items-center justify-center">
                          {row.render(item)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
