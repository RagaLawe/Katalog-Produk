'use client';

import { Star } from 'lucide-react';
import { useRatingsStore } from '@/lib/ratings-store';

interface StarRatingProps {
  productId: string;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4.5 w-4.5',
  lg: 'h-5.5 w-5.5',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export default function StarRating({
  productId,
  interactive = false,
  size = 'md',
  showCount = true,
  className = '',
}: StarRatingProps) {
  const { getAverageRating, getRatingCount, getUserRating, setUserRating } = useRatingsStore();
  const average = getAverageRating(productId);
  const count = getRatingCount(productId);
  const userRating = getUserRating(productId);

  const displayRating = interactive && userRating > 0 ? userRating : average;

  const handleClick = (starValue: number) => {
    if (interactive) {
      setUserRating(productId, starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(displayRating);
          const halfFilled = !filled && star - 0.5 <= displayRating;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={undefined}
              className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-150`}
              disabled={!interactive}
              aria-label={`Beri rating ${star} bintang`}
            >
              <Star
                className={`${sizeMap[size]} ${
                  filled
                    ? 'text-gold-accent fill-gold-accent'
                    : halfFilled
                      ? 'text-gold-accent fill-gold-accent/50'
                      : 'text-muted-foreground/30'
                } transition-colors duration-150`}
              />
            </button>
          );
        })}
      </div>
      {showCount && count > 0 && (
        <span className={`${textSizeMap[size]} text-muted-foreground ml-0.5`}>
          {average > 0 && <span className="font-medium text-foreground">{average}</span>}
          {' '}({count} ulasan)
        </span>
      )}
      {showCount && count === 0 && (
        <span className={`${textSizeMap[size]} text-muted-foreground ml-0.5`}>
          Belum ada ulasan
        </span>
      )}
    </div>
  );
}
