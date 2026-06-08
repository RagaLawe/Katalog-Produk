'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

function subscribe(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
}

function getSnapshot() {
  return localStorage.getItem('cookie_consent') ?? '';
}

function getServerSnapshot() {
  return '';
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const visible = consent === '';

  const handleAccept = useCallback(() => {
    localStorage.setItem('cookie_consent', 'accepted');
    window.dispatchEvent(new StorageEvent('storage'));
  }, []);

  const handleDecline = useCallback(() => {
    localStorage.setItem('cookie_consent', 'declined');
    window.dispatchEvent(new StorageEvent('storage'));
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
        >
          <div className="bg-white/95 dark:bg-card/95 backdrop-blur-lg shadow-lg border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">
                    Kami menggunakan cookies untuk meningkatkan pengalaman Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookies kami.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Button variant="outline" size="sm" onClick={handleDecline}>
                    Tolak
                  </Button>
                  <Button size="sm" onClick={handleAccept}>
                    Terima
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
