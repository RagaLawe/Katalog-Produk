import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/50">
      {/* Image area */}
      <Skeleton className="h-52 sm:h-56 w-full rounded-none" />

      {/* Content area */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Price */}
        <Skeleton className="h-6 w-1/2" />

        {/* Description lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
