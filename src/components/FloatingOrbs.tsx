'use client';

import { motion } from 'framer-motion';

const orbs = [
  {
    size: 'w-72 h-72',
    color: 'bg-primary/20',
    position: 'top-1/4 left-1/4',
    duration: 6,
    yOffset: [-15, 15, -15],
  },
  {
    size: 'w-96 h-96',
    color: 'bg-gold-accent/15',
    position: 'top-1/3 right-1/4',
    duration: 8,
    yOffset: [-20, 20, -20],
  },
  {
    size: 'w-64 h-64',
    color: 'bg-bamboo-green/10',
    position: 'bottom-1/4 left-1/3',
    duration: 10,
    yOffset: [-12, 12, -12],
  },
];

export default function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute ${orb.size} ${orb.color} rounded-full blur-3xl ${orb.position} -translate-x-1/2 -translate-y-1/2`}
          animate={{
            y: orb.yOffset,
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
