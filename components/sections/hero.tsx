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
  { text: 'Python | JavaScript', muted: false },
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
const DEVELOPER_FLOAT: FloatCfg = { y: -9, x: 5, r: 0.5, yDur: 5.2, xDur: 7.6, phase: 1.5 };

// One entry per line in `codeLines` (same order, same count = 13).
// indent = static left offset in px (this is what makes the lines look scattered, not in a column)
// scale  = font-size multiplier (some lines slightly bigger, like a loose code cloud)
const CODE_LINE_LAYOUT: (FloatCfg & { indent: number; scale: number })[] = [
  { indent: 22, scale: 1.0,  y: -4, x: 3,  yDur: 6.4, xDur: 9.0,  phase: 0.4 },
  { indent: 6,  scale: 1.0,  y: 5,  x: -3, yDur: 5.6, xDur: 8.2,  phase: 2.1 },
  { indent: 0,  scale: 1.2,  y: -6, x: 4,  yDur: 7.2, xDur: 9.6,  phase: 3.3 },
  { indent: 14, scale: 1.15, y: 4,  x: -4, yDur: 5.0, xDur: 7.4,  phase: 4.7 },
  { indent: 34, scale: 1.0,  y: -5, x: 3,  yDur: 6.8, xDur: 8.8,  phase: 1.1 },
  { indent: 18, scale: 1.0,  y: 4,  x: -2, yDur: 5.8, xDur: 9.4,  phase: 5.2 },
  { indent: 0,  scale: 1.05, y: -5, x: 4,  yDur: 6.0, xDur: 7.8,  phase: 2.8 },
  { indent: 30, scale: 0.95, y: 5,  x: -3, yDur: 7.6, xDur: 10.0, phase: 0.9 },
  { indent: 4,  scale: 1.1,  y: -4, x: 3,  yDur: 5.4, xDur: 8.6,  phase: 3.9 },
  { indent: 38, scale: 1.15, y: 6,  x: -4, yDur: 6.6, xDur: 7.2,  phase: 4.3 },
  { indent: 12, scale: 1.0,  y: -3, x: 2,  yDur: 7.0, xDur: 9.2,  phase: 1.8 },
  { indent: 26, scale: 1.0,  y: 4,  x: -3, yDur: 5.2, xDur: 8.0,  phase: 5.6 },
  { indent: 20, scale: 1.2,  y: -5, x: 3,  yDur: 6.2, xDur: 9.8,  phase: 2.4 },
];

