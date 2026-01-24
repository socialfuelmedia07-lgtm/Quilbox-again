import { Link } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import productPens from "@/assets/product-pens.png";
import productNotebooks from "@/assets/product-notebooks.png";
import productArt from "@/assets/product-art.png";
import productSchool from "@/assets/product-school.png";

const categories = [
  { image: productPens, name: "Writing", slug: "writing" },
  { image: productNotebooks, name: "Notebooks", slug: "notebooks" },
  { image: productArt, name: "Art Supplies", slug: "art" },
  { image: productSchool, name: "Office Desk", slug: "office" },
  { image: productSchool, name: "School Gear", slug: "school" },
  { image: productArt, name: "Combos", slug: "combo" }, // Using Art image as placeholder for Combo
  { image: productNotebooks, name: "Papers", slug: "papers" },
  { image: productPens, name: "Gift Sets", slug: "gift-sets" },
];

const CategorySection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Show 4 on mobile, all on desktop when expanded
  const visibleCategories = isExpanded ? categories : categories.slice(0, 4);

  return (
    <section className="py-1 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Shop by Category
          </h2>
          <div className="hidden md:block">
            <Button
              variant="ghost"
              className="text-primary font-bold"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show Less" : "View All"}
            </Button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 md:gap-2">
          {(isExpanded ? categories : categories.slice(0, 4)).map((category, index) => (
            <Link
              to={`/category/${category.slug}`}
              key={category.name}
              className="flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4 transition-transform group-hover:scale-110">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs md:text-sm font-bold text-center text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile See More Button */}
        <div className="mt-8 md:hidden">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-bold gap-2 text-slate-600 dark:text-slate-300"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                See More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
