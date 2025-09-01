
import { MetricsSection } from '@/components/metrics-section';
import { ClientMarquee } from '@/components/client-marquee';
import { SocialSection } from '@/components/social-section';
import { BackToTopButton } from '@/components/back-to-top-button';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { AiSection } from '@/components/ai-section';
import { VideoCarousel } from '@/components/video-carousel';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center overflow-x-hidden">
        <AiSection />
        <div id="metrics" className="container px-4 sm:px-6 lg:px-8 z-10 my-24 sm:my-32">
          <ScrollAnimationWrapper>
            <MetricsSection />
          </ScrollAnimationWrapper>
        </div>
        <div id="work" className="w-full mb-24 sm:mb-32">
          <ScrollAnimationWrapper>
            <VideoCarousel />
          </ScrollAnimationWrapper>
        </div>
        <div className="container px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-32 md:space-y-40 mb-24 sm:mb-32">
          <ScrollAnimationWrapper>
            <div id="clients">
              <ClientMarquee />
            </div>
          </ScrollAnimationWrapper>
          {/*
        <ScrollAnimationWrapper>
          <div id="social">
            <SocialSection />
          </div>
        </ScrollAnimationWrapper>
        */}
        </div>
        <BackToTopButton />
      </main>
    </>
  );
}
