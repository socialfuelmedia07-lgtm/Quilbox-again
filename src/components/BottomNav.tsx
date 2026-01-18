import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  cartCount?: number;
}

const BottomNav = ({ cartCount = 0 }: BottomNavProps) => {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Search, label: "Search", active: false },
    { icon: ShoppingCart, label: "Cart", active: false, badge: cartCount },
    { icon: User, label: "Account", active: false },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-4 transition-colors",
              item.active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
