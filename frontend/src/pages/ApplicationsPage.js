import { Link } from "react-router-dom";
import { ArrowRight, HardHat, Factory, Car, Wrench, Cog, Zap } from "lucide-react";

const applications = [
  {
    icon: Factory,
    title: "Metal Fabrication",
    desc: "Cutting, grinding, and finishing metal components with precision. Our abrasives ensure clean cuts and smooth finishes.",
    image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
    products: ["Cutting Wheels", "Grinding Wheels", "Flap Discs"]
  },
  {
    icon: HardHat,
    title: "Construction",
    desc: "Heavy-duty cutting and grinding for construction projects. Diamond blades for concrete, marble, and granite.",
    image: "https://images.pexels.com/photos/13296066/pexels-photo-13296066.jpeg",
    products: ["Diamond Blades", "Cutting Wheels", "Grinding Wheels"]
  },
  {
    icon: Car,
    title: "Automotive",
    desc: "Body work, paint prep, and metal finishing for automotive applications. Achieve professional results every time.",
    image: "https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg",
    products: ["Flap Discs", "Non-Woven Wheels", "Buffing Products"]
  },
  {
    icon: Wrench,
    title: "Metal Works",
    desc: "Weld grinding, deburring, and surface preparation for metalworking shops. Reliable performance under pressure.",
    image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    products: ["Grinding Wheels", "Flap Discs", "Cut-off Wheels"]
  },
  {
    icon: Cog,
    title: "Manufacturing",
    desc: "Precision cutting and finishing for manufacturing processes. Consistent quality for production environments.",
    image: "https://images.pexels.com/photos/34718930/pexels-photo-34718930.jpeg",
    products: ["TCT Saw Blades", "Cutting Wheels", "Grinding Wheels"]
  },
  {
    icon: Zap,
    title: "Maintenance & Repair",
    desc: "Quick repairs and maintenance work. Versatile abrasives for various materials and applications.",
    image: "https://images.pexels.com/photos/1205434/pexels-photo-1205434.jpeg",
    products: ["Cutting Wheels", "Grinding Wheels", "Non-Woven Wheels"]
  }
];

export default function ApplicationsPage() {
  return (
    <div data-testid="applications-page" className="pt-20 min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                Applications
              </p>
            </div>
            <h1 className="font-['Montserrat'] font-bold text-5xl md:text-6xl uppercase tracking-tight text-[#1A1A1A] mb-6">
              Industrial<br />Applications
            </h1>
            <p className="font-['Inter'] text-[#6B7280] text-lg">
              Discover how Mayur abrasives power various industries. 
              From metal fabrication to construction, we have the right solution for every application.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-24">
            {applications.map((app, idx) => {
              const Icon = app.icon;
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  data-testid={`application-${idx}`}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${isEven ? "" : "lg:flex-row-reverse"}`}
                >
                  <div className={`${isEven ? "" : "lg:order-2"}`}>
                    <div className="relative">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="w-full h-[400px] object-cover"
                      />
                      <div className="absolute top-6 left-6 w-16 h-16 bg-[#FF6A00] flex items-center justify-center">
                        <Icon size={32} className="text-white" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#0F3D2E]"></div>
                    </div>
                  </div>
                  <div className={`${isEven ? "" : "lg:order-1"}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-12 h-1 bg-[#FF6A00]"></div>
                      <span className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                        Industry
                      </span>
                    </div>
                    <h2 className="font-['Montserrat'] font-bold text-4xl uppercase tracking-tight text-[#1A1A1A] mb-4">
                      {app.title}
                    </h2>
                    <p className="font-['Inter'] text-[#6B7280] leading-relaxed mb-6 text-lg">
                      {app.desc}
                    </p>
                    <div className="mb-8">
                      <p className="text-[#6B7280] text-sm uppercase tracking-wider mb-3 font-['Montserrat'] font-semibold">Recommended Products:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.products.map((product, pIdx) => (
                          <span
                            key={pIdx}
                            className="bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] px-4 py-2 text-sm font-['Inter']"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest hover:text-[#0F3D2E] transition-colors"
                    >
                      View Products <ArrowRight size={16} />
                    </Link>
                  </div>
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
            Need Help Choosing?
          </h2>
          <p className="font-['Inter'] text-white/80 text-lg max-w-2xl mx-auto mb-10">
            Our experts can help you find the right abrasive products for your specific application. 
            Contact us for personalized recommendations.
          </p>
          <Link
            to="/contact"
            data-testid="applications-contact-btn"
            className="inline-block bg-white text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
