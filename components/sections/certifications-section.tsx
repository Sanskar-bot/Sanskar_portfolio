'use client';

import { certifications } from '@/lib/portfolio-data';
import { SectionHeader } from '@/components/sections/section-header';
import { Reveal } from '@/components/sections/reveal';

export function CertificationsSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="// certifications & achievements"
          title="Credentials"
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 0.06}>
              <div className="group flex h-full flex-col rounded-2xl border border-white/5 bg-[#151515] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {cert.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brand">
                  {cert.issuer}
                </p>
                {cert.detail && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cert.detail}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
