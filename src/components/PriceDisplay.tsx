interface PriceDisplayProps {
  price: number;
  className?: string;
}

export default function PriceDisplay({ price, className }: PriceDisplayProps) {
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <span className={`font-semibold text-primary ${className || ''}`}>
      {formatted}
    </span>
  );
}
