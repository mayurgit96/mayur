import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Catalog", path: "/catalog" },
  { name: "Become Dealer", path: "/dealer" },
  { name: "Contact", path: "/contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    // Restore body scroll when menu closes
    document.body.style.overflow = 'unset';
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileOpen]);

  // Navbar is always solid white for clean look (logo has white background)
  const showTransparent = false;

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showTransparent 
          ? "bg-transparent" 
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <nav className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3" data-testid="logo-link">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt="Mayur Abrasives"
                data-testid="navbar-logo-img"
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              />
            ) : (
              <>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF6A00] rounded flex items-center justify-center">
                  <span className="font-['Montserrat'] font-bold text-white text-lg sm:text-xl">M</span>
                </div>
                <div className="hidden xs:block">
                  <span className={`font-['Montserrat'] font-bold text-base sm:text-xl tracking-tight ${showTransparent ? "text-white" : "text-[#1A1A1A]"}`}>MAYUR</span>
                  <span className="text-[#FF6A00] font-['Montserrat'] font-bold text-base sm:text-xl ml-1">ABRASIVES</span>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                className={`nav-link font-['Montserrat'] font-semibold text-xs xl:text-sm uppercase tracking-wider transition-colors ${
                  location.pathname === link.path 
                    ? "text-[#FF6A00]" 
                    : showTransparent 
                      ? "text-white/90 hover:text-white" 
                      : "text-[#1A1A1A]/80 hover:text-[#FF6A00]"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            to="/dealer"
            data-testid="nav-cta-button"
            className="hidden lg:block bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-xs xl:text-sm uppercase tracking-widest px-4 xl:px-6 py-2.5 xl:py-3 hover:bg-[#0F3D2E] transition-colors"
          >
            Get Quote
          </Link>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-toggle"
            className={`lg:hidden p-2 -mr-2 ${showTransparent ? "text-white" : "text-[#1A1A1A]"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 bg-white transform transition-transform duration-300 ease-in-out z-40 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`mobile-nav-${link.name.toLowerCase().replace(" ", "-")}`}
                  className={`block font-['Montserrat'] font-bold text-xl uppercase tracking-wider py-4 border-b border-gray-100 ${
                    location.pathname === link.path ? "text-[#FF6A00]" : "text-[#1A1A1A]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <Link
              to="/dealer"
              className="mt-6 block bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-center uppercase tracking-widest px-6 py-4"
            >
              Get Quote
            </Link>
          </div>
          
          {/* Mobile Menu Footer */}
          <div className="px-4 py-6 border-t border-gray-100 bg-[#F8F9FA]">
            <p className="text-[#6B7280] text-sm font-['Inter'] text-center">
              200+ Dealers Across India
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
