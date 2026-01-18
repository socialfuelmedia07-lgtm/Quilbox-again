import { useState, useEffect } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  cartCount?: number;
  wishlistCount?: number;
}

const Header = ({ cartCount = 0, wishlistCount = 0 }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const suggestions = [
    "Gel Pens",
    "Notebooks",
    "Art Supplies",
    "School Essentials",
  ].filter((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass py-3 shadow-lg"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-xl font-bold text-primary-foreground">Q</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Quil<span className="text-primary">Box</span>
            </span>
          </a>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <div
              className={cn(
                "w-full relative transition-all duration-300",
                isSearchFocused && "transform scale-[1.02]"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300",
                  isSearchFocused
                    ? "border-primary bg-card shadow-lg shadow-primary/10"
                    : "border-border bg-card/80 backdrop-blur-sm"
                )}
              >
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
                <Button variant="primary" size="sm" className="hidden sm:flex gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  QuilAI
                </Button>
              </div>

              {/* Search Suggestions */}
              {isSearchFocused && searchQuery && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-xl overflow-hidden animate-scale-in">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion}
                      className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="cart" size="default" className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden lg:block">Cart</span>
                {cartCount > 0 && (
                  <span className="min-w-[1.5rem] h-6 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card/80 backdrop-blur-sm">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg animate-fade-in-up">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Button variant="ghost" className="justify-start gap-3">
              <User className="w-5 h-5" />
              Login
            </Button>
            <Button variant="ghost" className="justify-start gap-3">
              <Heart className="w-5 h-5" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {wishlistCount}
                </span>
              )}
            </Button>
            <Button variant="primary" className="justify-start gap-3 mt-2">
              <ShoppingCart className="w-5 h-5" />
              View Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-primary-foreground text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
