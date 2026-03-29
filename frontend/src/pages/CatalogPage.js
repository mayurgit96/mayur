import { useState, useEffect } from "react";
import axios from "axios";
import { Download, FileText, Eye } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Default catalogs (shown when no catalogs in database)
const defaultCatalogs = [
  {
    id: "1",
    name: "Complete Product Catalog 2024",
    category: "All Products",
    preview_image: "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg",
    file_url: "#"
  },
  {
    id: "2",
    name: "Cutting Wheels Collection",
    category: "Cutting Wheels",
    preview_image: "https://images.pexels.com/photos/50691/drill-milling-milling-machine-drilling-50691.jpeg",
    file_url: "#"
  },
  {
    id: "3",
    name: "Grinding Wheels Collection",
    category: "Grinding Wheels",
    preview_image: "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg",
    file_url: "#"
  },
  {
    id: "4",
    name: "Flap Discs & Finishing",
    category: "Flap Discs",
    preview_image: "https://images.pexels.com/photos/13296066/pexels-photo-13296066.jpeg",
    file_url: "#"
  },
  {
    id: "5",
    name: "Saw Blades - TCT & Diamond",
    category: "Saw Blades",
    preview_image: "https://images.pexels.com/photos/1205434/pexels-photo-1205434.jpeg",
    file_url: "#"
  },
  {
    id: "6",
    name: "Buffing & Polishing Guide",
    category: "Buffing & Polishing",
    preview_image: "https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg",
    file_url: "#"
  }
];

export default function CatalogPage() {
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const { data } = await axios.get(`${API}/catalogs`);
      setCatalogs(data.length > 0 ? data : defaultCatalogs);
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
      setCatalogs(defaultCatalogs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="catalog-page" className="pt-20 min-h-screen bg-[#1A1A1A]">
      {/* Hero Section */}
      <section className="py-24 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
              Downloads
            </p>
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl md:text-6xl uppercase tracking-tighter text-white mb-6">
              Product<br />Catalogs
            </h1>
            <p className="font-['IBM_Plex_Sans'] text-[#6B7280] text-lg">
              Download our comprehensive product catalogs featuring detailed specifications, 
              product ranges, and technical information.
            </p>
          </div>
        </div>
      </section>

      {/* Catalogs Grid */}
      <section className="py-24 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {catalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  data-testid={`catalog-card-${catalog.id}`}
                  className="bg-[#222222] border border-white/5 overflow-hidden group hover:border-[#FF6A00]/50 transition-colors"
                >
                  {/* Preview Image */}
                  <div className="relative h-48 overflow-hidden">
                    {catalog.preview_image ? (
                      <img
                        src={catalog.preview_image}
                        alt={catalog.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                        <FileText size={48} className="text-[#6B7280]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222] to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-[#FF6A00] px-3 py-1">
                      <span className="text-white text-xs uppercase tracking-wider">PDF</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-[#FF6A00] text-xs uppercase tracking-wider mb-2">
                      {catalog.category}
                    </p>
                    <h3 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-4">
                      {catalog.name}
                    </h3>
                    
                    <div className="flex gap-3">
                      {catalog.file_url !== "#" ? (
                        <>
                          <a
                            href={catalog.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-wider py-3 hover:bg-white hover:text-[#1A1A1A] transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </a>
                          <a
                            href={catalog.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center px-4 border border-white/10 text-white hover:border-white transition-colors"
                          >
                            <Eye size={18} />
                          </a>
                        </>
                      ) : (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center gap-2 bg-[#6B7280]/50 text-white/50 font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-wider py-3 cursor-not-allowed"
                        >
                          <Download size={16} />
                          Coming Soon
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Request Catalog */}
      <section className="py-24 bg-[#0F3D2E]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-['Barlow_Condensed'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-6">
            Need a Physical Catalog?
          </h2>
          <p className="font-['IBM_Plex_Sans'] text-white/60 text-lg max-w-2xl mx-auto mb-10">
            Request a printed catalog to be delivered to your address. 
            Perfect for reference and sharing with your team.
          </p>
          <a
            href="/contact"
            data-testid="request-catalog-btn"
            className="inline-block bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors"
          >
            Request Catalog
          </a>
        </div>
      </section>
    </div>
  );
}
