'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  className?: string;
  size?: 'default' | 'sm' | 'lg';
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
}

export default function ShareButton({
  className,
  size = 'default',
  variant = 'outline',
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Tautan berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const url = window.location.href;
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      toast.success('Tautan berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={`gap-2 ${className || ''}`}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      <span>{copied ? 'Disalin!' : 'Bagikan'}</span>
    </Button>
  );
}
