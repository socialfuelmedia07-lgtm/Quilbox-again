import React from "react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    variant?: "full" | "icon";
}

const BrandLogo = ({ className, variant = "full" }: BrandLogoProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            {/* Icon - Red Cube with Q */}
            <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10"
            >
                {/* Red Box Shape - Primary Red #E74C3C */}
                <path
                    d="M50 5 L95 25 V75 L50 95 L5 75 V25 L50 5Z"
                    fill="#E74C3C"
                />
                {/* White Inner Cube Faces for 3D effect */}
                <path
                    d="M50 5 L95 25 L50 45 L5 25 L50 5Z"
                    fill="#C0392B" // Darker shade for top
                />
                <path
                    d="M50 45 L95 25 V75 L50 95 V45Z"
                    fill="#922B21" // Darker shade for side
                />
                <path
                    d="M5 25 L50 45 V95 L5 75 V25Z"
                    fill="#FFFFFF" // White Face
                />
                {/* Q Letter on White Face */}
                <path
                    d="M38 65 L45 72 L35 72 Q38 68 38 60 Q38 52 32 52 Q26 52 26 60 Q26 68 32 68 Q34 68 35 67 L38 65 Z M32 72 Q20 72 20 60 Q20 48 32 48 Q44 48 44 60 Q44 66 42 70 L38 65 Z"
                    fill="black"
                    transform="translate(-5, -5)"
                />
                <text x="18" y="75" fontFamily="Arial, sans-serif" fontSize="40" fontWeight="bold" fill="black">Q</text>
            </svg>

            {/* Wordmark */}
            {variant === "full" && (
                <span className="text-2xl font-bold tracking-tight text-white">
                    Quil<span className="text-[#E74C3C]">Box</span>
                </span>
            )}
        </div>
    );
};

export default BrandLogo;
