'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, GripHorizontal } from 'lucide-react';
import { projects, type Project } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { cn } from '@/lib/utils';

// ── Per-project colour themes (muted: a soft tint + a thin accent line) ─────
const projectThemes: Record<
  string,
  { bgGradient: string; glowColor: string; accentColor: string; badgeBorder: string; badgeBg: string }
> = {
  MedVault: {
    bgGradient: 'from-[#0f3a38]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-teal-400/[0.08]', accentColor: '#3aa79d',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  Clarifact: {
    bgGradient: 'from-[#14284a]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-blue-400/[0.08]', accentColor: '#5b8def',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  'PassGuard & VaultZero': {
    bgGradient: 'from-[#3a2a0c]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-amber-400/[0.08]', accentColor: '#d29a3a',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  PhishingCheck4U: {
    bgGradient: 'from-[#43161a]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-rose-400/[0.08]', accentColor: '#d4607a',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  'E2E Encryption Attack Lab': {
    bgGradient: 'from-[#3a1414]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-red-400/[0.08]', accentColor: '#c75050',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  TaskFlow: {
    bgGradient: 'from-[#0f3320]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-emerald-400/[0.08]', accentColor: '#3fae7c',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
  SecureStream: {
    bgGradient: 'from-[#1d1d4a]/35 via-[#141414] to-[#101010]',
    glowColor: 'bg-indigo-400/[0.08]', accentColor: '#7c7fe0',
    badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
  },
};

const defaultTheme = {
  bgGradient: 'from-[#1f1f1f] via-[#141414] to-[#101010]',
  glowColor: 'bg-white/[0.05]', accentColor: '#ff7a18',
  badgeBorder: 'border-white/10', badgeBg: 'bg-white/[0.04]',
};

const CARD_COUNT = projects.length;
const CENTER_INDEX = Math.floor(CARD_COUNT / 2);

// ── Main section ──────────────────────────────────────────────────────────
export function Work() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(CENTER_INDEX);
  const [activeIndex, setActiveIndex] = useState(CENTER_INDEX);
  const [canPrev, setCanPrev] = useState(true);
  const [canNext, setCanNext] = useState(true);

  // ── Scroll a card to the center of the viewport ───────────────────────
  const scrollToCard = useCallback((index: number, instant = false) => {
    const container = containerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    const containerW = container.offsetWidth;
    const targetLeft = card.offsetLeft + card.offsetWidth / 2 - containerW / 2;

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: instant ? ('instant' as ScrollBehavior) : 'smooth',
    });
  }, []);

  // ── Determine which card is closest to the scroll center ──────────────
  const updateActiveCard = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollCenter = container.scrollLeft + container.offsetWidth / 2;
    let closest = 0;
    let closestDist = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - scrollCenter);
      if (dist < closestDist) { closestDist = dist; closest = i; }
    });

    if (closest !== activeIndexRef.current) {
      activeIndexRef.current = closest;
      setActiveIndex(closest);
      setCanPrev(closest > 0);
      setCanNext(closest < CARD_COUNT - 1);
    }
  }, []);

  // ── Start centered on the middle card ─────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      scrollToCard(CENTER_INDEX, true);
      updateActiveCard();
    }, 80);
    return () => clearTimeout(t);
  }, [scrollToCard, updateActiveCard]);

  // ── Sync active card while scrolling ──────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveCard);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => { container.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [updateActiveCard]);

  // ── Wheel: smooth momentum glide (trackpad two-finger swipe / shift+wheel) ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GLIDE_SPEED = 1.4; // tuning knob: higher = travels further per swipe
    const EASE = 0.16;       // tuning knob: higher = snappier, lower = floatier

    let target = container.scrollLeft;
    let raf = 0;
    let settleTimer = 0;
    let settling = false;

    const clamp = (v: number) =>
      Math.max(0, Math.min(v, container.scrollWidth - container.clientWidth));

    const nearestCardLeft = (from: number) => {
      const center = from + container.clientWidth / 2;
      let best = from;
      let bestDist = Infinity;
      cardRefs.current.forEach((card) => {
        if (!card) return;
        const c = card.offsetLeft + card.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < bestDist) {
          bestDist = d;
          best = c - container.clientWidth / 2;
        }
      });
      return clamp(best);
    };

    const tick = () => {
      const diff = target - container.scrollLeft;
      if (Math.abs(diff) < 0.5) {
        container.scrollLeft = target;
        raf = 0;
        if (settling) {
          settling = false;
          container.style.scrollSnapType = 'x mandatory'; // hand control back to CSS snap
        }
        return;
      }
      container.scrollLeft += diff * EASE;
      raf = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const horizontal = e.shiftKey || absX > absY * 0.6;
      if (!horizontal) return; // vertical scrolling passes through untouched

      e.preventDefault();

      let delta = e.shiftKey ? e.deltaY : e.deltaX;
      if (e.deltaMode === 1) delta *= 32;                     // lines → px
      else if (e.deltaMode === 2) delta *= container.clientWidth; // pages → px

      if (!raf) target = container.scrollLeft; // re-sync if arrows/dots moved it meanwhile
      container.style.scrollSnapType = 'none'; // snap must be OFF while we drive the scroll
      settling = false;
      target = clamp(target + delta * GLIDE_SPEED);
      if (!raf) raf = requestAnimationFrame(tick);

      // When the gesture (and the OS momentum) stops, ease to the nearest card
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        target = nearestCardLeft(target);
        settling = true;
        if (!raf) raf = requestAnimationFrame(tick);
      }, 140);
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onWheel);
      window.clearTimeout(settleTimer);
      if (raf) cancelAnimationFrame(raf);
      container.style.scrollSnapType = 'x mandatory';
    };
  }, []);

  return (
    <section id="work" className="relative py-24 sm:py-32">
      {/* Section header + arrows */}
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="// selected work"
            title={
              <>
                What I <em className="not-italic italic text-brand">build</em>
              </>
            }
            subtitle="Security, backend engineering, and AI — shipped and production-grade."
          />

          <div className="hidden items-center gap-2.5 sm:flex">
            <button
              type="button"
              onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
              disabled={!canPrev}
              aria-label="Previous project"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-foreground transition-all duration-200 hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToCard(Math.min(activeIndex + 1, CARD_COUNT - 1))}
              disabled={!canNext}
              aria-label="Next project"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#151515] text-foreground transition-all duration-200 hover:border-brand/50 hover:text-brand disabled:pointer-events-none disabled:opacity-25"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className="relative mt-10 w-full">
        {/* Edge fades */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#080808] to-transparent sm:w-20" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#080808] to-transparent sm:w-20" />

        {/*
          Native-scroll horizontal carousel.
          Supports: trackpad two-finger, touch, shift+wheel, drag, arrows, dots.
          scroll-snap centers each card on release.
          padding-inline ensures first/last cards can be fully centered.
        */}
        <div
          ref={containerRef}
          className="no-scrollbar flex overflow-x-auto cursor-grab active:cursor-grabbing"
          style={{
            scrollSnapType: 'x mandatory',
            overscrollBehaviorX: 'contain',
            WebkitOverflowScrolling: 'touch',
            paddingTop: '36px',
            paddingBottom: '36px',
            paddingLeft: 'max(1.5rem, calc(50% - 207px))',
            paddingRight: 'max(1.5rem, calc(50% - 207px))',
            gap: '20px',
          }}
        >
          {projects.map((project, index) => {
            const dist = Math.abs(index - activeIndex);
            const isActive = dist === 0;
            const isNear = dist === 1;

            return (
              <div
                key={project.name}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="shrink-0 w-[84vw] sm:w-[390px] md:w-[415px]"
                style={{ scrollSnapAlign: 'center' }}
              >
                <motion.div
                  animate={{
                    y: isActive ? -10 : isNear ? 0 : 6,
                    scale: isActive ? 1.02 : isNear ? 0.98 : 0.95,
                    opacity: isActive ? 1 : isNear ? 0.85 : 0.65,
                  }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ willChange: 'transform, opacity', height: '100%' }}
                >
                  <ProjectCard project={project} isActive={isActive} />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators + hint */}
      <div className="mx-auto mt-2 flex max-w-6xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Project slides">
          {projects.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to project ${index + 1}`}
                onClick={() => scrollToCard(index)}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  isActive ? 'w-6 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
                )}
              />
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground/60">
          <GripHorizontal className="h-4 w-4" />
          <span className="font-mono text-xs">drag · trackpad · arrows</span>
        </div>
      </div>
    </section>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────
function ProjectCard({ project, isActive }: { project: Project; isActive: boolean }) {
  const theme = projectThemes[project.name] ?? defaultTheme;

  return (
    <article
      className={cn(
        'group relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-2xl border bg-[#121212] transition-[border-color,box-shadow] duration-300',
        isActive
          ? 'border-white/20 shadow-[0_18px_50px_rgba(0,0,0,0.55)]'
          : 'border-white/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
      )}
    >
      {/* Thin accent hairline along the top edge (brighter on the selected card) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}${isActive ? '99' : '44'}, transparent)`,
        }}
      />

      {/* ── Top visual area ── */}
      <div
        className={cn(
          'relative h-48 w-full overflow-hidden border-b border-white/5 bg-gradient-to-br sm:h-52',
          theme.bgGradient
        )}
      >
        {project.screenshot ? (
          <Image
            src={project.screenshot}
            alt={`${project.name} screenshot`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col justify-between p-5">
            <div
              aria-hidden
              className={cn(
                'pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-80',
                theme.glowColor
              )}
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold opacity-80" style={{ color: theme.accentColor }}>
                {project.ticketNo}
              </span>
              <span className={cn('rounded-md border px-2.5 py-0.5 font-mono text-[11px] text-white/70', theme.badgeBorder, theme.badgeBg)}>
                Project
              </span>
            </div>
            <div className="relative z-10 my-auto py-2">
              {/* Title tone depends on selection (NOT hover): selected = bright, others = soft */}
              <span
                className={cn(
                  'select-none text-3xl font-semibold uppercase tracking-tight transition-colors duration-300 sm:text-4xl',
                  isActive ? 'text-white/90' : 'text-white/35'
                )}
              >
                {project.name}
              </span>
            </div>
            <div className="relative z-10 flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/90">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom content ── */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-1 text-sm font-medium italic text-brand/70">&ldquo;{project.catchphrase}&rdquo;</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-4">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-white/5 pt-4">
          {project.link ? (
            <div className="flex items-center gap-5">
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-brand"
              >
                <span>View on GitHub</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand/90 transition-opacity hover:opacity-75">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand/60" />
              <span className="font-mono text-xs text-muted-foreground/70">In Active Development</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
