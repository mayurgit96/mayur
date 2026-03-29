import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Download, MessageCircle, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getWhatsAppLink } = useSettings();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/products/${id}`);
      setProduct(data);
      
      // Fetch related products
      const relatedRes = await axios.get(`${API}/products?category=${data.category}&is_active=true`);
      setRelatedProducts(relatedRes.data.filter(p => p.id !== id).slice(0, 4));
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-[#1A1A1A] flex flex-col items-center justify-center">
        <p className="text-white text-xl mb-4">Product not found</p>
        <Link to="/products" className="text-[#FF6A00] hover:text-white transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Hi, I'm interested in ${product.name}. Please share more details.`;

  return (
    <div data-testid="product-detail-page" className="pt-20 min-h-screen bg-[#1A1A1A]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link
          to="/products"
          data-testid="back-to-products"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-['IBM_Plex_Sans'] text-sm">Back to Products</span>
        </Link>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="bg-[#222222] border border-white/5 overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center text-[#6B7280]">
                No Image Available
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00] mb-4">
              {product.category.replace(/-/g, " ")}
            </p>
            <h1 className="font-['Barlow_Condensed'] font-black text-4xl md:text-5xl uppercase tracking-tighter text-white mb-6">
              {product.name}
            </h1>
            <p className="font-['IBM_Plex_Sans'] text-[#6B7280] leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="bg-[#222222] border border-white/5 p-6 mb-8">
              <h3 className="font-['Barlow_Condensed'] font-bold text-lg uppercase text-white mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.size && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Size</p>
                    <p className="text-white font-medium">{product.size}</p>
                  </div>
                )}
                {product.thickness && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Thickness</p>
                    <p className="text-white font-medium">{product.thickness}</p>
                  </div>
                )}
                {product.grit && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Grit</p>
                    <p className="text-white font-medium">{product.grit}</p>
                  </div>
                )}
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[#6B7280] text-sm capitalize">{key.replace(/_/g, " ")}</p>
                    <p className="text-white font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            {product.use_cases && product.use_cases.length > 0 && (
              <div className="mb-8">
                <h3 className="font-['Barlow_Condensed'] font-bold text-lg uppercase text-white mb-4">
                  Use Cases
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.use_cases.map((useCase, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 bg-[#0F3D2E]/30 text-[#0F3D2E] px-3 py-1 text-sm"
                    >
                      <Check size={14} className="text-[#FF6A00]" />
                      <span className="text-white">{useCase}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href={getWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="product-inquiry-btn"
                className="flex-1 min-w-[200px] bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Get Quote
              </a>
              <Link
                to="/catalog"
                data-testid="download-brochure-btn"
                className="flex-1 min-w-[200px] border border-white/30 text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:border-white transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Brochure
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/products/${relProduct.id}`}
                  data-testid={`related-product-${relProduct.id}`}
                  className="product-card p-6"
                >
                  <div className="h-40 mb-4 bg-[#1A1A1A] overflow-hidden">
                    {relProduct.image_url ? (
                      <img
                        src={relProduct.image_url}
                        alt={relProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="text-[#FF6A00] text-xs uppercase tracking-wider mb-1">
                    {relProduct.category.replace(/-/g, " ")}
                  </p>
                  <h3 className="font-['Barlow_Condensed'] font-bold text-base uppercase text-white">
                    {relProduct.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
