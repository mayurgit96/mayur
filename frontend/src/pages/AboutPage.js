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
    <div data-testid="about-page" className="pt-20 bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/34718930/pexels-photo-34718930.jpeg"
            alt="Manufacturing facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-1 bg-[#FF6A00]"></div>
            <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
              About Us
            </p>
          </div>
          <h1 className="font-['Montserrat'] font-bold text-5xl md:text-6xl uppercase tracking-tight text-white mb-6">
            Crafting Excellence<br />Since 2008
          </h1>
          <p className="font-['Inter'] text-white/70 text-lg max-w-xl">
            A legacy of quality, innovation, and trust in abrasive manufacturing.
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-1 bg-[#FF6A00]"></div>
                <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                  Our Story
                </p>
              </div>
              <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A] mb-6">
                Building Trust Through Quality
              </h2>
              <p className="font-['Inter'] text-[#6B7280] leading-relaxed mb-6 text-lg">
                Mayur Abrasives was founded with a simple vision: to provide Indian industries 
                with world-class abrasive products at competitive prices. What started as a 
                small manufacturing unit in Jaipur has grown into a trusted name with a 
                pan-India presence.
              </p>
              <p className="font-['Inter'] text-[#6B7280] leading-relaxed mb-8 text-lg">
                Today, our products are trusted by thousands of professionals in construction, 
                fabrication, automotive, and metalworking industries. Our brands 
                <strong className="text-[#1A1A1A]"> Mayur Plus</strong> and 
                <strong className="text-[#1A1A1A]"> Mayur Pro</strong> represent the pinnacle of 
                quality and performance.
              </p>
              <div className="flex gap-12">
                <div className="border-l-4 border-[#FF6A00] pl-4">
                  <p className="font-['Montserrat'] font-bold text-5xl text-[#FF6A00]">200+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider font-['Inter']">Dealers</p>
                </div>
                <div className="border-l-4 border-[#0F3D2E] pl-4">
                  <p className="font-['Montserrat'] font-bold text-5xl text-[#0F3D2E]">15+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider font-['Inter']">Years</p>
                </div>
                <div className="border-l-4 border-[#FF6A00] pl-4">
                  <p className="font-['Montserrat'] font-bold text-5xl text-[#FF6A00]">50K+</p>
                  <p className="text-[#6B7280] text-sm uppercase tracking-wider font-['Inter']">Users</p>
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
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-[#0F3D2E] p-12">
              <div className="w-16 h-16 bg-[#FF6A00] rounded-lg flex items-center justify-center mb-6">
                <Target size={32} className="text-white" />
              </div>
              <h3 className="font-['Montserrat'] font-bold text-3xl uppercase text-white mb-4">
                Our Mission
              </h3>
              <p className="text-white/80 leading-relaxed font-['Inter']">
                To deliver premium quality abrasive products that empower industries to achieve 
                excellence in their craft. We are committed to innovation, reliability, and 
                building lasting partnerships with our dealers and customers.
              </p>
            </div>
            <div className="bg-white p-12 shadow-lg border-t-4 border-[#FF6A00]">
              <div className="w-16 h-16 bg-[#FF6A00] rounded-lg flex items-center justify-center mb-6">
                <Eye size={32} className="text-white" />
              </div>
              <h3 className="font-['Montserrat'] font-bold text-3xl uppercase text-[#1A1A1A] mb-4">
                Our Vision
              </h3>
              <p className="text-[#6B7280] leading-relaxed font-['Inter']">
                To become India's most trusted abrasive brand, known for uncompromising quality, 
                innovative products, and exceptional customer support. We aim to set new 
                benchmarks in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Our Journey
              </p>
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#FF6A00]/20 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className={`bg-white shadow-lg border-t-4 border-[#FF6A00] p-6 inline-block ${idx % 2 === 0 ? "md:ml-auto" : ""}`}>
                      <p className="font-['Montserrat'] font-bold text-3xl text-[#FF6A00] mb-2">
                        {milestone.year}
                      </p>
                      <h4 className="font-['Montserrat'] font-bold text-xl uppercase text-[#1A1A1A] mb-2">
                        {milestone.title}
                      </h4>
                      <p className="text-[#6B7280] text-sm font-['Inter']">{milestone.desc}</p>
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
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Our Values
              </p>
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
            </div>
            <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A]">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="text-center p-8 bg-white shadow-lg border-t-4 border-[#FF6A00]">
                  <div className="w-16 h-16 bg-[#FF6A00] rounded-lg mx-auto mb-6 flex items-center justify-center">
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="font-['Montserrat'] font-bold text-xl uppercase text-[#1A1A1A] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm font-['Inter']">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#FF6A00]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Partner With Us
          </h2>
          <p className="font-['Inter'] text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Join our growing network of dealers and distributors. Experience the Mayur difference.
          </p>
          <Link
            to="/dealer"
            data-testid="about-cta-btn"
            className="inline-block bg-white text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            Become a Dealer
          </Link>
        </div>
      </section>
    </div>
  );
}
