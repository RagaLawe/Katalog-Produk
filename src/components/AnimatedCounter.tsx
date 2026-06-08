'use client';

import { useState, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  /** If true, shows the final value immediately without counting animation */
  immediate?: boolean;
}

export default function AnimatedCounter({
  value,
  suffix = '',
  duration = 2000,
  immediate = false,
}: AnimatedCounterProps) {
  // Start at 0 for animation, or show value immediately if requested
  const [count, setCount] = useState(() => (value <= 1 || immediate ? value : 0));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const hasAnimated = useRef(false);

  // Use requestAnimationFrame callback pattern to avoid setState in useEffect
  if (isInView && !hasAnimated.current && value > 1 && !immediate) {
    hasAnimated.current = true;
    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(eased * value);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
