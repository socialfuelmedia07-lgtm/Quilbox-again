import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: string;
  name: string;
  itemCount?: number;
  className?: string;
  delay?: number;
}

const CategoryCard = ({ icon, name, itemCount, className, delay = 0 }: CategoryCardProps) => {
  return (
    <button
      className={cn(
        "group relative flex flex-col items-center justify-center p-6 rounded-2xl",
        "bg-card border border-border transition-all duration-300",
        "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10",
        "hover:-translate-y-2 active:scale-[0.98]",
        "animate-fade-in-up",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon Container */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
          {icon}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Name */}
      <h3 className="font-semibold text-foreground text-center group-hover:text-primary transition-colors">
        {name}
      </h3>

      {/* Item count */}
      {itemCount && (
        <span className="text-sm text-muted-foreground mt-1">
          {itemCount} items
        </span>
      )}

      {/* Hover arrow indicator */}
      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <svg
          className="w-4 h-4 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </button>
  );
};

export default CategoryCard;
