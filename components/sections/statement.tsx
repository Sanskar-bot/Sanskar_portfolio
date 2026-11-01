'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ease } from '@/lib/motion';

export function StatementSection() {
  const prefersReduced = useReducedMotion();

  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.75, delay, ease },
        };

  return (
    <section
      aria-label="Statement"
      className="relative min-h-screen bg-white overflow-hidden flex flex-col justify-center"
      style={{ borderRadius: '28px 28px 0 0' }}
    >
      <div className="px-8 py-20 sm:px-14 md:px-20 lg:px-28">
        <motion.p
          {...fadeUp(0)}
          className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-8"
        >
          // philosophy
        </motion.p>

        <motion.h2
          {...fadeUp(0.08)}
          className="font-black text-[#080808] leading-[0.9] tracking-tight"
          style={{ fontSize: 'clamp(52px, 9vw, 148px)' }}
        >
          Craft is<br />
          where<br />
          science{' '}
          <span style={{ color: '#FF7A18' }}>&amp;</span>
          <br />
          art break<br />
          even.
        </motion.h2>

        <motion.p
          {...fadeUp(0.18)}
          className="mt-10 max-w-xl text-neutral-500 leading-relaxed"
          style={{ fontSize: 'clamp(15px, 1.4vw, 20px)' }}
        >
          Engineering with precision. Security by instinct.
          I build things that hold up — under load and under attack.
        </motion.p>
      </div>
    </section>
  );
}
