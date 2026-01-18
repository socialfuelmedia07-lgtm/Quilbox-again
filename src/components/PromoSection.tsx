import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromoSectionProps {
  videoUrl?: string;
}

const PromoSection = ({ videoUrl }: PromoSectionProps) => {
  return (
    <section className="relative py-16 md:py-24 bg-foreground overflow-hidden">
      {/* Video/Gradient Background */}
      {videoUrl ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
      )}
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <span className="inline-block text-sm font-bold text-white/90 uppercase tracking-wider mb-4">
          Limited Time Offer
        </span>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Get 25% OFF
        </h2>
        
        <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
          Use code <span className="font-bold text-white">WELCOME25</span> at checkout
        </p>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="bg-white text-foreground border-white hover:bg-white/90"
        >
          Shop Now
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};

export default PromoSection;
