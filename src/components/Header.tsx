import { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import ViewCart from "./cart/ViewCart";

const Header = () => {
  const { cartCount, toggleCart } = useCart();
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
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-white",
          isScrolled
            ? "bg-black/95 backdrop-blur-md py-3 shadow-lg"
            : "bg-black py-4"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 group flex-shrink-0">
              <BrandLogo />
            </a>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl items-center relative gap-3 mx-4">
              <div
                className={cn(
                  "flex-1 relative transition-all duration-300",
                  isSearchFocused && "transform scale-[1.01]"
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300",
                    isSearchFocused
                      ? "border-primary bg-white text-black shadow-lg shadow-primary/10"
                      : "border-gray-800 bg-gray-900/50 backdrop-blur-sm text-white"
                  )}
                >
                  <Search className={cn("w-5 h-5", isSearchFocused ? "text-gray-400" : "text-gray-500")} />
                  <input
                    type="text"
                    placeholder="Search for pens, notebooks, art supplies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className={cn(
                      "flex-1 bg-transparent outline-none placeholder:text-gray-500 text-sm",
                      isSearchFocused ? "text-black" : "text-white"
                    )}
                  />
                </div>

                {/* Search Suggestions */}
                {isSearchFocused && searchQuery && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white text-black rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-scale-in z-50">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* QuilAI Button - Outside Search, Pill Shaped */}
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-4 h-11 shadow-lg shadow-purple-900/20 relative overflow-visible"
              >
                <Sparkles className="w-4 h-4" />
                QuilAI
                <span className="absolute -top-2 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  SOON
                </span>
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3 ml-2">
                <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-white gap-2 font-medium">
                  <User className="w-5 h-5" />
                  Login
                </Button>
                <Button
                  variant="cart"
                  size="default"
                  className="gap-2 bg-primary hover:bg-primary/90 text-white px-6 rounded-full"
                  onClick={() => toggleCart(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden lg:block font-bold">My Cart</span>
                  {cartCount > 0 && (
                    <span className="min-w-[1.5rem] h-6 rounded-full bg-white text-primary text-xs flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <Search className="w-5 h-5 text-white/70" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/60 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 shadow-lg animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Button variant="ghost" className="justify-start gap-3 text-white hover:bg-white/10">
                <User className="w-5 h-5" />
                Login
              </Button>
              <Button
                variant="primary"
                className="justify-start gap-3 mt-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  toggleCart(true);
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                View Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-white text-primary px-2 py-0.5 rounded-full text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* View Cart Sidebar */}
      <ViewCart />
    </>
  );
};

export default Header;
