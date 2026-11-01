'use client';

import { smallerProjects } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { Reveal } from '@/components/sections/reveal';
import { ArrowUpRight } from 'lucide-react';

export function MoreProjects() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// more projects"
          title="Other things I've built"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {smallerProjects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.06}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/5 bg-[#151515] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
                  >
                    <span>View project</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
