'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompareStore } from '@/lib/compare-store';
import CompareModal from '@/components/CompareModal';

export default function CompareDrawer() {
  const { compareItems, removeItem, clearAll } = useCompareStore();
  const [modalOpen, setModalOpen] = useState(false);

  const visible = compareItems.length >= 2;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 pb-safe"
          >
            <div className="bg-background/95 backdrop-blur-lg shadow-lg border-t border-border/50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                  {/* Selected product thumbnails */}
                  <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0">
                    <GitCompareArrows className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex items-center gap-2">
                      {compareItems.map((item) => (
                        <div key={item.id} className="relative flex items-center gap-2 bg-muted/50 rounded-full pl-1 pr-2 py-1 shrink-0">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border/50">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="28px"
                            />
                          </div>
                          <span className="text-xs font-medium text-foreground line-clamp-1 max-w-[80px]">
                            {item.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                            aria-label={`Hapus ${item.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-muted-foreground hover:text-foreground gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Hapus Semua</span>
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setModalOpen(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                    >
                      <GitCompareArrows className="h-4 w-4" />
                      Bandingkan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
