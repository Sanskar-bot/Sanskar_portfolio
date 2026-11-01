'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { journey } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

export function Journey() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 65%'],
  });

  const railHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const shouldAnimate = mounted && !prefersReduced;

  // ── Track which milestone is in view to highlight its dot ─────────────
  useEffect(() => {
    if (!mounted) return;
    const items = itemRefs.current.filter(Boolean) as HTMLLIElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = items.indexOf(entry.target as HTMLLIElement);
            if (idx !== -1) setActiveDot(idx);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0 }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  // ── Smooth-scroll to a milestone when a dot is clicked ─────────────────
  const scrollToItem = useCallback((index: number) => {
    const el = itemRefs.current[index];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  return (
    <section id="journey" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// career & experience"
          title="The journey so far"
          subtitle="From a curious student to a security-minded engineer — each step in the story."
        />
      </div>

      <div ref={sectionRef} className="relative mx-auto mt-16 max-w-4xl px-5 sm:px-8">
        {/* Grey base timeline rail */}
        <div
          aria-hidden
          className="absolute left-[20px] top-4 bottom-4 w-[2px] bg-white/10 sm:left-1/2 sm:-translate-x-1/2"
        />

        {/* Animated travelling orange progress line */}
        <motion.div
          aria-hidden
          style={{ height: shouldAnimate ? railHeight : '100%' }}
          className="absolute left-[20px] top-4 w-[2px] bg-gradient-to-b from-brand via-brand to-brand/30 sm:left-1/2 sm:-translate-x-1/2"
        />

        <ol className="space-y-12 sm:space-y-16">
          {journey.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <li
                key={`${item.title}-${i}`}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="relative sm:grid sm:grid-cols-2 sm:gap-x-16"
              >
                {/* Timeline node marker */}
                <div className="absolute left-[20px] top-5 -translate-x-1/2 z-10 sm:left-1/2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.7 }}
                    whileInView={{ scale: [0.8, 1.25, 1], opacity: 1 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, ease }}
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border-2 bg-[#080808] transition-shadow duration-300',
                      activeDot === i
                        ? 'border-brand shadow-[0_0_16px_rgba(255,122,24,0.6)]'
                        : 'border-brand/50'
                    )}
                  >
                    <span className={cn(
                      'h-1.5 w-1.5 rounded-full transition-colors duration-300',
                      activeDot === i ? 'bg-brand' : 'bg-brand/50'
                    )} />
                  </motion.div>
                </div>

                {/* Card */}
                <motion.div
                  initial={{ opacity: shouldAnimate ? 0 : 1, y: shouldAnimate ? 24 : 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.05, ease }}
                  className={
                    isLeft
                      ? 'pl-12 sm:pl-0 sm:pr-12 sm:text-right'
                      : 'pl-12 sm:col-start-2 sm:pl-12'
                  }
                >
                  <div className="group rounded-2xl border border-white/5 bg-[#151515] p-6 transition-all duration-300 hover:border-brand/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                    <div
                      className={
                        isLeft
                          ? 'flex items-center justify-between gap-2 sm:justify-end'
                          : 'flex items-center justify-between gap-2'
                      }
                    >
                      <span className="font-mono text-xs font-semibold text-muted-foreground/80">
                        {item.date}
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 text-sm font-semibold text-brand">{item.org}</p>

                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Centered dot navigator ── */}
      <div className="mt-12 flex justify-center">
        <div
          className="flex items-center gap-2.5"
          role="tablist"
          aria-label="Journey milestones"
        >
          {journey.map((item, i) => {
            const isActive = activeDot === i;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to: ${item.title}`}
                onClick={() => scrollToItem(i)}
                className={cn(
                  'rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
                  isActive
                    ? 'h-2.5 w-2.5 bg-brand shadow-[0_0_10px_rgba(255,122,24,0.6)]'
                    : 'h-2 w-2 bg-white/20 hover:bg-white/40'
                )}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
