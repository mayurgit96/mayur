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
    <div data-testid="applications-page" className="pt-20 min-h-screen bg-[#1A1A1A]">
      {/* Hero Section */}
      <section className="py-24 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
              Applications
            </p>
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl md:text-6xl uppercase tracking-tighter text-white mb-6">
              Industrial<br />Applications
            </h1>
            <p className="font-['IBM_Plex_Sans'] text-[#6B7280] text-lg">
              Discover how Mayur abrasives power various industries. 
              From metal fabrication to construction, we have the right solution for every application.
            </p>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="py-24 bg-[#1A1A1A]">
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
                    </div>
                  </div>
                  <div className={`${isEven ? "" : "lg:order-1"}`}>
                    <h2 className="font-['Barlow_Condensed'] font-bold text-4xl uppercase tracking-tight text-white mb-4">
                      {app.title}
                    </h2>
                    <p className="font-['IBM_Plex_Sans'] text-[#6B7280] leading-relaxed mb-6">
                      {app.desc}
                    </p>
                    <div className="mb-8">
                      <p className="text-[#6B7280] text-sm uppercase tracking-wider mb-3">Recommended Products:</p>
                      <div className="flex flex-wrap gap-2">
                        {app.products.map((product, pIdx) => (
                          <span
                            key={pIdx}
                            className="bg-[#222222] border border-white/10 text-white px-3 py-1 text-sm"
                          >
                            {product}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 text-[#FF6A00] font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
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
      <section className="py-24 bg-[#0F3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Need Help Choosing?
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Our experts can help you find the right abrasive products for your specific application. 
            Contact us for personalized recommendations.
          </p>
          <Link
            to="/contact"
            data-testid="applications-contact-btn"
            className="inline-block bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
