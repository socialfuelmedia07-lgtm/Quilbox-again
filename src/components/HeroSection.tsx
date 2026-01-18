import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeroSectionProps {
  videoUrl?: string;
}

const HeroSection = ({ videoUrl }: HeroSectionProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Video/Image Background */}
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-hero"
          poster="/placeholder.svg"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )}
      
      {/* Overlay */}
      <div className="video-overlay" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-bold mb-8 animate-fade-in">
            Up to 40% OFF
          </div>

          {/* Main heading - Large, bold, impactful */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in-up"
          >
            Everything stationery,
            <br />
            at Blink‑speed.
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-10 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            Premium stationery delivered to your door. From essential pens to creative art supplies.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <Button variant="primary" size="xl" className="w-full sm:w-auto group">
              Shop Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            {videoUrl && (
              <Button 
                variant="outline" 
                size="xl" 
                className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-foreground"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5" />
                Watch Video
              </Button>
            )}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-white/80 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
