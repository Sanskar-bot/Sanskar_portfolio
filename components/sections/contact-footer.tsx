'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/lib/portfolio-data';
import { Github, Linkedin, FileText, Mail, ArrowUpRight, Shield, Code2 } from 'lucide-react';
import { ease } from '@/lib/motion';

function isPlaceholder(url: string): boolean {
  return (
    url.includes('example.com') ||
    url === 'https://github.com' ||
    url === 'https://linkedin.com' ||
    url === '#'
  );
}

export function ContactFooter() {
  const prefersReduced = useReducedMotion();
  const emailIsPlaceholder = isPlaceholder(profile.links.email);

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#080808] pt-24 pb-12 sm:pt-36 sm:pb-16"
    >
      {/* Subtle soft orange background radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <div className="h-[420px] w-[680px] rounded-full bg-brand/10 blur-[90px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1 font-mono text-xs text-brand"
        >
          <span>// get in touch</span>
        </motion.div>

        {/* Large centered statement */}
        <motion.h2
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mx-auto max-w-4xl text-balance font-black tracking-tight text-white"
          style={{
            fontSize: 'clamp(36px, 6.2vw, 92px)',
            lineHeight: 1.05,
          }}
        >
          Let&apos;s build something{' '}
          <span className="text-brand">good</span>.
        </motion.h2>

        <motion.p
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18, ease }}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground"
        >
          Have an ambitious project, an engineering problem to solve, or just want
          to connect? My inbox is open.
        </motion.p>

        {/* Contact buttons row */}
        <motion.div
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.28, ease }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3.5"
        >
          {/* Primary CTA: "Send an email" */}
          <div className="relative inline-block">
            <a
              href={profile.links.email}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-brand px-6 text-sm font-semibold text-black transition-all hover:bg-brand/90 hover:shadow-[0_0_25px_rgba(255,122,24,0.45)]"
            >
              <Mail className="h-4 w-4" />
              <span>Send an email</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            {emailIsPlaceholder && (
              <span
                title="Update in portfolio-data.ts"
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black shadow-sm"
              >
                *
              </span>
            )}
          </div>

          {/* Ghost buttons: GitHub, LinkedIn, TryHackMe, LeetCode, Resume */}
          <GhostLink
            href={profile.links.github}
            label="GitHub"
            icon={<Github className="h-4 w-4" />}
          />
          <GhostLink
            href={profile.links.linkedin}
            label="LinkedIn"
            icon={<Linkedin className="h-4 w-4" />}
          />
          <GhostLink
            href={profile.links.tryhackme}
            label="TryHackMe"
            icon={<Shield className="h-4 w-4" />}
          />
          <GhostLink
            href={profile.links.leetcode}
            label="LeetCode"
            icon={<Code2 className="h-4 w-4" />}
          />
          <GhostLink
            href={profile.links.resume}
            label="Resume"
            icon={<FileText className="h-4 w-4" />}
          />
        </motion.div>
      </div>

      {/* Footer strip */}
      <footer className="relative mt-24 border-t border-white/5 pt-8 sm:mt-32">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-center font-mono text-xs text-muted-foreground sm:flex-row sm:px-8 sm:text-left">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <p>Built with Next.js · Tailwind · Framer Motion</p>
        </div>
      </footer>
    </section>
  );
}

function GhostLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  const isDummy = isPlaceholder(href);

  return (
    <div className="relative inline-block">
      <a
        href={href}
        download={href === profile.links.resume ? profile.resumeFilename : undefined}
        target="_blank"
        rel="noreferrer"
        className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-[#151515] px-4 text-sm font-medium text-foreground transition-all duration-200 hover:border-brand/40 hover:text-brand"
      >
        {icon}
        <span>{label}</span>
      </a>

      {isDummy && (
        <span
          title="Update in portfolio-data.ts"
          className="absolute -top-1 -right-1 flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black"
        >
          *
        </span>
      )}
    </div>
  );
}