// ── Hand-written "Sanskar": drawn stroke by stroke, like a pen on paper ──
// Three pen strokes: (1) the big S, (2) "anskar" written in one flowing line, (3) the underline.
// Each stroke is drawn with framer-motion's `pathLength` (= stroke-dashoffset), so the line
// grows along the letters exactly like ink. `len` is the approximate length of the stroke and is
// ONLY used to share the total writing time between strokes (longer stroke = more time).
// DO NOT edit the `d` values by hand — they are generated geometry.
const SIGNATURE_STROKES = [
  {
    d: 'M 18 150 C 18 150, 35.7 143.8, 44 138 C 53.8 131.2, 64.1 120.7, 72 110 C 80.2 98.8, 87.7 84.2, 92 72 C 95.7 61.7, 99 50.6, 98 42 C 97.2 35.1, 94.6 27.7, 90 24 C 85.3 20.3, 75.7 18.3, 70 20 C 64.4 21.7, 58.2 28.1, 56 34 C 53.6 40.5, 54.6 50.7, 58 58 C 61.8 66.3, 71.9 73.2, 80 80 C 88.5 87.2, 100 92.9, 108 100 C 115.1 106.3, 123.6 112.8, 126 120 C 128 126.2, 127.3 135, 124 140 C 120.7 145.1, 112.5 148.9, 106 150 C 99.2 151.1, 89.5 149.5, 84 146 C 79.2 143, 74 132, 74 132',
    len: 403,
    width: 4.5,
  },
  {
    d: 'M 168 98 C 168 98, 158.7 90, 154 90 C 149.3 90, 143 94, 140 98 C 137 102, 135.3 109, 136 114 C 136.7 119, 140 126, 144 128 C 148 130, 155.8 129, 160 126 C 164.9 122.5, 168.1 112, 170 106 C 171.4 101.6, 171.4 94, 172 94 C 172.7 94, 173 106.2, 174 112 C 175 117.5, 174.9 125.1, 178 128 C 180.7 130.5, 186.5 131.3, 190 130 C 194 128.5, 197.4 122.9, 200 118 C 203.1 112, 204.7 95.9, 206 96 C 207.3 96.1, 207.7 109.9, 208 116 C 208.3 121.1, 207.7 130, 208 130 C 208.3 130, 208.9 117.6, 210 112 C 211 107, 211.2 101.6, 214 98 C 217 94.2, 223.6 89.6, 228 90 C 232.3 90.4, 237.6 95.6, 240 100 C 242.6 104.8, 241.3 112.6, 242 118 C 242.6 122.4, 241.6 128, 244 130 C 246.3 132, 253.2 132.1, 256 130 C 259.3 127.6, 259.5 119.5, 261 114 C 262.5 108.2, 263.8 100.4, 265 96 C 265.7 93.4, 267.6 90.4, 267 90 C 266.5 89.6, 263.3 91.3, 262 93 C 260.2 95.3, 258.2 100.6, 259 104 C 259.9 107.7, 265.1 110.6, 268 114 C 270.8 117.3, 276 120.8, 276 124 C 276 126.8, 272.5 131.3, 270 132 C 267.7 132.7, 262 130, 262 129 C 262 127.9, 268.4 127.3, 272 126 C 276.3 124.4, 282.2 123.7, 286 120 C 290.8 115.4, 293.4 106.5, 296 98 C 299.2 87.2, 300.1 70.9, 302 60 C 303.4 51.7, 307.8 42.2, 306 38 C 305 35.6, 301.6 33.4, 300 34 C 297.4 35, 296.2 44.8, 295 52 C 293.3 62.3, 293.5 77.3, 293 90 C 292.5 102.7, 290.3 127.6, 292 128 C 293 128.2, 294.7 120, 297 116 C 299.7 111.3, 304 106.1, 308 102 C 311.7 98.2, 317.7 94.1, 320 92 C 321 91.1, 322 90, 322 90 C 322 90, 315.3 96.4, 312 100 C 308.6 103.7, 301.8 108.5, 302 112 C 302.1 115, 307.4 117.2, 310 120 C 312.7 122.9, 314.7 127, 318 129 C 321.3 131, 326.1 132.7, 330 132 C 334.2 131.3, 338.1 127.4, 342 124 C 346.8 119.8, 351.8 113, 356 108 C 359.6 103.7, 366.7 99, 366 96 C 365.3 93, 356.3 89.4, 352 90 C 347.6 90.6, 342.3 95.7, 340 100 C 337.6 104.4, 336.9 111.2, 338 116 C 339.1 120.5, 342.2 126.3, 346 128 C 350 129.8, 357.8 129, 362 126 C 366.9 122.5, 370.1 112, 372 106 C 373.4 101.6, 373.4 94, 374 94 C 374.7 94, 375 106.2, 376 112 C 377 117.5, 376.9 125.1, 380 128 C 382.7 130.5, 388.5 131.4, 392 130 C 396.1 128.3, 399.4 121.2, 402 116 C 404.8 110.6, 407.5 97.9, 408 98 C 408.4 98.1, 406 107.2, 406 112 C 406 117.2, 407.3 128, 408 128 C 408.7 128, 408.1 116.9, 410 112 C 412 106.9, 415.8 101.4, 420 98 C 423.9 94.8, 429.4 92.5, 434 92 C 438.1 91.5, 445.2 92.2, 446 94 C 446.6 95.4, 442 100, 442 100',
    len: 1133,
    width: 4.5,
  },
  {
    d: 'M 46 170 C 46 170, 114.7 171.8, 150 171 C 186.7 170.2, 224.8 167.3, 262 165 C 298.8 162.7, 336.6 160.3, 372 157 C 405.1 153.9, 468 146, 468 146',
    len: 423,
    width: 3.6,
  },
] as const;

function HeroSignature({ reduced }: { reduced: boolean }) {
  const START = 1.0; // seconds before the pen touches the page
  const WRITE = 3.0; // total seconds the pen is moving (all strokes together)
  const GAP = 0.15;  // tiny pause between strokes (the pen lifts)

  const totalLen = SIGNATURE_STROKES.reduce((sum, s) => sum + s.len, 0);
  let cursor = START;
  const timed = SIGNATURE_STROKES.map((s) => {
    const duration = (s.len / totalLen) * WRITE;
    const delay = cursor;
    cursor += duration + GAP;
    return { ...s, duration, delay };
  });

  return (
    <svg
      aria-hidden
      viewBox="0 0 480 180"
      className="pointer-events-none absolute z-10 overflow-visible"
      style={{
        left: '9%',                           // ← tuning: horizontal position over the text
        top: '-16%',                          // ← tuning: vertical position (negative = higher)
        width: '3.2em',                       // ← tuning: size (relative to the big word)
        height: '1.2em',                      //   keep height = width x 0.375
        transform: 'rotate(-4deg) skewX(-8deg)',
        transformOrigin: 'left center',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))',
      }}
    >
      {timed.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          fill="none"
          stroke="#F2F2F2"
          strokeWidth={s.width}               // ← tuning: pen thickness lives in SIGNATURE_STROKES
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: s.duration, delay: s.delay, ease: 'easeInOut' },
            opacity: { duration: 0.01, delay: s.delay },
          }}
        />
      ))}
    </svg>
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
            {i === 2 && <HeroSignature reduced={!!prefersReduced} />}
          </div>
        ))}

        <motion.div
          {...anim({
            initial: { scaleX: 0 },
            animate: { scaleX: 1 },
            transition: { duration: 0.7, delay: 0.5, ease },
          })}
          style={{
            originX: 0, height: 5,
            width: 'clamp(160px, 35vw, 560px)',
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
          className="flex flex-col gap-0.5"
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
                    fontSize: `calc(clamp(9px, 0.75vw, 12.5px) * ${layout.scale})`,
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
