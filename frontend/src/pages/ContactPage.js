import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactPage() {
  const { settings, getWhatsAppLink } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    message: "",
    inquiry_type: "contact"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/inquiries`, formData);
      setSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div data-testid="contact-page" className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Contact Us
              </p>
            </div>
            <h1 className="font-['Montserrat'] font-bold text-5xl md:text-6xl uppercase tracking-tight text-[#1A1A1A] mb-6">
              Get In Touch
            </h1>
            <p className="font-['Inter'] text-[#6B7280] text-lg">
              Have questions about our products? Need a quote? 
              We're here to help. Reach out to us and we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <h2 className="font-['Montserrat'] font-bold text-3xl uppercase text-[#1A1A1A] mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4 p-6 bg-[#F8F9FA] border-l-4 border-[#FF6A00]">
                  <div className="w-12 h-12 bg-[#FF6A00] flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-1">
                      Address
                    </h3>
                    <p className="text-[#6B7280] font-['Inter']">{settings.company_address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#F8F9FA] border-l-4 border-[#FF6A00]">
                  <div className="w-12 h-12 bg-[#FF6A00] flex items-center justify-center flex-shrink-0">
                    <Phone size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-1">
                      Phone
                    </h3>
                    <a href={`tel:${settings.company_phone}`} className="text-[#6B7280] hover:text-[#FF6A00] transition-colors font-['Inter']">
                      {settings.company_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#F8F9FA] border-l-4 border-[#FF6A00]">
                  <div className="w-12 h-12 bg-[#FF6A00] flex items-center justify-center flex-shrink-0">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-1">
                      Email
                    </h3>
                    <a href={`mailto:${settings.company_email}`} className="text-[#6B7280] hover:text-[#FF6A00] transition-colors font-['Inter']">
                      {settings.company_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-[#F8F9FA] border-l-4 border-[#FF6A00]">
                  <div className="w-12 h-12 bg-[#FF6A00] flex items-center justify-center flex-shrink-0">
                    <Clock size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-1">
                      Business Hours
                    </h3>
                    <p className="text-[#6B7280] font-['Inter']">Monday - Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-[#6B7280] font-['Inter']">Sunday: Closed</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={getWhatsAppLink("Hi, I have a question about Mayur Abrasives products.")}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="contact-whatsapp-btn"
                className="inline-flex items-center gap-3 bg-[#25D366] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>

              {/* Map */}
              <div className="mt-12">
                <h3 className="font-['Montserrat'] font-bold text-xl uppercase text-[#1A1A1A] mb-4">
                  Our Location
                </h3>
                <div className="h-64 bg-[#F8F9FA] overflow-hidden">
                  <iframe
                    src={settings.google_maps_embed || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.758977432432!2d75.78745297640383!3d26.91243777665686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db50c6c2e5a7d%3A0x8b7c0c6c6c6c6c6c!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mayur Abrasives Location"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-['Montserrat'] font-bold text-3xl uppercase text-[#1A1A1A] mb-8">
                Send a Message
              </h2>

              {submitted ? (
                <div data-testid="contact-form-success" className="bg-[#0F3D2E] p-12 text-center">
                  <div className="w-16 h-16 bg-[#FF6A00] rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Send size={32} className="text-white" />
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-2xl uppercase text-white mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-white/70 mb-6 font-['Inter']">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", company: "", message: "", inquiry_type: "contact" });
                    }}
                    className="text-[#FF6A00] hover:text-white transition-colors font-['Montserrat'] font-bold uppercase tracking-wider text-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  data-testid="contact-form"
                  className="bg-[#F8F9FA] p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        data-testid="contact-name-input"
                        className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        data-testid="contact-phone-input"
                        className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        data-testid="contact-email-input"
                        className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        data-testid="contact-company-input"
                        className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Inquiry Type</label>
                    <select
                      name="inquiry_type"
                      value={formData.inquiry_type}
                      onChange={handleChange}
                      data-testid="contact-inquiry-type-select"
                      className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    >
                      <option value="contact">General Inquiry</option>
                      <option value="quote">Request Quote</option>
                      <option value="support">Product Support</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      data-testid="contact-message-input"
                      className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none resize-none font-['Inter']"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="contact-submit-btn"
                    className="w-full bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-[#0F3D2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? "Sending..." : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
