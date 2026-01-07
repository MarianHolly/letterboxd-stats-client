'use client';

import { motion } from "motion/react"
import { ReactNode } from 'react';

interface ChartLoaderProps {
  children: ReactNode;
  delay?: number;
  index?: number;
}

/**
 * Wraps charts with staggered loading animations
 * Creates cascading effect when charts appear
 * Useful for dashboard layouts with multiple charts
 */
export function ChartLoader({
  children,
  delay = 0,
  index = 0,
}: ChartLoaderProps) {
  const calculatedDelay = index && index > 0 ? index * 0.1 : delay;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: calculatedDelay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
