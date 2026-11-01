'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { techCategories } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { cn } from '@/lib/utils';
import { ease } from '@/lib/motion';

export function TechStack() {
  const [activeTab, setActiveTab] = useState(0);
  const prefersReduced = useReducedMotion();
  const currentCategory = techCategories[activeTab];

  // ── Embla for the horizontal card row ──────────────────────────────────
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps',
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateArrows();
    emblaApi.on('scroll', updateArrows);
    emblaApi.on('reInit', updateArrows);
    return () => {
      emblaApi.off('scroll', updateArrows);
      emblaApi.off('reInit', updateArrows);
    };
  }, [emblaApi, updateArrows]);

  // Reset to first card on tab change, then reInit so Embla remeasures new items
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(0, true);
    const timer = setTimeout(() => {
      emblaApi.reInit();
      updateArrows();
    }, 80);
    return () => clearTimeout(timer);
  }, [activeTab, emblaApi, updateArrows]);

  // ── Wheel: trackpad horizontal / Shift+wheel support ────────────────────
  const emblaViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = emblaViewportRef.current;
    if (!el || !emblaApi) return;

    const WHEEL_SPEED = 1.3; // tuning knob: higher = glides further per swipe

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const horizontal = e.shiftKey || absX > absY * 0.6;
      if (!horizontal) return; // vertical page scroll passes through untouched

      e.preventDefault();

      let delta = e.shiftKey ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) delta *= 32;              // lines -> px
      else if (e.deltaMode === 2) delta *= el.clientWidth; // pages -> px

      // Feed the swipe into Embla's own friction/glide engine (same as mouse-drag release)
      const engine = emblaApi.internalEngine();
      engine.scrollBody.useBaseDuration().useBaseFriction();
      engine.scrollTo.distance(-delta * WHEEL_SPEED, false);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [emblaApi]);

  return (
    <section id="stack" className="relative py-24 sm:py-32">
      {/* Subtle dot grid */}
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern bg-dots opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* ── Header ── */}
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// toolchain & competencies"
          title="The stack behind everything I ship"
          subtitle="Drag or use arrows to explore — categories organised by proficiency."
        />

        {/* ── Category tabs — single horizontal row, scrollable on small screens ── */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {techCategories.map((cat, i) => {
            const isActive = activeTab === i;
            return (
              <button
                key={cat.index}
                type="button"
                onClick={() => setActiveTab(i)}
                className={cn(
                  'group relative flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'border-brand bg-brand/10 text-foreground'
                    : 'border-white/5 bg-[#151515]/60 text-muted-foreground hover:border-white/20 hover:text-foreground'
                )}
              >
                <span
                  className={cn(
                    'font-mono text-xs font-semibold',
                    isActive ? 'text-brand' : 'text-muted-foreground/50'
                  )}
                >
                  {cat.index}
                </span>
                <span>{cat.label}</span>

                {/* Active underline indicator */}
                {isActive && (
                  <motion.span
                    layoutId="stack-tab-indicator"
                    className="absolute -bottom-px left-3 right-3 h-[2px] bg-brand"
                    transition={{ duration: 0.25, ease }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Horizontal card carousel ── */}
      <div className="relative mt-8 w-full">
        {/* Navigation arrows + counter */}
        <div className="mx-auto mb-4 flex max-w-6xl items-center justify-end gap-2 px-5 sm:px-8">
          <span className="mr-auto font-mono text-xs text-muted-foreground/50">
            {currentCategory.items.length} skills
          </span>
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Previous skills"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-foreground transition-all duration-200 hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Next skills"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-foreground transition-all duration-200 hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#050505] to-transparent sm:w-16"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#050505] to-transparent sm:w-16"
        />

        {/* Embla viewport wrapper — captures trackpad/wheel events */}
        <div ref={emblaViewportRef} className="overscroll-x-contain">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-4 px-5 sm:px-8 md:px-[max(2rem,calc((100vw-72rem)/2+2rem))]">
              {currentCategory.items.map((item, i) => (
                <motion.div
                  key={`${currentCategory.index}-${item.name}`}
                  initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: prefersReduced ? 0 : i * 0.05,
                    ease,
                  }}
                  // Fixed card width — consistent gallery feel
                  className="shrink-0 w-[210px] sm:w-[230px] md:w-[240px]"
                >
                  <div className="group flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#151515] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <div>
                      {/* Category label + optional metric */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                          {currentCategory.label}
                        </span>
                        {item.metric && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-brand">
                            {item.metric}
                          </span>
                        )}
                      </div>

                      {/* Skill name */}
                      <h3 className="mt-4 text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-white sm:text-lg">
                        {item.name}
                      </h3>

                      {/* Blurb */}
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.blurb}
                      </p>
                    </div>

                    {/* Orange underline on hover */}
                    <div
                      aria-hidden
                      className="mt-5 h-[2px] w-full scale-x-0 bg-gradient-to-r from-transparent via-brand to-transparent transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Drag hint */}
        <div className="mx-auto mt-5 flex max-w-6xl justify-end px-5 sm:px-8">
          <span className="font-mono text-xs text-muted-foreground/40">
            ← drag · trackpad · arrows →
          </span>
        </div>
      </div>
    </section>
  );
}
