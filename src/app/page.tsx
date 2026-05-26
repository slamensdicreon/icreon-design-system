import { getStartPage } from "@/lib/queries";
import { OptimizelyComposition } from "@optimizely/cms-sdk/react/server";
import HeroBlock from "@/components/blocks/HeroBlock";
import CardBlock from "@/components/blocks/CardBlock";
import CTABlock from "@/components/blocks/CTABlock";

async function getCmsHomepage() {
  try {
    const experience = await getStartPage();
    return experience?.composition?.nodes ?? null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const compositionNodes = await getCmsHomepage();

  if (compositionNodes) {
    return <OptimizelyComposition nodes={compositionNodes} />;
  }

  return (
    <>
      <HeroBlock
        heading="Build Enterprise Experiences at Scale"
        subheading="A headless CMS-powered platform combining the power of Optimizely with modern web technologies."
        ctaText="Explore Solutions"
        ctaLink="/solutions"
      />

      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Our Capabilities
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Enterprise-grade solutions for complex B2B challenges.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <CardBlock
              title="Digital Transformation"
              description="End-to-end digital strategy and implementation for enterprise organizations."
              linkText="Learn more"
              linkUrl="/solutions/digital-transformation"
            />
            <CardBlock
              title="Headless CMS"
              description="Content-driven experiences powered by Optimizely's Visual Builder and Content Graph."
              linkText="Learn more"
              linkUrl="/solutions/headless-cms"
            />
            <CardBlock
              title="Personalization"
              description="AI-driven personalization and experimentation to optimize every touchpoint."
              linkText="Learn more"
              linkUrl="/solutions/personalization"
            />
          </div>
        </div>
      </section>

      <CTABlock
        heading="Ready to Transform Your Digital Experience?"
        body={
          <p>
            Partner with us to build scalable, content-driven web experiences
            that drive results.
          </p>
        }
        primaryButtonText="Get Started"
        primaryButtonLink="/contact"
        secondaryButtonText="View Case Studies"
        secondaryButtonLink="/case-studies"
      />

      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Powered By</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-12 text-slate-400">
            <span className="text-lg font-semibold">Optimizely CMS</span>
            <span className="text-lg font-semibold">Next.js</span>
            <span className="text-lg font-semibold">Content Graph</span>
            <span className="text-lg font-semibold">Visual Builder</span>
            <span className="text-lg font-semibold">Tailwind CSS</span>
          </div>
        </div>
      </section>
    </>
  );
}
