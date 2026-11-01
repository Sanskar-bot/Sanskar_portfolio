'use client';

import { openSource, learningInPublic } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { Reveal } from '@/components/sections/reveal';
import { ArrowUpRight } from 'lucide-react';

function CompactCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string | null;
}) {
  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noreferrer' as const }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex h-full flex-col rounded-2xl border border-white/5 bg-[#151515] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
          {title}
        </h3>
        {link && (
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:text-brand group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </Wrapper>
  );
}

export function OpenSourceLearning() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// open source & learning"
          title="Building in public"
        />

        {/* Open Source subsection */}
        {openSource.length > 0 && (
          <div className="mt-14">
            <Reveal>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Open Source Contributions
              </h3>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openSource.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <CompactCard
                    title={item.title}
                    description={item.description}
                    link={item.link}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Learning in Public subsection */}
        {learningInPublic.length > 0 && (
          <div className="mt-16">
            <Reveal>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Learning in Public
              </h3>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {learningInPublic.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.06}>
                  <CompactCard
                    title={item.title}
                    description={item.description}
                    link={item.link}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
