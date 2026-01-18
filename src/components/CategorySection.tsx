import CategoryCard from "./CategoryCard";

const categories = [
  { icon: "✍️", name: "Writing", itemCount: 24 },
  { icon: "📓", name: "Notebooks", itemCount: 18 },
  { icon: "🎨", name: "Art", itemCount: 32 },
  { icon: "💼", name: "Office", itemCount: 15 },
  { icon: "🎒", name: "School", itemCount: 28 },
  { icon: "📦", name: "Other Essentials", itemCount: 12 },
];

const CategorySection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Browse our curated collection of premium stationery organized by category
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.name}
              icon={category.icon}
              name={category.name}
              itemCount={category.itemCount}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
