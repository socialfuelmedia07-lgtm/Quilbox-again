import React from "react";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.jpg";

interface BrandLogoProps {
    className?: string;
}

const BrandLogo = ({ className }: BrandLogoProps) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            {/* Logo Icon in Rounded Square */}
            <div className="h-10 w-10 md:h-12 md:w-12 bg-black rounded-2xl overflow-hidden flex items-center justify-center shrink-0 border border-border/10 shadow-lg">
                <img
                    src={logoIcon}
                    alt="QuilBox Icon"
                    className="h-full w-full object-cover p-1"
                />
            </div>

            {/* Text Segment */}
            <div className="flex font-exo font-black text-3xl md:text-4xl tracking-tighter">
                <span className="text-black dark:text-white transition-colors duration-300">Quil</span>
                <span className="text-[#ff0000]">Box</span>
            </div>
        </div>
    );
};

export default BrandLogo;
