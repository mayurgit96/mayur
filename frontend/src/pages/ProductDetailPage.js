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
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    fetchProduct();
    setActiveImageIdx(0);
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
      <div className="pt-20 min-h-screen bg-white flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-[#1A1A1A] text-xl mb-4 font-['Montserrat']">Product not found</p>
        <Link to="/products" className="text-[#FF6A00] hover:text-[#0F3D2E] transition-colors font-['Montserrat'] font-bold uppercase tracking-wider">
          Back to Products
        </Link>
      </div>
    );
  }

  const whatsappMessage = `Hi, I'm interested in ${product.name}. Please share more details.`;

  return (
    <div data-testid="product-detail-page" className="pt-20 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6">
        <Link
          to="/products"
          data-testid="back-to-products"
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#FF6A00] transition-colors font-['Inter']"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to Products</span>
        </Link>
      </div>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <ProductGallery product={product} activeIdx={activeImageIdx} onChange={setActiveImageIdx} />

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-1 bg-[#FF6A00]"></div>
              <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
                {product.category.replace(/-/g, " ")}
              </p>
            </div>
            <h1 className="font-['Montserrat'] font-bold text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A] mb-6">
              {product.name}
            </h1>
            <p className="font-['Inter'] text-[#6B7280] leading-relaxed mb-8 text-lg">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="bg-[#F8F9FA] p-6 mb-8 border-l-4 border-[#FF6A00]">
              <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.size && (
                  <div>
                    <p className="text-[#6B7280] text-sm font-['Inter']">Size</p>
                    <p className="text-[#1A1A1A] font-medium font-['Inter']">{product.size}</p>
                  </div>
                )}
                {product.thickness && (
                  <div>
                    <p className="text-[#6B7280] text-sm font-['Inter']">Thickness</p>
                    <p className="text-[#1A1A1A] font-medium font-['Inter']">{product.thickness}</p>
                  </div>
                )}
                {product.grit && (
                  <div>
                    <p className="text-[#6B7280] text-sm font-['Inter']">Grit</p>
                    <p className="text-[#1A1A1A] font-medium font-['Inter']">{product.grit}</p>
                  </div>
                )}
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[#6B7280] text-sm capitalize font-['Inter']">{key.replace(/_/g, " ")}</p>
                    <p className="text-[#1A1A1A] font-medium font-['Inter']">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use Cases */}
            {product.use_cases && product.use_cases.length > 0 && (
              <div className="mb-8">
                <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-4">
                  Use Cases
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.use_cases.map((useCase, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 bg-[#FF6A00]/10 text-[#FF6A00] px-4 py-2 text-sm font-['Inter']"
                    >
                      <Check size={14} />
                      {useCase}
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
                className="flex-1 min-w-[200px] bg-[#FF6A00] text-white font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-[#0F3D2E] transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Get Quote
              </a>
              <Link
                to="/catalog"
                data-testid="download-brochure-btn"
                className="flex-1 min-w-[200px] border-2 border-[#FF6A00] text-[#FF6A00] font-['Montserrat'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-[#FF6A00] hover:text-white transition-colors flex items-center justify-center gap-2"
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
            <h2 className="font-['Montserrat'] font-bold text-3xl uppercase text-[#1A1A1A] mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/products/${relProduct.id}`}
                  data-testid={`related-product-${relProduct.id}`}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF6A00] transition-all group"
                >
                  <div className="h-40 overflow-hidden relative">
                    {relProduct.image_url ? (
                      <img
                        src={relProduct.image_url}
                        alt={relProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#6B7280] text-sm font-['Inter']">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                  </div>
                  <div className="p-4">
                    <p className="text-[#FF6A00] text-xs uppercase tracking-wider font-['Montserrat'] font-semibold mb-1">
                      {relProduct.category.replace(/-/g, " ")}
                    </p>
                    <h3 className="font-['Montserrat'] font-bold text-base uppercase text-[#1A1A1A]">
                      {relProduct.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductGallery({ product, activeIdx, onChange }) {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image_url ? [product.image_url] : []);
  const active = images[activeIdx] || images[0];

  if (images.length === 0) {
    return (
      <div data-testid="product-gallery" className="bg-[#F8F9FA] overflow-hidden">
        <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center text-[#6B7280] font-['Inter']">
          No Image Available
        </div>
      </div>
    );
  }

  return (
    <div data-testid="product-gallery">
      <div className="bg-[#F8F9FA] overflow-hidden mb-3">
        <img
          src={active}
          alt={product.name}
          data-testid="gallery-main-image"
          className="w-full h-[360px] sm:h-[400px] lg:h-[500px] object-cover transition-opacity duration-200"
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" data-testid="gallery-thumbnails">
          {images.map((src, idx) => (
            <button
              key={`${idx}-${src.slice(0, 32)}`}
              type="button"
              onClick={() => onChange(idx)}
              data-testid={`gallery-thumb-${idx}`}
              aria-label={`View image ${idx + 1}`}
              className={`aspect-square overflow-hidden border-2 transition-colors ${
                idx === activeIdx
                  ? "border-[#FF6A00]"
                  : "border-transparent hover:border-[#FF6A00]/40"
              }`}
            >
              <img src={src} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
