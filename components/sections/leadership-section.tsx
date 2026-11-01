'use client';

import { leadership } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { Reveal } from '@/components/sections/reveal';

export function LeadershipSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// leadership & teaching"
          title="Sharing what I know"
        />

        <div className="mt-14 space-y-6">
          {leadership.map((item, i) => (
            <Reveal key={`${item.title}-${item.org}`} delay={i * 0.08}>
              <article className="group rounded-2xl border border-white/5 bg-[#151515] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-brand">
                      {item.org}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-muted-foreground/80">
                    {item.date}
                  </span>
                </div>

                {item.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {item.bullets.map((bullet, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand/60" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
