import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show immediately when scrolled even a bit (200px)
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={cn(
        "fixed top-32 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500",
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-12 opacity-0 pointer-events-none"
      )}
    >
      <button
        onClick={scrollToTop}
        className="flex items-center gap-2 bg-[#ff3366] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-xl shadow-rose/20 hover:scale-105 active:scale-95 transition-all"
      >
        <ArrowUp className="w-4 h-4" />
        Back to Top
      </button>
    </div>
  );
};

export default ScrollToTop;
