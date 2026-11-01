'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { profile, education } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { Reveal } from '@/components/sections/reveal';
import { ease } from '@/lib/motion';

export function About() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="about"
      aria-label="About"
      className="relative overflow-hidden bg-white py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Section header — dark text on white */}
        <Reveal>
          <span className="font-mono text-xs text-brand">// about me</span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#080808] sm:text-3xl md:text-4xl">
            Who I am
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-neutral-500">
            {profile.status}
          </p>
        </Reveal>

        {/* Two-column layout */}
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Left: Bio */}
          <Reveal delay={0.08}>
            <div className="space-y-5">
              <p
                className="leading-relaxed text-neutral-600"
                style={{ fontSize: 'clamp(15px, 1.3vw, 18px)' }}
              >
                {profile.bio}
              </p>

              {/* Status pill */}
              <motion.div
                initial={{ opacity: prefersReduced ? 1 : 0, scale: prefersReduced ? 1 : 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
                className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                <span className="font-mono text-xs font-medium text-[#080808]">
                  Open to SDE roles (graduating 2027)
                </span>
              </motion.div>
            </div>
          </Reveal>

          {/* Right: Education card */}
          <Reveal delay={0.16}>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 transition-all duration-300 hover:border-brand/40 hover:shadow-lg">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Education
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-[#080808]">
                {education.degree}
              </h3>
              <p className="mt-1 text-sm font-semibold text-brand">
                {education.institution}
              </p>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                {education.date}
              </p>

              {/* Coursework chips */}
              {education.coursework.length > 0 && (
                <div className="mt-5">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                    Relevant Coursework
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {education.coursework.map((course) => (
                      <span
                        key={course}
                        className="rounded-md border border-neutral-200 bg-white px-2.5 py-0.5 font-mono text-[11px] text-neutral-600"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
