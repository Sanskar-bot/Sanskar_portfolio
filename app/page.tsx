import { Navbar } from '@/components/sections/navbar';
import { Hero } from '@/components/sections/hero';
import { StatementSection } from '@/components/sections/statement';
import { Journey } from '@/components/sections/journey';
import { ExperienceSection } from '@/components/sections/experience-section';
import { TechStack } from '@/components/sections/tech-stack';
import { Work } from '@/components/sections/work';
import { MoreProjects } from '@/components/sections/more-projects';
import { OpenSourceLearning } from '@/components/sections/open-source-learning';
import { LeadershipSection } from '@/components/sections/leadership-section';
import { CertificationsSection } from '@/components/sections/certifications-section';
import { ContactFooter } from '@/components/sections/contact-footer';

export default function Home() {
  return (
    <>
      {/* Navbar — always on top */}
      <Navbar />

      {/* ── Layer 0: Hero — fixed, never moves ── */}
      <div className="fixed inset-0 z-0">
        <Hero />
      </div>

      {/* Spacer — one full viewport height before content begins */}
      <div style={{ height: '100vh' }} aria-hidden />

      {/* ── Layer 1: White Statement — sticky, stays pinned while dark slides over it ── */}
      <div className="sticky top-0 z-10">
        <StatementSection />
      </div>

      {/* ── Layer 2: Dark content — z-20, slides over the sticky white statement ── */}
      <div
        className="relative z-20 bg-[#080808]"
        style={{ borderRadius: '28px 28px 0 0' }}
      >
        <Journey />
        <ExperienceSection />

        {/* Stack gets its own rounded-top "card" feel */}
        <div className="relative bg-[#050505]" style={{ borderRadius: '24px 24px 0 0' }}>
          <TechStack />
        </div>

        {/* Work gets its own card */}
        <div className="relative bg-[#080808]" style={{ borderRadius: '24px 24px 0 0' }}>
          <Work />
        </div>

        <MoreProjects />
        <OpenSourceLearning />
        <LeadershipSection />
        <CertificationsSection />
        <ContactFooter />
      </div>
    </>
  );
}
