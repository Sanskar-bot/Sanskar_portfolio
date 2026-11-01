'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { type ReactNode, useEffect, useState } from 'react';
import { ease } from '@/lib/motion';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'span' | 'li' | 'section';
  once?: boolean;
};

export function Reveal({
  children,
  delay = 0,
  y = 14,          // reduced from 28 → subtle, not a jump
  className,
  as = 'div',
  once = true,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Tag = as;

  if (mounted && shouldReduceMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}   // no negative margin — trigger when 15% visible
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </MotionTag>
  );
}
