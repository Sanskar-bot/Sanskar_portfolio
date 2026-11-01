'use client';

import { useEffect, useState } from 'react';
import { Github, Linkedin, FileText, Menu, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { profile } from '@/lib/portfolio-data';

const navItems = [
  { label: 'Journey', href: '#journey', id: 'journey' },
  { label: 'Stack', href: '#stack', id: 'stack' },
  { label: 'Work', href: '#work', id: 'work' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Scroll detection for backdrop styling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver to highlight active section in viewport
  useEffect(() => {
    const sectionElements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible sections
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -50% 0px',
        threshold: 0.1,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300',
        scrolled
          ? 'border-b border-white/5 bg-[#080808]/95'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="relative flex h-16 w-full items-center justify-between px-4 sm:px-6">
        {/* Logo mark: split-ribbon "S" */}
        <a
          href="#top"
          aria-label="Sanskar Phougat — back to top"
          className="flex items-center transition-opacity hover:opacity-85"
        >
          <svg viewBox="0 0 40 48" className="h-10 w-auto" aria-hidden>
            <defs>
              <linearGradient id="sp-logo-a" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#ffb347" />
                <stop offset="1" stopColor="#ff7a18" />
              </linearGradient>
              <linearGradient id="sp-logo-b" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0" stopColor="#ff8a1f" />
                <stop offset="1" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            <g transform="translate(4 0) skewX(-8)" fill="none" strokeWidth="8.5">
              <path
                d="M 29 9 A 11 9.5 0 0 0 9 14.5 A 11 9.5 0 0 0 19.7 24"
                stroke="url(#sp-logo-a)"
              />
              <path
                d="M 20.4 24.02 A 11 9.5 0 0 1 31 33.5 A 11 9.5 0 0 1 20 43 A 11 9.5 0 0 1 11 38.95"
                stroke="url(#sp-logo-b)"
              />
            </g>
          </svg>
        </a>

        {/* Center Nav Links with active section highlighting */}
        <div className="hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-brand"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Right action buttons: GitHub, LinkedIn, TryHackMe, Resume */}
        <div className="hidden items-center gap-2 md:flex">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="GitHub Profile"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={profile.links.tryhackme}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            aria-label="TryHackMe"
          >
            <Shield className="h-4 w-4" />
          </a>
          <a
            href={profile.links.resume}
            className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-md border border-white/10 bg-card/60 px-3 text-xs font-medium text-foreground transition-all hover:border-brand hover:text-brand"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/5 bg-white/5 text-foreground md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Slide-down Overlay */}
      {open && (
        <div className="border-b border-white/10 bg-[#080808]/95 px-6 py-6 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-lg px-4 py-3 text-base font-medium transition-colors',
                    isActive
                      ? 'bg-brand/10 text-brand font-semibold'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={profile.links.tryhackme}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="TryHackMe"
            >
              <Shield className="h-4 w-4" />
            </a>
            <a
              href={profile.links.resume}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <FileText className="h-4 w-4" />
              Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
