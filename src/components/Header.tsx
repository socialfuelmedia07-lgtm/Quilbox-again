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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 min-h-[80px] h-auto md:h-20",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-sm border-b"
            : "bg-background"
        )}
      >
        <div className="container mx-auto h-full px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4 h-full py-1.5 md:py-0">

            {/* Top Row: Logo and Actions */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2 group shrink-0">
                <BrandLogo className="scale-[0.85] md:scale-100 origin-left" />
              </a>

              {/* Mobile Actions: Theme, Login, Cart */}
              <div className="flex md:hidden items-center gap-2">
                <ThemeToggle />

                {isLoggedIn ? (
                  <Button variant="ghost" size="icon" className="h-10 w-10">
                    <LogOut className="w-5 h-5 text-destructive" onClick={logout} />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 relative"
                  onClick={() => toggleCart(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff0000] text-white text-[8px] font-bold border border-white dark:border-slate-900">
                      {cartCount}
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Search Bar - Desktop & Mobile (Centered) */}
            <div className="flex-1 w-full max-w-xl items-center relative gap-3 md:mx-4">
              <div
                className={cn(
                  "flex-1 relative transition-all duration-300",
                  isSearchFocused && "transform scale-[1.01]"
                )}
              >
                <form
                  onSubmit={handleSearchSubmit}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 bg-muted/30",
                    "border-black/5 dark:border-white/10", // Visible thin border in light mode
                    isSearchFocused
                      ? "border-primary bg-background shadow-lg shadow-primary/10"
                      : "hover:border-input"
                  )}
                >
                  <Search className={cn("w-4 h-4 md:w-5 md:h-5", isSearchFocused ? "text-primary" : "text-muted-foreground")} />
                  <input
                    type="text"
                    placeholder="Search for pens, notebooks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground text-xs md:text-sm text-foreground"
                  />
                </form>
              </div>
            </div>

            {/* Desktop Actions (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />

              <div className="flex items-center gap-3 ml-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2 text-foreground group relative">
                    <Button variant="ghost" className="gap-2 font-medium">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.firstName?.charAt(0)}
                      </div>
                      <span className="hidden lg:block">{user?.firstName}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:rotate-180 transition-transform" />
                    </Button>

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
                  className="gap-2 bg-[#ff0000] hover:bg-[#e60000] text-white px-4 md:px-6 rounded-full shadow-lg shadow-rose/20 relative h-10 md:h-12"
                  onClick={() => toggleCart(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden sm:block font-bold">My Cart</span>
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#ff0000] text-white text-[10px] font-bold shadow-sm border-2 border-white dark:border-slate-900">
                      {cartCount}
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
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
