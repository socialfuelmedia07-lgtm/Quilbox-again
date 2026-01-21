import { ArrowRight, Gift, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoSection = () => {
  return (
    <section className="py-16 bg-hero-gradient">
      <div className="container mx-auto px-4">
        {/* Promo Banner */}
        <div className="relative rounded-3xl bg-foreground overflow-hidden mb-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-peach-accent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold mb-4">
                <Gift className="w-4 h-4" />
                Limited Time Offer
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-background mb-4">
                Your one-stop shop for premium stationery, art supplies, and office essentials. Delivered at blink-speed.
              </h3>
              <p className="text-background/70">
                {/* Removed the code as it wasn't in the reference text, but keeping structure clean */}
              </p>
            </div>
            <Button variant="primary" size="lg" className="group">
              Shop Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              description: "On orders above ₹499",
              color: "mint",
            },
            {
              icon: Shield,
              title: "Secure Payments",
              description: "100% secure transactions",
              color: "sky",
            },
            {
              icon: Gift,
              title: "Gift Wrapping",
              description: "Available on all orders",
              color: "peach",
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color} flex items-center justify-center`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-accent`} />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
