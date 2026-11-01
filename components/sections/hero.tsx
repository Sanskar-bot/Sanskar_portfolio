'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, FileText, MapPin } from 'lucide-react';
import { profile, education } from '@/lib/portfolio-data';
import { ease } from '@/lib/motion';

const codeLines = [
  { text: '<html>', muted: true },
  { text: 'res.status(200).json(me);', muted: false },
  { text: '<div class="stark">', muted: true },
  { text: 'const me = dev + security;', muted: false },
  { text: 'app.listen(3000);', muted: true },
  { text: 'await db.query(me);', muted: true },
  { text: 'color: #ff7a18;', brand: true },
  { text: 'SELECT * FROM ideas;', muted: true },
  { text: 'const stack = [react, flask];', muted: false },
  { text: 'export default bugs;', muted: true },
  { text: '// stay curious', comment: true },
  { text: 'git push origin main', muted: false },
  { text: 'Python | C++', muted: false },
];

// ── Idle "floating" motion (levitation loop) ──
// Every floating thing is TWO nested elements: the outer one drifts up/down, the inner one drifts
// left/right (+ a hair of rotation) with a DIFFERENT duration. Two slow loops that never line up
// make an organic, never-repeating float instead of a mechanical up-and-down bounce.
// The CSS lives in app/globals.css (.hero-float-y / .hero-float-x). Reduced-motion users get none.
type FloatCfg = {
  y: number;      // px the element rises (negative) or sinks (positive)
  x: number;      // px it drifts sideways
  r?: number;     // degrees of tiny tilt at the far end of the sideways drift
  yDur: number;   // seconds for one up->down half-cycle
  xDur: number;   // seconds for one left->right half-cycle (keep different from yDur)
  phase: number;  // seconds into the loop it starts at (so nothing moves in sync)
};

function floatVars(c: FloatCfg) {
  return {
    outer: {
      '--float-y': `${c.y}px`,
      '--float-y-dur': `${c.yDur}s`,
      '--float-y-delay': `${-c.phase}s`,
    } as React.CSSProperties,
    inner: {
      '--float-x': `${c.x}px`,
      '--float-r': `${c.r ?? 0}deg`,
      '--float-x-dur': `${c.xDur}s`,
      '--float-x-delay': `${-c.phase * 0.7}s`,
    } as React.CSSProperties,
  };
}

// Big word on the right. Small, slow, clearly visible.
const DEVELOPER_FLOAT: FloatCfg = { y: -16, x: 10, r: 1.0, yDur: 4.8, xDur: 7.0, phase: 1.5 };

// One entry per line in `codeLines` (same order, same count = 13).
// indent = static left offset in px (this is what makes the lines look scattered, not in a column)
// scale  = font-size multiplier (some lines slightly bigger, like a loose code cloud)
const CODE_LINE_LAYOUT: (FloatCfg & { indent: number; scale: number })[] = [
  { indent: 25, scale: 1.0, y: -16, x: 13, yDur: 6.5, xDur: 9.5, phase: 0.4 },
  { indent: 7, scale: 1.0, y: -14, x: -11, yDur: 5.8, xDur: 8.8, phase: 2.1 },
  { indent: 0, scale: 1.1, y: 16, x: 13, yDur: 7.3, xDur: 10.0, phase: 3.3 },
  { indent: 16, scale: 1.05, y: 14, x: -13, yDur: 5.5, xDur: 8.0, phase: 4.7 },
  { indent: 39, scale: 1.0, y: -16, x: 11, yDur: 6.8, xDur: 9.3, phase: 1.1 },
  { indent: 21, scale: 1.0, y: -14, x: -10, yDur: 6.0, xDur: 10.0, phase: 5.2 },
  { indent: 0, scale: 1.05, y: 16, x: 13, yDur: 6.3, xDur: 8.3, phase: 2.8 },
  { indent: 34, scale: 0.95, y: 14, x: -11, yDur: 7.5, xDur: 10.5, phase: 0.9 },
  { indent: 5, scale: 1.05, y: -16, x: 11, yDur: 5.8, xDur: 9.0, phase: 3.9 },
  { indent: 44, scale: 1.05, y: -14, x: -13, yDur: 6.8, xDur: 7.8, phase: 4.3 },
  { indent: 14, scale: 1.0, y: 16, x: 10, yDur: 7.0, xDur: 9.8, phase: 1.8 },
  { indent: 30, scale: 1.0, y: 14, x: -11, yDur: 5.5, xDur: 8.5, phase: 5.6 },
  { indent: 23, scale: 1.1, y: -16, x: 11, yDur: 6.5, xDur: 10.3, phase: 2.4 },
];

