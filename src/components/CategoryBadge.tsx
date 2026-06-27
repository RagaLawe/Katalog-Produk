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
    bgColor: 'bg-tenun-red/5',
    textColor: 'text-tenun-red',
  },
  kopi: {
    label: 'Kopi Bajawa',
    bgColor: 'bg-coffee-brown/5',
    textColor: 'text-coffee-brown',
  },
  bambu: {
    label: 'Kerajinan Bambu',
    bgColor: 'bg-bamboo-green/5',
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
      className={`${config.bgColor} ${config.textColor} border-current/10 font-medium text-[10px] sm:text-xs px-2 py-0.5 ${className || ''}`}
    >
      {config.label}
    </Badge>
  );
}
