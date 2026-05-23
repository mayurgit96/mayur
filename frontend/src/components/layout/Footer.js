import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, MessageCircle, Loader } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { usePages } from "@/context/PagesContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SOCIAL_ICONS = {
  facebook: { Icon: Facebook, color: "#1877F2" },
  instagram: { Icon: Instagram, color: "#E1306C" },
  linkedin: { Icon: Linkedin, color: "#0A66C2" },
  youtube: { Icon: Youtube, color: "#FF0000" },
  twitter: { Icon: Twitter, color: "#000000" },
  whatsapp: { Icon: MessageCircle, color: "#25D366" }
};

export default function Footer() {
  const { settings, getWhatsAppLink } = useSettings();
  const { getPage } = usePages();
  const footerPage = getPage("footer");
  const fmeta = footerPage?.meta || {};
  const social = fmeta.social || {};
  const quickLinks = fmeta.quick_links && fmeta.quick_links.length > 0 ? fmeta.quick_links : [
    { label: "Browse Products", href: "/products" },
    { label: "Become a Dealer", href: "/dealer" },
    { label: "Download Catalog", href: "/catalog" }
  ];
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast.error("Please fill in name, phone and message");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/inquiries`, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        message: form.message.trim(),
        inquiry_type: "general"
      });
      toast.success("Thank you! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error("Failed to submit query. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer data-testid="footer" className="bg-[#1A1A1A]">
      {/* Main Footer - 4 columns: Contact info | Map | For Query | Follow Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Contact Info */}
          <div data-testid="footer-contact-info">
            <h4 className="font-['Montserrat'] font-bold text-white text-xl uppercase tracking-wider mb-6">
              Contact info
            </h4>

            <div className="flex items-center gap-3 mb-6">
              {settings.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt="Mayur Abrasives"
                  data-testid="footer-logo-img"
                  className="h-14 w-auto object-contain bg-white p-1.5 rounded"
                />
              ) : (
                <>
                  <div className="w-10 h-10 bg-[#FF6A00] rounded flex items-center justify-center">
                    <span className="font-['Montserrat'] font-bold text-white text-xl">M</span>
                  </div>
                  <div>
                    <span className="font-['Montserrat'] font-bold text-white text-base">MAYUR</span>
                    <span className="text-[#FF6A00] font-['Montserrat'] font-bold text-base ml-1">ABRASIVES</span>
                  </div>
                </>
              )}
            </div>

            {fmeta.company_description && (
              <p data-testid="footer-company-desc" className="text-gray-400 text-sm font-['Inter'] leading-relaxed mb-5">
                {fmeta.company_description}
              </p>
            )}

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#FF6A00] mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400 text-sm font-['Inter'] leading-relaxed">
                  {settings.company_address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a
                  href={`tel:${settings.company_phone}`}
                  className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']"
                >
                  {settings.company_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#FF6A00] flex-shrink-0" size={18} />
                <a
                  href={`mailto:${settings.company_email}`}
                  className="text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter'] break-all"
                >
                  {settings.company_email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Map */}
          <div data-testid="footer-map">
            <h4 className="font-['Montserrat'] font-bold text-white text-xl uppercase tracking-wider mb-6">
              Map
            </h4>
            <div className="w-full h-[280px] border border-white/10 overflow-hidden bg-[#0F0F0F]">
              {settings.google_maps_embed ? (
                <iframe
                  title="Mayur Abrasives Location"
                  src={settings.google_maps_embed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  Map unavailable
                </div>
              )}
            </div>
          </div>

          {/* Column 3: For Query (form) */}
          <div data-testid="footer-query-form">
            <h4 className="font-['Montserrat'] font-bold text-white text-xl uppercase tracking-wider mb-6">
              For Query
            </h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                data-testid="footer-form-name"
                required
                className="w-full bg-white text-[#1A1A1A] placeholder:text-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] rounded-sm"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                data-testid="footer-form-email"
                className="w-full bg-white text-[#1A1A1A] placeholder:text-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] rounded-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                data-testid="footer-form-phone"
                required
                className="w-full bg-white text-[#1A1A1A] placeholder:text-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] rounded-sm"
              />
              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                data-testid="footer-form-message"
                required
                rows={3}
                className="w-full bg-white text-[#1A1A1A] placeholder:text-gray-400 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A00] rounded-sm resize-none"
              />
              <button
                type="submit"
                disabled={submitting}
                data-testid="footer-form-submit"
                className="w-full bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-wider px-6 py-3 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader className="animate-spin" size={16} /> : null}
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>

          {/* Column 4: Follow Us */}
          <div data-testid="footer-follow-us">
            <h4 className="font-['Montserrat'] font-bold text-white text-xl uppercase tracking-wider mb-6">
              Follow Us
            </h4>
            <div className="grid grid-cols-3 gap-3 max-w-[200px]">
              {Object.entries(SOCIAL_ICONS).map(([key, { Icon, color }]) => {
                const cmsUrl = social[key];
                const href = key === "whatsapp"
                  ? (cmsUrl || getWhatsAppLink("Hi, I'd like to know more about Mayur Abrasives."))
                  : (cmsUrl || "#");
                return (
                  <a
                    key={key}
                    href={href}
                    target={cmsUrl || key === "whatsapp" ? "_blank" : undefined}
                    rel={cmsUrl || key === "whatsapp" ? "noopener noreferrer" : undefined}
                    aria-label={key}
                    data-testid={`footer-social-link-${key}`}
                    style={{ "--hover-color": color }}
                    className="aspect-square border border-gray-700 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors hover:border-transparent"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.borderColor = color; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ""; e.currentTarget.style.borderColor = ""; }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>

            <div className="mt-8 space-y-2">
              {quickLinks.map((link, idx) => (
                <Link
                  key={`${link.href}-${idx}`}
                  to={link.href || "#"}
                  data-testid={`footer-quick-link-${idx}`}
                  className="block text-gray-400 hover:text-[#FF6A00] transition-colors text-sm font-['Inter']"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p data-testid="footer-copyright" className="text-gray-500 text-sm font-['Inter']">
              {fmeta.copyright_text || `© ${new Date().getFullYear()} Mayur Abrasives. All rights reserved.`}
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-gray-500 hover:text-white text-sm font-['Inter']">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm font-['Inter']">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
