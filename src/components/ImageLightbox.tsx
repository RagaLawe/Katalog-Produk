'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: { url: string; alt: string }[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageLightboxProps) {
  // Use userIndex to track user navigation; fall back to initialIndex
  const [userIndex, setUserIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const currentIndex = userIndex ?? initialIndex;

  // Reset user navigation when lightbox closes
  const handleClose = useCallback(() => {
    setUserIndex(null);
    setZoom(1);
    onClose();
  }, [onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          handleClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) {
            setUserIndex((currentIndex - 1 + images.length) % images.length);
            setZoom(1);
          }
          break;
        case 'ArrowRight':
          if (images.length > 1) {
            setUserIndex((currentIndex + 1) % images.length);
            setZoom(1);
          }
          break;
        case '+':
        case '=':
          setZoom((prev) => Math.min(prev + 0.25, 3));
          break;
        case '-':
          setZoom((prev) => Math.max(prev - 0.25, 1));
          break;
      }
    },
    [isOpen, handleClose, images.length, currentIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handlePrev = () => {
    if (images.length > 1) {
      setUserIndex((currentIndex - 1 + images.length) % images.length);
      setZoom(1);
    }
  };

  const handleNext = () => {
    if (images.length > 1) {
      setUserIndex((currentIndex + 1) % images.length);
      setZoom(1);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleIndicatorClick = (index: number) => {
    setUserIndex(index);
    setZoom(1);
  };

  if (images.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Tutup"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 1}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Perkecil"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="text-white/70 text-sm min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Perbesar"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>

          {/* Previous Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Gambar sebelumnya"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Next Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Gambar berikutnya"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
          >
            <Image
              src={images[currentIndex].url}
              alt={images[currentIndex].alt}
              width={1200}
              height={900}
              className="max-w-[90vw] max-h-[80vh] object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom})` }}
              sizes="90vw"
              priority
            />
          </motion.div>

          {/* Bottom Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
            {images.length > 1 && (
              <div className="flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleIndicatorClick(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? 'w-8 bg-white'
                        : 'w-2.5 bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Gambar ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <span className="text-white/70 text-sm ml-2">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
