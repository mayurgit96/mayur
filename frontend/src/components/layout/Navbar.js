import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Products", path: "/products" },
  { name: "Applications", path: "/applications" },
  { name: "Catalog", path: "/catalog" },
  { name: "Become Dealer", path: "/dealer" },
  { name: "Contact", path: "/contact" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // Check if on homepage for transparent navbar
  const isHomepage = location.pathname === "/";
  const showTransparent = isHomepage && !isScrolled;

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showTransparent 
          ? "bg-transparent" 
          : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" data-testid="logo-link">
            <div className="w-10 h-10 bg-[#FF6A00] rounded flex items-center justify-center">
              <span className="font-['Montserrat'] font-bold text-white text-xl">M</span>
            </div>
            <div>
              <span className={`font-['Montserrat'] font-bold text-xl tracking-tight ${showTransparent ? "text-white" : "text-[#1A1A1A]"}`}>MAYUR</span>
              <span className="text-[#FF6A00] font-['Montserrat'] font-bold text-xl ml-1">ABRASIVES</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                data-testid={`nav-${link.name.toLowerCase().replace(" ", "-")}`}
                className={`nav-link font-['Montserrat'] font-semibold text-sm uppercase tracking-wider transition-colors ${
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
            className="hidden lg:block bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-3 hover:bg-[#0F3D2E] transition-colors"
          >
            Get Quote
          </Link>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-toggle"
            className={`lg:hidden p-2 ${showTransparent ? "text-white" : "text-[#1A1A1A]"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-20 bg-white transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              data-testid={`mobile-nav-${link.name.toLowerCase().replace(" ", "-")}`}
              className={`font-['Montserrat'] font-bold text-2xl uppercase tracking-wider py-3 border-b border-gray-100 ${
                location.pathname === link.path ? "text-[#FF6A00]" : "text-[#1A1A1A]"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/dealer"
            className="mt-4 bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-center uppercase tracking-widest px-6 py-4"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </header>
  );
}
