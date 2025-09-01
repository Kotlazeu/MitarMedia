
"use client";

import * as React from "react";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { PerspectiveWrapper } from "./perspective-wrapper";
import { useLanguage } from "@/context/language-context";
import ScrollFloat from "./scroll-float";

const videoData = [
  {
    title: "Hotel Bellboy",
    description: "Creative Direction",
    category: "Industry Film",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: "Project Beta",
    description: "Motion Graphics",
    category: "Social Media",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Project Gamma",
    description: "Social Media Campaign",
    category: "Commercial",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Project Delta",
    description: "Corporate Video",
    category: "Short Film",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];


const VideoCard = ({ video, onClick }: { video: typeof videoData[0], onClick: () => void }) => {
    return (
        <PerspectiveWrapper>
            <div
                className="relative aspect-[3/4] w-full h-full rounded-2xl overflow-hidden glassmorphism group cursor-pointer"
                onClick={onClick}
            >
                <video
                    src={video.videoSrc}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-110"
                ></video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                    <h3 className="text-2xl font-headline font-bold uppercase">{video.title}</h3>
                    <div className="self-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 ease-in-out">
                            <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                    </div>
                    <div className="text-sm uppercase font-mono">
                        <p>{video.description}</p>
                    </div>
                </div>
            </div>
        </PerspectiveWrapper>
    );
};


export function VideoCarousel() {
  const [open, setOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState("");
  const { translations } = useLanguage();

  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setOpen(true);
  };

  return (
    <>
      <div className="text-center mb-10">
        <ScrollFloat containerClassName="mb-2" textClassName="text-3xl font-headline font-bold">
          {translations.ourWork}
        </ScrollFloat>
        <ScrollFloat textClassName="text-foreground/70" ease="power2.inOut" stagger={0.01} animationDuration={0.5}>
          {translations.ourWorkSubtitle}
        </ScrollFloat>
      </div>
      <div className="relative w-full px-16">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            align: "start",
          }}
          plugins={[
              Autoplay({
                delay: 5000,
                stopOnInteraction: true,
                stopOnMouseEnter: true,
              }),
          ]}
        >
          <CarouselContent className="-ml-4">
            {videoData.map((video, index) => (
              <CarouselItem key={index} className="pl-4 sm:basis-1/2 md:basis-1/2 lg:basis-1/3">
                <VideoCard video={video} onClick={() => handleVideoClick(video.videoSrc)} />
              </CarouselItem>
            ))}
          </CarouselContent>
           <PerspectiveWrapper className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 h-12 w-12 md:h-20 md:w-20">
              <CarouselPrevious className="w-full h-full rounded-full glassmorphism [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-12 md:[&>svg]:w-12" />
           </PerspectiveWrapper>
           <PerspectiveWrapper className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 h-12 w-12 md:h-20 md:w-20">
              <CarouselNext className="w-full h-full rounded-full glassmorphism [&>svg]:h-6 [&>svg]:w-6 md:[&>svg]:h-12 md:[&>svg]:w-12"/>
           </PerspectiveWrapper>
        </Carousel>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glassmorphism p-0 border-0 max-w-4xl w-full">
          <div className="relative aspect-video">
            {selectedVideo && (
              <video
                src={selectedVideo}
                controls
                autoPlay
                className="w-full h-full rounded-lg"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
