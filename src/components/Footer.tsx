import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center gap-2 w-fit">
              <BrandLogo className="[&_span]:text-background" />
            </a>
            <p className="text-background/70 text-sm leading-relaxed">
              Your one-stop destination for premium stationery. Quality products delivered at blink-speed.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-background/10">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-3">
              {["Writing Essentials", "Office Supplies", "Art & Craft", "School Gear"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-background/70 hover:text-primary transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-background/70 text-sm">
                  123 Stationery St, Mumbai
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-background/70 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-background/70 text-sm">support@quilbox.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/50 text-sm">
            © 2024 QuilBox. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
