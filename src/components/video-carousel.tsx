
"use client";

import * as React from "react";
import { Play } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

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
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const x = (mouseY / height - 0.5) * -15; // Increased intensity
        const y = (mouseX / width - 0.5) * 15;  // Increased intensity
        setRotate({ x, y });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <div 
            className="w-full h-full" 
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={cardRef}
                style={{
                    transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                    transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
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
        </div>
    );
};


export function VideoCarousel() {
  const [open, setOpen] = React.useState(false);
  const [selectedVideo, setSelectedVideo] = React.useState("");

  const handleVideoClick = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
    setOpen(true);
  };

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-headline font-bold mb-2">Our Work</h2>
        <p className="text-foreground/70">A selection of our favorite projects.</p>
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
        <CarouselContent className="-ml-4">
          {videoData.map((video, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <VideoCard video={video} onClick={() => handleVideoClick(video.videoSrc)} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
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

