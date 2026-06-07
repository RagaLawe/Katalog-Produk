import { Badge } from '@/components/ui/badge';

type CategoryType = 'tenun' | 'kopi' | 'bambu';

interface CategoryBadgeProps {
  category: CategoryType;
  className?: string;
}

const categoryConfig: Record<
  CategoryType,
  { label: string; bgColor: string; textColor: string }
> = {
  tenun: {
    label: 'Tenun Ikat',
    bgColor: 'bg-tenun-red/10',
    textColor: 'text-tenun-red',
  },
  kopi: {
    label: 'Kopi Bajawa',
    bgColor: 'bg-coffee-brown/10',
    textColor: 'text-coffee-brown',
  },
  bambu: {
    label: 'Kerajinan Bambu',
    bgColor: 'bg-bamboo-green/10',
    textColor: 'text-bamboo-green',
  },
};

export default function CategoryBadge({
  category,
  className,
}: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.textColor} border-current/20 font-medium ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}
