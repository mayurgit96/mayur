import { Link } from "react-router-dom";
import { Target, Eye, Users, Award, TrendingUp, Shield } from "lucide-react";

const milestones = [
  { year: "2008", title: "Company Founded", desc: "Started manufacturing abrasive products in Jaipur" },
  { year: "2012", title: "100 Dealers", desc: "Expanded dealer network across Rajasthan" },
  { year: "2016", title: "ISO Certification", desc: "Achieved ISO quality certification" },
  { year: "2020", title: "Pan India Presence", desc: "Expanded to 200+ dealers nationwide" },
  { year: "2024", title: "Premium Range", desc: "Launched Mayur Plus and Mayur Pro series" }
];

const values = [
  { icon: Shield, title: "Quality First", desc: "Uncompromising standards in every product" },
  { icon: Users, title: "Customer Focus", desc: "Building lasting partnerships with our dealers" },
  { icon: TrendingUp, title: "Innovation", desc: "Continuous improvement in products and processes" },
  { icon: Award, title: "Excellence", desc: "Striving to exceed industry benchmarks" }
];

export default function AboutPage() {
  return (
    <div data-testid="about-page" className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/34718930/pexels-photo-34718930.jpeg"
            alt="Manufacturing facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-[#1A1A1A]/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
            About Us
          </p>
          <h1 className="font-['Barlow_Condensed'] font-black text-5xl md:text-6xl uppercase tracking-tighter text-white mb-6">
            Crafting Excellence<br />Since 2008
          </h1>
          <p className="font-['IBM_Plex_Sans'] text-[#6B7280] text-lg max-w-xl">
            A legacy of quality, innovation, and trust in abrasive manufacturing.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
                Our Story
              </p>
              <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
                Building Trust Through Quality
              </h2>
              <p className="font-['IBM_Plex_Sans'] text-[#6B7280] leading-relaxed mb-6">
                Mayur Abrasives was founded with a simple vision: to provide Indian industries 
                with world-class abrasive products at competitive prices. What started as a 
                small manufacturing unit in Jaipur has grown into a trusted name with a 
                pan-India presence.
              </p>
              <p className="font-['IBM_Plex_Sans'] text-[#6B7280] leading-relaxed mb-8">
                Today, our products are trusted by thousands of professionals in construction, 
                fabrication, automotive, and metalworking industries. Our brands 
                <strong className="text-white"> Mayur Plus</strong> and 
                <strong className="text-white"> Mayur Pro</strong> represent the pinnacle of 
                quality and performance.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="font-['Barlow_Condensed'] font-black text-5xl text-[#FF6A00]">200+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider">Dealers</p>
                </div>
                <div>
                  <p className="font-['Barlow_Condensed'] font-black text-5xl text-[#FF6A00]">15+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider">Years</p>
                </div>
                <div>
                  <p className="font-['Barlow_Condensed'] font-black text-5xl text-[#FF6A00]">50K+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider">Users</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg"
                alt="Manufacturing"
                className="w-full h-64 object-cover"
              />
              <img
                src="https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg"
                alt="Products"
                className="w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#0F3D2E] p-12">
              <div className="w-16 h-16 bg-[#FF6A00] rounded flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white mb-4">
                Our Mission
              </h3>
              <p className="text-white/80 leading-relaxed">
                To deliver premium quality abrasive products that empower industries to achieve 
                excellence in their craft. We are committed to innovation, reliability, and 
                building lasting partnerships with our dealers and customers.
              </p>
            </div>
            <div className="bg-[#222222] border border-white/5 p-12">
              <div className="w-16 h-16 bg-[#FF6A00] rounded flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white mb-4">
                Our Vision
              </h3>
              <p className="text-white/80 leading-relaxed">
                To become India's most trusted abrasive brand, known for uncompromising quality, 
                innovative products, and exceptional customer support. We aim to set new 
                benchmarks in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
              Our Journey
            </p>
            <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white">
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-white/10 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`bg-[#222222] border border-white/5 p-6 inline-block ${idx % 2 === 0 ? "md:ml-auto" : ""}`}>
                      <p className="font-['Barlow_Condensed'] font-black text-3xl text-[#FF6A00] mb-2">
                        {milestone.year}
                      </p>
                      <h4 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-[#6B7280] text-sm">{milestone.desc}</p>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-[#FF6A00] rounded-full relative z-10 hidden md:block"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
              Our Values
            </p>
            <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="text-center p-8 bg-[#222222] border border-white/5">
                  <div className="w-16 h-16 bg-[#FF6A00]/10 rounded mx-auto mb-6 flex items-center justify-center">
                    <Icon size={32} className="text-[#FF6A00]" />
                  </div>
                  <h3 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0F3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Partner With Us
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Join our growing network of dealers and distributors. Experience the Mayur difference.
          </p>
          <Link
            to="/dealer"
            data-testid="about-cta-btn"
            className="inline-block bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors"
          >
            Become a Dealer
          </Link>
        </div>
      </section>
    </div>
  );
}
