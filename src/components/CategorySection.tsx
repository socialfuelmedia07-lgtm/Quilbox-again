import { Link } from "react-router-dom";
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
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-left mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Shop by Category
          </h2>
        </div>

        {/* Category Grid - Mobile First Scrollable */}
        <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4 md:grid md:grid-cols-5 md:overflow-visible md:mx-0 md:px-0">
          {categories.map((category, index) => (
            <Link
              to={`/category/${category.slug}`}
              key={category.name}
              className="flex flex-col items-center min-w-[80px] group"
            >
              <div
                className="w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all mb-2 bg-secondary"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
