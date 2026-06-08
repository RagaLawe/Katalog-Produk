import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

type TrustType = 'asli' | 'dikurasi';

interface TrustBadgeProps {
  type: TrustType;
  className?: string;
}

const trustConfig: Record<TrustType, { label: string }> = {
  asli: { label: 'Produk Asli Ngada' },
  dikurasi: { label: 'Dikurasi oleh Dinas Perindag' },
};

export default function TrustBadge({ type, className }: TrustBadgeProps) {
  const config = trustConfig[type];

  return (
    <Badge
      variant="outline"
      className={`bg-gold-accent/10 text-gold-accent border-gold-accent/20 font-medium gap-1 ${className || ''}`}
    >
      <CheckCircle className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
