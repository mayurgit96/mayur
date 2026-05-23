import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { 
  ArrowRight, 
  ChevronRight, 
  Shield, 
  Truck, 
  Award, 
  Users,
  Quote,
  Sparkles
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HeroSlider from "@/components/HeroSlider";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const defaultCategories = [
  { id: "cutting-wheels", name: "Cutting Wheels", desc: "Precision metal cutting", image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg" },
  { id: "grinding-wheels", name: "Grinding Wheels", desc: "Heavy-duty grinding", image: "https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg" },
  { id: "flap-discs", name: "Flap Discs", desc: "Blending & finishing", image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg" },
  { id: "saw-blades", name: "Saw Blades", desc: "TCT & Diamond blades", image: "https://images.pexels.com/photos/1205434/pexels-photo-1205434.jpeg" },
  { id: "non-woven-wheels", name: "Non-Woven Wheels", desc: "Surface conditioning", image: "https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg" },
  { id: "buffing-polishing", name: "Buffing & Polishing", desc: "Mirror finish", image: "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg" }
];

const features = [
  { icon: Users, title: "200+ Dealers", desc: "Trusted network across India" },
  { icon: Shield, title: "High Durability", desc: "Built to last longer" },
  { icon: Award, title: "Quality Certified", desc: "ISO standard products" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick supply chain" }
];

const testimonials = [
  { name: "Rajesh Kumar", company: "Steel Fabricators Pvt Ltd", text: "Mayur abrasives have been our go-to choice for over 5 years. Exceptional quality and consistent performance." },
  { name: "Sunil Sharma", company: "Auto Parts Industries", text: "The durability of Mayur cutting wheels is unmatched. We've reduced our tool costs by 30%." },
  { name: "Amit Patel", company: "Construction Corp", text: "Reliable supply chain and great dealer support. Highly recommended for bulk orders." }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [categories, setCategories] = useState(defaultCategories);
  const { settings, getWhatsAppLink } = useSettings();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewProducts();
    fetchCategories();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products?is_featured=true&is_active=true`);
      setFeaturedProducts(data.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    }
  };

  const fetchNewProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products?is_new=true&is_active=true`);
      setNewProducts(data.slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch new products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      if (Array.isArray(data) && data.length > 0) {
        setCategories(
          data.map((c) => ({
            id: c.slug,
            name: c.name,
            desc: c.description || (c.subcategories || []).map((s) => s.name).slice(0, 3).join(" · "),
            image: c.image_url || "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg"
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  return (
    <div data-testid="home-page" className="bg-white">
      {/* Hero Section — pure image slider, no overlay text */}
      <section data-testid="hero-section" className="relative h-[60vh] sm:h-[70vh] lg:h-screen min-h-[320px] sm:min-h-[500px] lg:min-h-[700px]">
        <HeroSlider
          slides={settings.slider_slides}
          images={settings.slider_images}
          interval={settings.slider_interval}
          showOverlay={false}
        />
      </section>

      {/* Brand Introduction - Light */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
                <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FF6A00]">
                  About Mayur
                </p>
              </div>
              <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A] mb-4 sm:mb-6 leading-tight">
                Industrial Strength,<br />Trusted Quality
              </h2>
              <p className="font-['Inter'] text-[#6B7280] leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                Mayur Abrasives is a leading manufacturer and supplier of premium quality abrasive products. 
                With our brands <strong className="text-[#1A1A1A]">Mayur Plus</strong> and <strong className="text-[#1A1A1A]">Mayur Pro</strong>, 
                we cater to diverse industrial needs from metal fabrication to construction.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-6 sm:mb-8">
                <div className="border-l-4 border-[#FF6A00] pl-3 sm:pl-4">
                  <p className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl text-[#FF6A00]">200+</p>
                  <p className="text-[#6B7280] text-xs sm:text-sm uppercase tracking-wider font-['Inter'] mt-1">Dealers Nationwide</p>
                </div>
                <div className="border-l-4 border-[#0F3D2E] pl-3 sm:pl-4">
                  <p className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl text-[#0F3D2E]">15+</p>
                  <p className="text-[#6B7280] text-xs sm:text-sm uppercase tracking-wider font-['Inter'] mt-1">Years Experience</p>
                </div>
              </div>
              <Link
                to="/about"
                data-testid="about-learn-more-btn"
                className="inline-flex items-center gap-2 text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest hover:text-[#0F3D2E] transition-colors"
              >
                Learn More <ChevronRight size={18} />
              </Link>
            </div>
            <div className="relative mt-8 md:mt-0">
              <img
                src="https://images.pexels.com/photos/34718930/pexels-photo-34718930.jpeg"
                alt="Manufacturing facility"
                className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-[#FF6A00] p-4 sm:p-8 flex flex-col items-center justify-center">
                <p className="font-['Montserrat'] font-bold text-2xl sm:text-4xl text-white">ISO</p>
                <p className="text-white/80 text-xs sm:text-sm font-['Inter']">Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products - Gray Background */}
      {newProducts.length > 0 && (
        <section data-testid="new-products-section" className="py-16 sm:py-24 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
                  <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FF6A00]">
                    Just Launched
                  </p>
                </div>
                <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
                  New Products
                </h2>
              </div>
              <Link
                to="/products"
                data-testid="new-products-view-all"
                className="flex items-center gap-2 text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest hover:text-[#0F3D2E] transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  data-testid={`new-product-${product.id}`}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF6A00] transition-all group relative"
                >
                  <span className="absolute top-3 left-3 z-10 bg-[#FF6A00] text-white text-[10px] sm:text-xs font-['Montserrat'] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                    <Sparkles size={12} /> New
                  </span>
                  <div className="h-40 sm:h-48 overflow-hidden relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#6B7280]">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-[#FF6A00] text-xs uppercase tracking-wider font-['Montserrat'] font-semibold mb-2">
                      {product.category.replace(/-/g, " ")}
                    </p>
                    <h3 className="font-['Montserrat'] font-bold text-base sm:text-lg uppercase text-[#1A1A1A] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm font-['Inter'] line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products - White */}
      {featuredProducts.length > 0 && (
        <section data-testid="featured-products-section" className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
                  <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FF6A00]">
                    Featured
                  </p>
                </div>
                <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
                  Featured Products
                </h2>
              </div>
              <Link
                to="/products"
                data-testid="featured-products-view-all"
                className="flex items-center gap-2 text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest hover:text-[#0F3D2E] transition-colors"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  data-testid={`featured-product-${product.id}`}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF6A00] transition-all group"
                >
                  <div className="h-40 sm:h-48 overflow-hidden relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#6B7280]">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-[#FF6A00] text-xs uppercase tracking-wider font-['Montserrat'] font-semibold mb-2">
                      {product.category.replace(/-/g, " ")}
                    </p>
                    <h3 className="font-['Montserrat'] font-bold text-base sm:text-lg uppercase text-[#1A1A1A] mb-2">
                      {product.name}
                    </h3>
                    <p className="text-[#6B7280] text-xs sm:text-sm font-['Inter'] line-clamp-2">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Categories - Gray Background */}
      <section data-testid="categories-section" className="py-16 sm:py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FF6A00]">
                Our Products
              </p>
              <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
              Product Categories
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                data-testid={`category-${cat.id}`}
                className="group relative h-56 sm:h-72 overflow-hidden bg-white shadow-lg"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="font-['Montserrat'] font-bold text-xl sm:text-2xl uppercase text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm font-['Inter']">{cat.desc}</p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[#FF6A00] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-wider">View Products</span>
                    <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Orange Section */}
      <section className="py-16 sm:py-24 bg-[#FF6A00]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/80 mb-4">
              Why Mayur
            </p>
            <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white">
              Why Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  data-testid={`feature-${idx}`}
                  className="text-center p-4 sm:p-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <Icon size={24} className="sm:w-8 sm:h-8 text-[#FF6A00]" />
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-sm sm:text-xl uppercase text-white mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-['Inter'] hidden sm:block">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - White */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-10 sm:mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#FF6A00]">
                Testimonials
              </p>
              <div className="w-8 sm:w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
              What Our Partners Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                data-testid={`testimonial-${idx}`}
                className="bg-[#F8F9FA] p-6 sm:p-8 border-t-4 border-[#FF6A00] hover:shadow-lg transition-shadow"
              >
                <Quote size={24} className="sm:w-8 sm:h-8 text-[#FF6A00] mb-4 sm:mb-6" />
                <p className="text-[#1A1A1A] leading-relaxed mb-4 sm:mb-6 font-['Inter'] text-sm sm:text-base">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6A00] rounded-full flex items-center justify-center">
                    <span className="text-white font-['Montserrat'] font-bold text-sm sm:text-base">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-['Montserrat'] font-bold text-sm sm:text-base text-[#1A1A1A] uppercase">{testimonial.name}</p>
                    <p className="text-[#6B7280] text-xs sm:text-sm font-['Inter']">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner - Green */}
      <section data-testid="cta-banner" className="py-16 sm:py-24 bg-[#0F3D2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight text-white mb-4 sm:mb-6">
            Join Our Dealer Network
          </h2>
          <p className="font-['Inter'] text-white/70 text-base sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10">
            Partner with Mayur Abrasives and grow your business with premium quality products, 
            competitive pricing, and excellent support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              to="/dealer"
              data-testid="cta-become-dealer-btn"
              className="bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 sm:px-8 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors"
            >
              Become a Dealer
            </Link>
            <a
              href={getWhatsAppLink("Hi, I'm interested in becoming a dealer.")}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="cta-whatsapp-btn"
              className="border-2 border-white text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 sm:px-8 py-4 hover:bg-white hover:text-[#0F3D2E] transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
