'use client';

import { GitCompareArrows, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useCompareStore, type CompareItem } from '@/lib/compare-store';

interface CompareButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    imageUrl: string;
  };
}

export default function CompareButton({ product }: CompareButtonProps) {
  const { compareItems, addItem, removeItem, isInCompare } = useCompareStore();
  const selected = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (selected) {
      removeItem(product.id);
    } else {
      if (compareItems.length >= 3) {
        toast.error('Maksimal 3 produk untuk dibandingkan');
        return;
      }
      const item: CompareItem = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
      };
      addItem(item);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Bandingkan"
      aria-label={selected ? `Hapus ${product.name} dari perbandingan` : `Bandingkan ${product.name}`}
      className={`absolute top-3 right-3 z-[4] flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 cursor-pointer ${
        selected
          ? 'bg-primary text-primary-foreground shadow-md scale-110'
          : 'bg-background/80 backdrop-blur-sm text-muted-foreground border border-border/50 hover:bg-background hover:text-foreground hover:scale-105'
      }`}
    >
      {selected ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
    </button>
  );
}
