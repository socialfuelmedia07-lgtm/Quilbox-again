import { ChevronRight } from "lucide-react";

const categories = [
  { icon: "✍️", name: "Writing" },
  { icon: "📓", name: "Notebooks" },
  { icon: "🎨", name: "Art" },
  { icon: "💼", name: "Office" },
  { icon: "🎒", name: "School" },
  { icon: "📦", name: "Essentials" },
];

const CategorySection = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Categories
        </h2>

        {/* Mobile: Horizontal scroll / Desktop: Grid */}
        <div className="flex md:grid md:grid-cols-6 gap-4 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className="flex-shrink-0 flex flex-col items-center gap-3 p-4 md:p-6 bg-secondary hover:bg-secondary/80 transition-colors group min-w-[100px]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-3xl md:text-4xl">{category.icon}</span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {category.name}
              </span>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
