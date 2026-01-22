import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-12 mt-4 px-4">
      <div className="container mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-slate-900 dark:from-gray-800 dark:to-slate-900 p-8 md:p-16 text-white shadow-2xl">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-500/20 to-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Everything stationery, <br />
              at Blink-speed.
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
              <span className="flex items-center gap-2">
                <span className="text-pink-500">🏷️</span> Big savings
              </span>
              <span className="flex items-center gap-2">
                <span className="text-purple-400">🎁</span> Combo packs
              </span>
              <span className="text-green-400 font-bold">
                % 30–40% OFF
              </span>
            </div>

          </div>


          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 mt-12 text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-mint flex items-center justify-center">
                <span className="text-lg">🚚</span>
              </div>
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-sm font-medium">Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sky flex items-center justify-center">
                <span className="text-lg">💯</span>
              </div>
              <span className="text-sm font-medium">Quality Guaranteed</span>
            </div>
          </div>
        </div >
      </div >
    </section >
  );
};

export default HeroSection;
