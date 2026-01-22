import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import ViewCart from "./cart/ViewCart";
import LoginModal from "./LoginModal";

import { allProducts } from "@/data/products";

const Header = () => {
  const { cartCount, toggleCart } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      const uniqueSuggestions = Array.from(
        new Set(
          allProducts
            .filter(
              (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.category.toLowerCase().includes(lowerQuery) ||
                p.brand.toLowerCase().includes(lowerQuery)
            )
            .map((p) => p.name)
        )
      ).slice(0, 5);
      setSuggestions(uniqueSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    setIsSearchFocused(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/80 backdrop-blur-md py-3 shadow-md border-b"
            : "bg-background py-4"
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
                <form
                  onSubmit={handleSearchSubmit}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all duration-300",
                    isSearchFocused
                      ? "border-primary bg-background text-foreground shadow-lg shadow-primary/10"
                      : "border-input bg-muted/50 text-foreground hover:bg-muted/80"
                  )}
                >
                  <Search className={cn("w-5 h-5", isSearchFocused ? "text-primary" : "text-muted-foreground")} />
                  <input
                    type="text"
                    placeholder="Search for pens, notebooks, art supplies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-sm text-foreground"
                  />
                </form>

                {/* Search Suggestions */}
                {isSearchFocused && searchQuery && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white text-black rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-scale-in z-50">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(suggestion)}
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
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3 ml-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 text-foreground group relative">
                    <Button variant="ghost" className="gap-2 font-medium">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.firstName?.charAt(0)}
                      </div>
                      <span className="hidden lg:block">{user?.firstName}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform" />
                    </Button>

                    {/* Logout Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                      <div className="p-3 border-b border-border bg-muted/30">
                        <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-foreground hover:bg-muted gap-2 font-medium"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    <User className="w-5 h-5" />
                    Login
                  </Button>
                )}

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
                className="md:hidden text-foreground hover:bg-muted"
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <div className="mb-4 p-4 rounded-2xl bg-muted/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 border-destructive/20 text-destructive hover:bg-destructive/10"
                    onClick={logout}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="justify-start gap-3 text-foreground hover:bg-muted"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                >
                  <User className="w-5 h-5" />
                  Login
                </Button>
              )}

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

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* View Cart Sidebar */}
      <ViewCart />
    </>
  );
};

export default Header;
