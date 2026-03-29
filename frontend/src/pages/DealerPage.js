import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Check, Users, Truck, Award, TrendingUp, MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const benefits = [
  { icon: TrendingUp, title: "High Margins", desc: "Competitive pricing with excellent profit margins" },
  { icon: Truck, title: "Fast Supply", desc: "Quick delivery and efficient supply chain" },
  { icon: Award, title: "Brand Support", desc: "Marketing materials and promotional support" },
  { icon: Users, title: "Dedicated Team", desc: "Personal account manager for support" }
];

const businessTypes = [
  "Hardware Store",
  "Industrial Supplier",
  "Distributor",
  "Retailer",
  "Manufacturer",
  "Contractor",
  "Other"
];

export default function DealerPage() {
  const { getWhatsAppLink } = useSettings();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    business_type: "",
    business_name: "",
    message: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/dealers/apply`, formData);
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div data-testid="dealer-page" className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-[#0F3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-1 bg-[#FF6A00]"></div>
                <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                  Partner With Us
                </p>
              </div>
              <h1 className="font-['Montserrat'] font-bold text-5xl md:text-6xl uppercase tracking-tight text-white mb-6">
                Become a<br />Mayur Dealer
              </h1>
              <p className="font-['Inter'] text-white/70 text-lg mb-8">
                Join our network of 200+ successful dealers across India. 
                Grow your business with premium quality products and excellent support.
              </p>
              <div className="flex items-center gap-8">
                <div className="border-l-4 border-[#FF6A00] pl-4">
                  <p className="font-['Montserrat'] font-bold text-5xl text-[#FF6A00]">200+</p>
                  <p className="text-white/60 text-sm uppercase tracking-wider font-['Inter']">Dealers</p>
                </div>
                <div className="border-l-4 border-white/30 pl-4">
                  <p className="font-['Montserrat'] font-bold text-5xl text-white">15+</p>
                  <p className="text-white/60 text-sm uppercase tracking-wider font-['Inter']">States</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6077554/pexels-photo-6077554.jpeg"
                alt="Business partnership"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF6A00]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Why Partner With Us
              </p>
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
              Dealer Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 text-center shadow-lg border-t-4 border-[#FF6A00] hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-[#FF6A00] rounded-lg mx-auto mb-6 flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-xl uppercase text-[#1A1A1A] mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm font-['Inter']">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Apply Now
              </p>
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A] mb-4">
              Dealer Application
            </h2>
            <p className="text-[#6B7280] font-['Inter']">
              Fill out the form below and our team will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div data-testid="dealer-form-success" className="bg-[#0F3D2E] p-12 text-center">
              <div className="w-20 h-20 bg-[#FF6A00] rounded-full mx-auto mb-6 flex items-center justify-center">
                <Check size={40} className="text-white" />
              </div>
              <h3 className="font-['Montserrat'] font-bold text-3xl uppercase text-white mb-4">
                Application Submitted!
              </h3>
              <p className="text-white/70 mb-8 font-['Inter']">
                Thank you for your interest. Our team will review your application and contact you shortly.
              </p>
              <a
                href={getWhatsAppLink("Hi, I just submitted a dealer application. Looking forward to hearing from you!")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4"
              >
                <MessageCircle size={18} />
                Contact on WhatsApp
              </a>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              data-testid="dealer-application-form"
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
                    data-testid="dealer-name-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    placeholder="Your full name"
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
                    data-testid="dealer-phone-input"
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
                    data-testid="dealer-email-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Business Name</label>
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    data-testid="dealer-business-name-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    placeholder="Your business name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    data-testid="dealer-city-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    placeholder="Your city"
                  />
                </div>
                <div>
                  <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    data-testid="dealer-state-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                    placeholder="Your state"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Business Type *</label>
                <select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  required
                  data-testid="dealer-business-type-select"
                  className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                >
                  <option value="">Select business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="mb-8">
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  data-testid="dealer-message-input"
                  className="w-full bg-white border border-gray-200 text-[#1A1A1A] px-4 py-3 focus:border-[#FF6A00] focus:outline-none resize-none font-['Inter']"
                  placeholder="Tell us about your business..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                data-testid="dealer-submit-btn"
                className="w-full bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-[#0F3D2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
