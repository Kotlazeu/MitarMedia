import { HeroSection } from '@/components/hero-section';
import { MetricsSection } from '@/components/metrics-section';
import { ClientMarquee } from '@/components/client-marquee';
import { SocialSection } from '@/components/social-section';
import { BackToTopButton } from '@/components/back-to-top-button';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';

export default function Home() {
  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      <HeroSection />
      <div className="container px-4 sm:px-6 lg:px-8 -mt-24 z-10">
        <ScrollAnimationWrapper>
          <MetricsSection />
        </ScrollAnimationWrapper>
      </div>
      <div className="container px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 md:space-y-40 my-24 sm:my-32">
        <ScrollAnimationWrapper>
          <ClientMarquee />
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <SocialSection />
        </ScrollAnimationWrapper>
      </div>
      <BackToTopButton />
    </main>
  );
}
