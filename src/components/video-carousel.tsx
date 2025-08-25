
"use client";

import * as React from "react";
import { Play } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

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

const videoData = [
  {
    title: "Project Alpha",
    description: "Creative Direction",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: "Project Beta",
    description: "Motion Graphics",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: "Project Gamma",
    description: "Social Media Campaign",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "Project Delta",
    description: "Corporate Video",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export function VideoCarousel() {
  const [open, setOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState("");

  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setOpen(true);
  };

  return (
    <>
      <div className="w-full container px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-headline font-bold text-center mb-10">
          Our Work
        </h2>
      </div>
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
        <CarouselContent className="-ml-2 md:-ml-4">
          {videoData.map((video, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <div
                className="group relative aspect-video w-full h-full overflow-hidden rounded-lg cursor-pointer"
                onClick={() => handleVideoClick(video.videoSrc)}
              >
                <video
                  src={video.videoSrc}
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                ></video>
                <div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-black/20"></div>
                
                {/* Overlay Content */}
                <div className="absolute top-0 left-0 p-4 md:p-6 w-full h-full flex flex-col">
                    <div className="flex-grow">
                        <h3 className="text-2xl md:text-3xl font-headline font-bold text-white text-shadow-lg">
                            {video.title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <p className="text-sm md:text-base text-white/80 font-mono">
                            {video.description}
                        </p>
                    </div>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious className="absolute left-8" />
            <CarouselNext className="absolute right-8" />
        </div>
      </Carousel>

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
