import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

type TrustType = 'asli' | 'dikurasi';

interface TrustBadgeProps {
  type: TrustType;
  className?: string;
}

const trustConfig: Record<TrustType, { label: string }> = {
  asli: { label: 'Asli Ngada' },
  dikurasi: { label: 'Dikurasi' },
};

export default function TrustBadge({ type, className }: TrustBadgeProps) {
  const config = trustConfig[type];

  return (
    <Badge
      variant="outline"
      className={`bg-coffee-brown/5 text-coffee-brown border-coffee-brown/10 font-medium text-[10px] sm:text-xs gap-1 px-2 py-0.5 ${className || ''}`}
    >
      <CheckCircle className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
