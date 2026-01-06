'use client';

import { motion } from "motion/react"
import { ReactNode } from 'react';

interface ScrollTriggerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?: 'fadeUp' | 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'scaleUp';
}

const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function ScrollTrigger({
  children,
  className,
  delay = 0,
  type = 'fadeUp',
}: ScrollTriggerProps) {
  const variants = animationVariants[type];

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