// ── Hand-written signature (animated image) ──
// The signature is an animated WebP exported from the user's handwriting GIF (white ink on a
// transparent background). It plays ONCE (the pen writes "Sanskar Phougat") and then holds the
// finished signature. Visitors who enabled "reduce motion" in their OS get the finished
// signature as a still PNG. This is done with <picture> + a media query (pure HTML, no JS),
// which avoids React hydration mismatches.
function HeroSignature() {
  return (
    <picture>
      <source
        media="(prefers-reduced-motion: reduce)"
        srcSet="/signature/sanskar-signature-static.png"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/signature/sanskar-signature.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute z-10 select-none"
        style={{
          // All values are in `em`, so they scale with the giant OPINIONS word automatically.
          left: '0.82em',      // ← tuning: horizontal start (increase = move right)
          top: '0.6em',        // ← tuning: vertical position (increase = move DOWN, onto the black)
          width: '2.7em',      // ← tuning: size (height follows automatically)
          height: 'auto',
          transform: 'rotate(-2deg)',
          transformOrigin: 'center center',
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))',
        }}
      />
    </picture>
  );
}

export function Hero() {
  const prefersReduced = useReducedMotion();
  const [showProfile, setShowProfile] = useState(false);
  const [pinned, setPinned] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const portraitWrapperRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // Alpha (transparency) data of /avatar.png, used to detect the real silhouette
  const alphaRef = useRef<{ data: Uint8ClampedArray; w: number; h: number } | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const pinnedRef = useRef(false);

  const anim = (props: object) =>
    prefersReduced ? { initial: {}, animate: {} } : props;

  // ── Load avatar alpha channel once (same-origin, so no CORS issue) ──
  useEffect(() => {
    const img = new window.Image();
    img.src = '/avatar.png';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        alphaRef.current = {
          data: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
          w: canvas.width,
          h: canvas.height,
        };
      } catch {
        alphaRef.current = null; // fallback: whole image box counts as hover area
      }
    };
  }, []);

  // ── Is this screen point on an OPAQUE pixel of the portrait? ──
  // The <img> uses object-contain + object-bottom, so we map screen coords to image pixels.
  const isOnPortrait = useCallback((clientX: number, clientY: number) => {
    const img = imgRef.current;
    if (!img) return false;
    const a = alphaRef.current;
    if (!a) return true; // alpha not ready / failed: behave like a normal hover box
    const r = img.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const scale = Math.min(r.width / a.w, r.height / a.h);
    const drawnW = a.w * scale;
    const drawnH = a.h * scale;
    const left = r.left + (r.width - drawnW) / 2; // object-contain centres horizontally
    const top = r.top + (r.height - drawnH);       // object-bottom aligns to the bottom
    const x = Math.floor((clientX - left) / scale);
    const y = Math.floor((clientY - top) / scale);
    if (x < 0 || y < 0 || x >= a.w || y >= a.h) return false;
    return a.data[(y * a.w + x) * 4 + 3] > 40; // alpha > 40/255 = visible pixel
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  // Small delay (150 ms) so the popup doesn't flicker when the cursor crosses tiny gaps
  const scheduleClose = useCallback(() => {
    if (pinnedRef.current) return;
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      if (!pinnedRef.current) setShowProfile(false);
    }, 150);
  }, [cancelClose]);

  const close = useCallback(() => {
    cancelClose();
    pinnedRef.current = false;
    setPinned(false);
    setShowProfile(false);
  }, [cancelClose]);

  const pin = useCallback(() => {
    cancelClose();
    pinnedRef.current = true;
    setPinned(true);
    setShowProfile(true);
  }, [cancelClose]);

  const isInsidePopup = (target: EventTarget | null) =>
    target instanceof Element && target.closest('#profile-popup') !== null;

  // Mouse moves over the wrapper box: open ONLY if over an opaque portrait pixel (or the popup)
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === 'touch') return; // touch uses tap (handleClick)
      const wrapper = portraitWrapperRef.current;
      if (isInsidePopup(e.target)) {
        cancelClose();
        return;
      }
      const hit = isOnPortrait(e.clientX, e.clientY);
      if (wrapper) wrapper.style.cursor = hit ? 'pointer' : 'default';
      if (hit) {
        cancelClose();
        setShowProfile(true);
      } else {
        scheduleClose();
      }
    },
    [cancelClose, scheduleClose, isOnPortrait]
  );

  const handlePointerLeave = useCallback(() => {
    scheduleClose();
  }, [scheduleClose]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isInsidePopup(e.target)) return;
      if (!isOnPortrait(e.clientX, e.clientY)) return; // clicking empty space does nothing
      if (pinnedRef.current) close();
      else pin();
    },
    [isOnPortrait, close, pin]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (pinnedRef.current) close();
        else pin();
      }
    },
    [close, pin]
  );

  // Escape closes; click outside the portrait/popup closes a pinned popup
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    const onOutside = (e: MouseEvent) => {
      if (!pinnedRef.current) return;
      if (isInsidePopup(e.target)) return;
      if (isOnPortrait(e.clientX, e.clientY)) return;
      close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [close, isOnPortrait]);

  // Clear any pending timer on unmount
  useEffect(() => cancelClose, [cancelClose]);

  // PERFORMANCE: once the user has scrolled past the hero (it is fully covered by the
  // white Statement section), stop painting it. Updates only when the state changes.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const hide = window.scrollY > window.innerHeight * 1.1;
      const next = hide ? 'hidden' : 'visible';
      if (el.style.visibility !== next) {
        el.style.visibility = next;
        if (hide) close();
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [close]);

  const visible = showProfile || pinned;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen overflow-hidden bg-[#080808] flex flex-col justify-between pt-20 pb-8 md:block md:pt-0 md:pb-0"
    >
      {/* ── Amber radial glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-0"
        style={{
          top: '5%', left: '10%',
          width: '70vw', height: '85vh',
          background: 'radial-gradient(ellipse at 40% 50%, rgba(120,48,5,0.6) 0%, rgba(70,25,0,0.22) 50%, transparent 75%)',
        }}
      />

      {/* ── Big stacked text ── */}
      <motion.div
        {...anim({
          initial: { opacity: 0, x: -40 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.9, ease },
        })}
        className="pointer-events-none relative z-10 flex flex-col justify-center px-6 pt-6 sm:px-10 md:absolute md:inset-y-0 md:left-0 md:pt-0"
        style={{ paddingLeft: 'clamp(1.5rem, 5vw, 6rem)' }}
      >
        {(['PIXELS', 'WITH', 'OPINIONS'] as const).map((word, i) => (
          <div
            key={word}
            className="relative select-none"
            style={{
              fontSize: 'clamp(52px, 11.5vw, 185px)',
              lineHeight: 0.88,
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: i === 2 ? '#FF7A18' : i === 1 ? 'transparent' : '#F5F5F5',
              WebkitTextStroke: i === 1 ? '2px rgba(255,255,255,0.2)' : undefined,
            }}
          >
            {word}
            {i === 2 && <HeroSignature />}
          </div>
        ))}

        <motion.div
          {...anim({
            initial: { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 0.7, delay: 0.5, ease },
          })}
          style={{
            originX: 0, height: 8,
            width: 'clamp(64px, 7.5vw, 144px)',
            background: '#FF7A18', marginTop: 14,
          }}
        />

        {/* Mobile-only developer label */}
        <div className="mt-4 md:hidden">
          <span className="font-black text-xl text-white">
            developer<span style={{ color: '#FF7A18' }}>.</span>
          </span>
        </div>
      </motion.div>

      {/* ── Portrait + Profile Popup ── */}
      {/*
        The outer positioning div is NOT the hover target.
        Only the tight inner wrapper around the image triggers hover.
        This prevents the popup appearing when hovering over text or empty space.
      */}
      <div
        className="pointer-events-none relative z-[35] mx-auto mt-6 flex w-full justify-center px-4 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:px-0"
        style={{ paddingLeft: 'clamp(0px, 10vw, 14vw)' }}
      >
        {/* ── Tight interactive wrapper — ONLY the portrait image triggers the popup ── */}
        <div
          ref={portraitWrapperRef}
          className="pointer-events-auto relative inline-block md:left-[clamp(16px,2.2vw,42px)]"
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="View profile information"
          aria-expanded={visible}
        >
          <motion.div
            {...anim({
              initial: { opacity: 0, y: 30 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 1, delay: 0.2, ease },
            })}
          >
            <Image
              ref={imgRef}
              src="/avatar.png"
              alt="Sanskar Phougat illustration"
              width={860}
              height={484}
              priority
              className="object-contain object-bottom drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
              style={{
                width: 'clamp(320px, 55vw, 860px)',
                height: 'auto',
                maxHeight: '88vh',
                display: 'block',
              }}
            />
          </motion.div>

          {/* ── Floating Profile Card — anchored to portrait, solid opaque background ── */}
          <AnimatePresence>
            {visible && (
              <motion.div
                id="profile-popup"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                onPointerEnter={cancelClose}
                onClick={(e) => e.stopPropagation()}
                className="absolute z-40 w-[320px] sm:w-[340px]"
                style={{
                  // Position: upper-right of the portrait on desktop, centered above on mobile
                  bottom: '75%',
                  right: '-10px',
                  // On very small screens fall back to left-aligned
                  left: 'auto',
                  // Solid, opaque background — no bleed-through
                  isolation: 'isolate',
                  background: '#000000',
                  border: '1px solid rgba(255,255,255,0.14)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,24,0.12)',
                }}
              >
                {/* Close button — visible when pinned */}
                {pinned && (
                  <button
                    onClick={(e) => { e.stopPropagation(); close(); }}
                    className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
                    aria-label="Close profile card"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Status pill */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7A18]/70 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF7A18]" />
                  </span>
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#FF7A18]">
                    Open to SDE roles
                  </span>
                </div>

                {/* Name + role */}
                <h3 className="text-[15px] font-bold leading-tight text-white">{profile.name}</h3>
                <p className="mt-0.5 text-[12px] text-white/60">{profile.role}</p>

                {/* Location */}
                <div className="mt-2 flex items-center gap-1.5 text-white/40">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="text-[11px]">{profile.location}</span>
                </div>

                <div className="my-3 h-px bg-white/10" />

                {/* Education */}
                <div className="space-y-0.5">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-widest text-white/30">
                    Education
                  </p>
                  <p className="text-[11px] font-medium text-white/80">{education.institution}</p>
                  <p className="text-[11px] text-white/50">{education.degree}</p>
                  <p className="font-mono text-[10px] text-white/30">{education.date}</p>
                </div>

                <div className="my-3 h-px bg-white/10" />

                {/* Short bio */}
                <p className="text-[11px] leading-relaxed text-white/55 line-clamp-3">
                  Final-year ECE student at JIIT Noida. I design backend systems and treat
                  encryption, access control, and testing as first-class requirements.
                </p>

                {/* Resume CTA */}
                <a
                  href={profile.links.resume}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#FF7A18] transition-opacity hover:opacity-75"
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>View Resume</span>
                </a>

                {/* Hint text when not pinned */}
                {!pinned && (
                  <p className="mt-3 font-mono text-[9px] text-white/25">
                    click to pin · esc to close
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Right side: developer. + code watermark ── */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-30 hidden select-none flex-col justify-center md:flex"
        style={{ paddingRight: 'clamp(1.5rem, 5vw, 5rem)' }}
      >
        <motion.div
          {...anim({
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.7, delay: 0.35, ease },
          })}
          className="mb-6"
        >
          <span
            className="hero-float-y inline-block"
            style={floatVars(DEVELOPER_FLOAT).outer}
          >
            <span
              className="hero-float-x inline-block font-black text-white tracking-tight"
              style={{
                fontSize: 'clamp(32px, 4.5vw, 64px)',
                ...floatVars(DEVELOPER_FLOAT).inner,
              }}
            >
              developer<span style={{ color: '#FF7A18' }}>.</span>
            </span>
          </span>
        </motion.div>

        <motion.div
          {...anim({
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.8, delay: 0.5, ease },
          })}
          className="flex flex-col gap-[clamp(3px,0.45vw,7px)]"
        >
          {codeLines.map((line, i) => {
            const layout = CODE_LINE_LAYOUT[i];
            const fv = floatVars(layout);
            return (
              <div
                key={i}
                className="hero-float-y"
                style={{ ...fv.outer, paddingLeft: layout.indent }}
              >
                <p
                  className="hero-float-x whitespace-nowrap font-mono leading-snug"
                  style={{
                    ...fv.inner,
                    fontSize: `calc(clamp(10px, 0.8vw, 13px) * ${layout.scale})`,
                    color: line.brand
                      ? '#FF7A18'
                      : line.comment
                        ? 'rgba(255,255,255,0.18)'
                        : line.muted
                          ? 'rgba(255,255,255,0.28)'
                          : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {line.text}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>

    </section>
  );
}
