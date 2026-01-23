import { Tag, Package, Percent } from "lucide-react";
import logoIcon from "@/assets/logo-icon.jpg";

const HeroSection = () => {
  return (
    <section className="relative pt-[124px] md:pt-32 pb-4 md:pb-8">
      Line 4:   return (
      Line 5:     <section className="relative pt-[124px] md:pt-32 pb-4 md:pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#fdf2f8] via-[#f5f3ff] to-[#f0f9ff] dark:from-slate-900 dark:to-slate-800 p-8 md:p-12 text-slate-900 dark:text-white shadow-xl border border-white/20">
            {/* Subtle Glow Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-pink-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Logo icon as shown in image */}
                <div className="h-16 w-16 bg-white dark:bg-black rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-md border border-slate-100 dark:border-slate-800">
                  <img
                    src={logoIcon}
                    alt="QuilBox Icon"
                    className="h-full w-full object-cover p-1.5"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-2 leading-[1.1]">
                    Everything stationery,<br className="hidden md:block" /> at <span className="text-[#ff3366]">Blink-speed.</span>
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      Big savings
                    </span>
                    <span className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Combo packs
                    </span>
                    <span className="flex items-center gap-2 text-[#ff3366]">
                      <Percent className="w-4 h-4" />
                      30–40% OFF
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      );
};

      export default HeroSection;
