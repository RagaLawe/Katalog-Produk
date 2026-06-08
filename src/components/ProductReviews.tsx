'use client';

import { useState } from 'react';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import StarRating from '@/components/StarRating';
import { useRatingsStore } from '@/lib/ratings-store';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { ratings, addRating } = useRatingsStore();
  const [showForm, setShowForm] = useState(false);
  const [formAuthor, setFormAuthor] = useState('');
  const [formRating, setFormRating] = useState(0);
  const [formReview, setFormReview] = useState('');

  const productRatings = ratings[productId] || [];
  const totalReviews = productRatings.length;
  const averageRating =
    totalReviews > 0
      ? Math.round((productRatings.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0;

  // Rating distribution
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = productRatings.filter((r) => r.rating === star).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percentage };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor.trim()) {
      toast.error('Nama wajib diisi');
      return;
    }
    if (formRating === 0) {
      toast.error('Silakan pilih rating bintang');
      return;
    }
    if (!formReview.trim() || formReview.trim().length < 5) {
      toast.error('Ulasan minimal 5 karakter');
      return;
    }

    addRating(productId, formRating, formReview.trim(), formAuthor.trim());
    toast.success('Ulasan berhasil ditambahkan! Terima kasih.');
    setFormAuthor('');
    setFormRating(0);
    setFormReview('');
    setShowForm(false);
  };

  const handleStarClick = (starValue: number) => {
    setFormRating(starValue);
  };

  return (
    <div className="mt-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Ulasan Pelanggan
        </h2>
        {!showForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
          >
            <MessageSquare className="h-4 w-4" />
            Tulis Ulasan
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 mb-8 p-5 bg-card rounded-xl border border-border/50 shadow-sm">
        {/* Average Rating Display */}
        <div className="flex flex-col items-center justify-center text-center min-w-[120px]">
          <span className="text-4xl font-bold text-foreground">{averageRating}</span>
          <StarRating
            productId={productId}
            interactive={false}
            size="md"
            showCount={false}
          />
          <span className="text-sm text-muted-foreground mt-1">
            {totalReviews} ulasan
          </span>
        </div>

        {/* Rating Distribution */}
        <div className="flex flex-col gap-1.5 justify-center">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-8 flex items-center gap-0.5">
                {star} <Star className="h-3 w-3 text-gold-accent fill-gold-accent" />
              </span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-accent rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">
                {percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-5 bg-card rounded-xl border border-border/50 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Tulis Ulasan Anda
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="review-author" className="block text-sm font-medium text-foreground mb-1.5">
                Nama Anda
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="review-author"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="Masukkan nama Anda"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Star Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Rating
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="cursor-pointer hover:scale-110 transition-transform duration-150"
                    aria-label={`Beri rating ${star} bintang`}
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= formRating
                          ? 'text-gold-accent fill-gold-accent'
                          : 'text-muted-foreground/30 hover:text-gold-accent/50'
                      } transition-colors duration-150`}
                    />
                  </button>
                ))}
                {formRating > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    {formRating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label htmlFor="review-text" className="block text-sm font-medium text-foreground mb-1.5">
                Ulasan
              </label>
              <Textarea
                id="review-text"
                value={formReview}
                onChange={(e) => setFormReview(e.target.value)}
                placeholder="Bagikan pengalaman Anda tentang produk ini..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                Kirim Ulasan
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setFormRating(0);
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {productRatings.length > 0 ? (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {[...productRatings].reverse().map((review, index) => (
            <div
              key={`${review.author}-${review.date}-${index}`}
              className="p-4 bg-card rounded-lg border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= review.rating
                              ? 'text-gold-accent fill-gold-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.review}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Belum ada ulasan. Jadilah yang pertama memberikan ulasan!
          </p>
        </div>
      )}
    </div>
  );
}
