"use client";

import * as React from "react";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const videoData = [
  {
    title: ["hotel", "bellboy"],
    description: "Creative Direction",
    category: "Industry Film",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    title: ["Project", "Beta"],
    description: "Motion Graphics",
    category: "Social Media",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    title: ["Project", "Gamma"],
    description: "Social Media Campaign",
    category: "Commercial",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: ["Project", "Delta"],
    description: "Corporate Video",
    category: "Short Film",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
];

export function VideoCarousel() {
  const [open, setOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState("");
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])


  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setOpen(true);
  };

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])


  return (
    <>
    <div id="work" className="w-full relative">
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="embla-fade">
          {videoData.map((video, index) => (
            <CarouselItem key={index} className="basis-full">
              <div
                className="relative w-full min-h-screen h-full"
              >
                <video
                  src={video.videoSrc}
                  muted
                  autoPlay
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover -z-10"
                ></video>
                <div className="absolute inset-0 bg-black/30"></div>
                
                {/* Overlay Content */}
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-screen flex flex-col justify-center text-white">
                  
                  {/* Top section */}
                  <div className="absolute top-10 left-4 sm:left-6 lg:left-8 font-mono text-sm">
                    {String(current).padStart(2, '0')} / {String(count).padStart(2, '0')}
                  </div>
                  
                  {/* Main content */}
                  <div className="flex-grow flex flex-col justify-center">
                    <h2 className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold uppercase leading-none">
                      {video.title.map((line, i) => <div key={i}>{line}</div>)}
                    </h2>
                     <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-24 h-24 rounded-full group mt-8"
                      onClick={() => handleVideoClick(video.videoSrc)}
                    >
                      <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-300 ease-in-out">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </Button>
                  </div>

                  {/* Bottom section */}
                  <div className="absolute bottom-10 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 flex justify-between items-end font-mono text-sm uppercase">
                    <div>
                      <span>{video.description}</span>
                      <span className="mx-2">/</span>
                      <span>{video.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <button onClick={scrollPrev} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 text-white font-mono uppercase text-sm vertical-text">
            Prev
        </button>
        <button onClick={scrollNext} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 text-white font-mono uppercase text-sm vertical-text">
            Next
        </button>
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
      </div>
    </>
  );
}
