import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer data-testid="footer" className="bg-[#1A1A1A]">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#FF6A00] rounded flex items-center justify-center">
                <span className="font-['Montserrat'] font-bold text-white text-xl">M</span>
              </div>
              <div>
                <span className="font-['Montserrat'] font-bold text-white text-xl">MAYUR</span>
                <span className="text-[#FF6A00] font-['Montserrat'] font-bold text-xl ml-1">ABRASIVES</span>
              </div>
            </div>
            <p className="text-gray-400 font-['Inter'] text-sm leading-relaxed mb-6">
              Premium quality abrasive products trusted by 200+ dealers across India. 
              Cutting wheels, grinding wheels, flap discs, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-[#FF6A00] hover:border-[#FF6A00] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-lg uppercase tracking-wider mb-6">Products</h4>
            <ul className="space-y-3">
              <li><Link to="/products?category=cutting-wheels" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Cutting Wheels</Link></li>
              <li><Link to="/products?category=grinding-wheels" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Grinding Wheels</Link></li>
              <li><Link to="/products?category=flap-discs" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Flap Discs</Link></li>
              <li><Link to="/products?category=saw-blades" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Saw Blades</Link></li>
              <li><Link to="/products?category=non-woven-wheels" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Non-Woven Wheels</Link></li>
              <li><Link to="/products?category=buffing-polishing" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Buffing & Polishing</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-lg uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">About Us</Link></li>
              <li><Link to="/dealer" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Become a Dealer</Link></li>
              <li><Link to="/applications" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Applications</Link></li>
              <li><Link to="/catalog" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Download Catalog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-['Montserrat'] font-bold text-white text-lg uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#FF6A00] mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm font-['Inter']">{settings.company_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a href={`tel:${settings.company_phone}`} className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">{settings.company_phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a href={`mailto:${settings.company_email}`} className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']">{settings.company_email}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm font-['Inter']">
              © {new Date().getFullYear()} Mayur Abrasives. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/admin/login" className="text-gray-500 hover:text-[#FF6A00] text-sm font-['Inter']">Admin Login</Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm font-['Inter']">Privacy Policy</Link>
              <Link to="#" className="text-gray-500 hover:text-white text-sm font-['Inter']">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
