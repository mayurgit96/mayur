import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer data-testid="footer" className="bg-[#0F0F0F] border-t border-white/5">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF6A00] rounded flex items-center justify-center">
                <span className="font-['Barlow_Condensed'] font-black text-white text-xl">M</span>
              </div>
              <div>
                <span className="font-['Barlow_Condensed'] font-bold text-white text-xl">MAYUR</span>
                <span className="text-[#FF6A00] font-['Barlow_Condensed'] font-bold text-xl ml-1">ABRASIVES</span>
              </div>
            </div>
            <p className="text-[#6B7280] font-['IBM_Plex_Sans'] text-sm leading-relaxed mb-6">
              Premium quality abrasive products trusted by 200+ dealers across India. 
              Cutting wheels, grinding wheels, flap discs, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/60 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/60 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/60 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded flex items-center justify-center text-white/60 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-['Barlow_Condensed'] font-bold text-white text-lg uppercase tracking-wider mb-6">Products</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=cutting-wheels" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Cutting Wheels</Link></li>
              <li><Link to="/products?category=grinding-wheels" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Grinding Wheels</Link></li>
              <li><Link to="/products?category=flap-discs" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Flap Discs</Link></li>
              <li><Link to="/products?category=saw-blades" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Saw Blades</Link></li>
              <li><Link to="/products?category=non-woven-wheels" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Non-Woven Wheels</Link></li>
              <li><Link to="/products?category=buffing-polishing" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Buffing & Polishing</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Barlow_Condensed'] font-bold text-white text-lg uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">About Us</Link></li>
              <li><Link to="/dealer" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Become a Dealer</Link></li>
              <li><Link to="/applications" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Applications</Link></li>
              <li><Link to="/catalog" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Download Catalog</Link></li>
              <li><Link to="/contact" className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Barlow_Condensed'] font-bold text-white text-lg uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#FF6A00] mt-1 flex-shrink-0" size={18} />
                <span className="text-[#6B7280] text-sm">{settings.company_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a href={`tel:${settings.company_phone}`} className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">{settings.company_phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a href={`mailto:${settings.company_email}`} className="text-[#6B7280] hover:text-[#FF6A00] transition-colors text-sm">{settings.company_email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#6B7280] text-sm">
              © {new Date().getFullYear()} Mayur Abrasives. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/admin/login" className="text-[#6B7280] hover:text-white text-sm">Admin Login</Link>
              <Link to="#" className="text-[#6B7280] hover:text-white text-sm">Privacy Policy</Link>
              <Link to="#" className="text-[#6B7280] hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
