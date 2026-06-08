'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductReview {
  rating: number;
  review: string;
  author: string;
  date: string;
}

interface RatingsState {
  ratings: Record<string, ProductReview[]>;
  userRatings: Record<string, number>;
  addRating: (productId: string, rating: number, review: string, author: string) => void;
  getAverageRating: (productId: string) => number;
  getRatingCount: (productId: string) => number;
  getUserRating: (productId: string) => number;
  setUserRating: (productId: string, rating: number) => void;
}

// Default demo reviews keyed by product category
const defaultRatings: Record<string, ProductReview[]> = {
  tenun: [
    {
      rating: 5,
      review: 'Kain tenun yang sangat indah dan berkualitas tinggi. Motifnya sangat halus dan warnanya tahan lama. Sangat bangga dengan produk lokal Ngada!',
      author: 'Ratna Sari',
      date: '2026-05-20',
    },
    {
      rating: 4,
      review: 'Kualitas tenun sangat bagus, motif tradisionalnya autentik. Sedikit kaku saat baru diterima tapi setelah dicuci jadi lebih lembut.',
      author: 'Budi Hartono',
      date: '2026-05-15',
    },
    {
      rating: 5,
      review: 'Luar biasa! Setiap helai benang ditenun dengan penuh ketelitian. Karya seni yang layak dikoleksi. Pengrajinnya sangat terampil.',
      author: 'Dewi Lestari',
      date: '2026-04-28',
    },
    {
      rating: 4,
      review: 'Produk tenun yang sangat khas Ngada. Cocok untuk acara adat dan juga sebagai oleh-oleh. Pengiriman juga cepat dan aman.',
      author: 'Agus Pratama',
      date: '2026-04-10',
    },
  ],
  kopi: [
    {
      rating: 5,
      review: 'Kopi Bajawa yang autentik! Aromanya sangat khas dan rasa yang smooth. Sudah menjadi langganan, selalu pesan setiap bulan.',
      author: 'Hendra Wijaya',
      date: '2026-05-22',
    },
    {
      rating: 4,
      review: 'Rasa kopinya kuat dan aromatic. Sangat cocok untuk pecinta kopi robusta. Harga yang terjangkau untuk kualitas segini.',
      author: 'Siti Nurhaliza',
      date: '2026-05-10',
    },
    {
      rating: 5,
      review: 'Kopi terbaik dari Flores! Proses pengolahannya tradisional dan hasilnya luar biasa. Recommended banget untuk coffee lovers.',
      author: 'Riko Maulana',
      date: '2026-04-30',
    },
    {
      rating: 4,
      review: 'Kualitas kopi yang konsisten. Packagingnya juga rapi dan aman. Rasa khas Bajawa yang tidak bisa ditemukan di tempat lain.',
      author: 'Maya Indah',
      date: '2026-04-05',
    },
  ],
  bambu: [
    {
      rating: 5,
      review: 'Kerajinan bambu yang sangat kreatif dan detail. Menunjukkan keahlian pengrajin lokal yang luar biasa. Cocok untuk dekorasi rumah.',
      author: 'Lukman Hakim',
      date: '2026-05-18',
    },
    {
      rating: 4,
      review: 'Produk bambu yang unik dan ramah lingkungan. Finishingnya rapi, tapi harus hati-hati karena agak rapuh untuk bagian tertentu.',
      author: 'Anisa Rahma',
      date: '2026-05-08',
    },
    {
      rating: 5,
      review: 'Sangat terkesan dengan kerajinan bambu dari Ngada. Setiap produk dibuat dengan penuh ketelitian dan cinta. Layak diapresiasi!',
      author: 'Fajar Nugroho',
      date: '2026-04-25',
    },
    {
      rating: 4,
      review: 'Desainnya modern tapi tetap tradisional. Bahan bambu berkualitas dan awet. Suka banget dengan produk ini!',
      author: 'Putri Ayu',
      date: '2026-04-12',
    },
  ],
};

export const useRatingsStore = create<RatingsState>()(
  persist(
    (set, get) => ({
      ratings: { ...defaultRatings },
      userRatings: {},

      addRating: (productId: string, rating: number, review: string, author: string) => {
        const { ratings } = get();
        const existing = ratings[productId] || [];
        const newReview: ProductReview = {
          rating: Math.min(5, Math.max(1, rating)),
          review,
          author,
          date: new Date().toISOString().split('T')[0],
        };
        set({
          ratings: {
            ...ratings,
            [productId]: [...existing, newReview],
          },
        });
      },

      getAverageRating: (productId: string) => {
        const { ratings } = get();
        const productRatings = ratings[productId];
        if (!productRatings || productRatings.length === 0) return 0;
        const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / productRatings.length) * 10) / 10;
      },

      getRatingCount: (productId: string) => {
        const { ratings } = get();
        return ratings[productId]?.length || 0;
      },

      getUserRating: (productId: string) => {
        const { userRatings } = get();
        return userRatings[productId] || 0;
      },

      setUserRating: (productId: string, rating: number) => {
        const { userRatings } = get();
        set({
          userRatings: {
            ...userRatings,
            [productId]: Math.min(5, Math.max(1, rating)),
          },
        });
      },
    }),
    {
      name: 'product-ratings-storage',
    }
  )
);
