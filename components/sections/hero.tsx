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

// ── Hand-written "Sanskar": a single pen path drawn stroke by stroke, then underlined ──
// The path is a hand-made centre line (S loop, a, n, s, k, a, r). It is drawn with
// framer-motion's `pathLength` (= stroke-dasharray / stroke-dashoffset), so it grows
// along the letters exactly like a pen. The second path is the underline.
const SIGNATURE_PATH =
  'M 24 150 C 56 152 112 124 128 78 C 138 46 122 22 102 34 C 82 48 90 80 118 98 C 144 114 158 134 146 146 C 138 154 120 154 112 146 C 130 148 156 140 176 124 C 184 114 190 106 196 102 C 176 100 164 114 166 130 C 168 148 192 150 204 128 C 208 120 208 110 206 100 C 206 124 208 144 224 148 C 232 140 236 112 240 102 C 242 120 244 138 246 148 C 250 128 260 100 274 104 C 286 108 280 136 284 148 C 290 152 298 146 304 138 C 312 124 320 96 336 98 C 350 100 342 112 328 120 C 316 128 312 146 330 148 C 344 149 350 140 356 132 C 362 112 372 50 366 28 C 360 8 346 30 350 64 C 352 100 354 130 356 148 M 394 96 C 384 112 372 124 358 128 C 372 128 386 134 392 148 C 400 152 408 144 414 136 C 418 120 424 106 432 102 C 414 100 404 114 406 130 C 408 148 432 150 444 128 C 448 120 448 110 446 100 C 446 124 448 144 464 148 C 472 140 476 116 480 104 C 482 116 490 104 502 102 C 510 101 514 106 510 110';

const SIGNATURE_UNDERLINE = 'M 40 172 C 160 160 330 180 500 158';

function HeroSignature({ reduced }: { reduced: boolean }) {
  const START = 1.0; // seconds before the pen touches the page
  const WRITE = 1.5; // seconds to write "Sanskar" (slow, deliberate)
  const LINE = 0.6;  // seconds to draw the underline after the name

  return (
    <svg
      aria-hidden
      viewBox="10 14 520 180"
      className="pointer-events-none absolute z-10 overflow-visible"
      style={{
        left: '16%',                          // ← tuning: horizontal position over the text
        top: '18%',                           // ← tuning: vertical position over the text
        width: '2.3em',                       // ← tuning: size (relative to the big word)
        height: '0.8em',                      //   keep height = width × 0.348
        transform: 'rotate(-4deg) skewX(-8deg)',
        transformOrigin: 'left center',
        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))',
      }}
    >
      {/* The name — drawn along the pen path */}
      <motion.path
        d={SIGNATURE_PATH}
        fill="none"
        stroke="#F2F2F2"
        strokeWidth={3}                       // ← tuning: pen thickness (2 = thinner, 4 = bolder)
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: WRITE, delay: START, ease: [0.4, 0.1, 0.3, 1] },
          opacity: { duration: 0.01, delay: START },
        }}
      />
      {/* The underline — drawn after the name is finished */}
      <motion.path
        d={SIGNATURE_UNDERLINE}
        fill="none"
        stroke="#F2F2F2"
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: LINE, delay: START + WRITE + 0.1, ease: 'easeOut' },
          opacity: { duration: 0.01, delay: START + WRITE + 0.1 },
        }}
      />
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
            className="font-black text-white tracking-tight"
            style={{ fontSize: 'clamp(32px, 4.5vw, 64px)' }}
          >
            developer<span style={{ color: '#FF7A18' }}>.</span>
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
          {codeLines.map((line, i) => (
            <p
              key={i}
              className="font-mono leading-snug"
              style={{
                fontSize: 'clamp(9px, 0.75vw, 12.5px)',
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
          ))}
        </motion.div>
      </div>

    </section>
  );
}
