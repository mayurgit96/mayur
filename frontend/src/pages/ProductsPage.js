import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, Filter, X, ArrowRight } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryOptions = [
  { id: "cutting-wheels", name: "Cutting Wheels" },
  { id: "grinding-wheels", name: "Grinding Wheels" },
  { id: "flap-discs", name: "Flap Discs" },
  { id: "saw-blades", name: "Saw Blades" },
  { id: "non-woven-wheels", name: "Non-Woven Wheels" },
  { id: "buffing-polishing", name: "Buffing & Polishing" }
];

const sizeOptions = ["4\"", "5\"", "6\"", "7\"", "10\"", "12\"", "14\""];
const gritOptions = ["40", "60", "80", "100", "120", "Fine", "Ultra Fine"];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    size: searchParams.get("size") || "",
    grit: searchParams.get("grit") || "",
    search: searchParams.get("search") || ""
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.size) params.append("size", filters.size);
      if (filters.grit) params.append("grit", filters.grit);
      if (filters.search) params.append("search", filters.search);
      params.append("is_active", "true");

      const { data } = await axios.get(`${API}/products?${params.toString()}`);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: "", size: "", grit: "", search: "" });
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div data-testid="products-page" className="pt-20 min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-12 h-1 bg-[#FF6A00]"></div>
            <p className="font-['Montserrat'] font-bold text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
              Our Products
            </p>
          </div>
          <h1 className="font-['Montserrat'] font-bold text-5xl md:text-6xl uppercase tracking-tight text-[#1A1A1A] mb-6">
            Product Catalog
          </h1>
          <p className="font-['Inter'] text-[#6B7280] text-lg max-w-xl">
            Explore our complete range of premium abrasive products. Quality that powers your work.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-[#F8F9FA] p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A]">
                  Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-[#FF6A00] text-sm hover:text-[#0F3D2E] transition-colors font-['Inter']"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    placeholder="Search products..."
                    data-testid="product-search-input"
                    className="w-full bg-white border border-gray-200 text-[#1A1A1A] pl-10 pr-4 py-3 text-sm focus:border-[#FF6A00] focus:outline-none font-['Inter']"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Category</label>
                <div className="space-y-2">
                  {categoryOptions.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.id}
                        onChange={() => updateFilter("category", filters.category === cat.id ? "" : cat.id)}
                        className="filter-checkbox"
                        data-testid={`filter-category-${cat.id}`}
                      />
                      <span className="text-[#1A1A1A]/80 text-sm group-hover:text-[#FF6A00] transition-colors font-['Inter']">
                        {cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateFilter("size", filters.size === size ? "" : size)}
                      data-testid={`filter-size-${size}`}
                      className={`px-3 py-1 text-sm border transition-colors font-['Inter'] ${
                        filters.size === size
                          ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                          : "border-gray-200 text-[#1A1A1A]/60 hover:border-[#FF6A00] hover:text-[#FF6A00]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grit Filter */}
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Grit</label>
                <div className="flex flex-wrap gap-2">
                  {gritOptions.map((grit) => (
                    <button
                      key={grit}
                      onClick={() => updateFilter("grit", filters.grit === grit ? "" : grit)}
                      data-testid={`filter-grit-${grit}`}
                      className={`px-3 py-1 text-sm border transition-colors font-['Inter'] ${
                        filters.grit === grit
                          ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                          : "border-gray-200 text-[#1A1A1A]/60 hover:border-[#FF6A00] hover:text-[#FF6A00]"
                      }`}
                    >
                      {grit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <p className="text-[#6B7280] text-sm font-['Inter']">
              {products.length} products found
            </p>
            <button
              onClick={() => setFilterOpen(true)}
              data-testid="mobile-filter-btn"
              className="flex items-center gap-2 bg-[#F8F9FA] border border-gray-200 px-4 py-2 text-[#1A1A1A] text-sm font-['Inter']"
            >
              <Filter size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#FF6A00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="loader"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-[#6B7280] text-lg mb-4 font-['Inter']">No products found</p>
                <button
                  onClick={clearFilters}
                  className="text-[#FF6A00] hover:text-[#0F3D2E] transition-colors font-['Montserrat'] font-bold uppercase tracking-wider"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-[#6B7280] text-sm mb-6 hidden lg:block font-['Inter']">
                  {products.length} products found
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      data-testid={`product-card-${product.id}`}
                      className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#FF6A00] transition-all group"
                    >
                      <div className="h-48 overflow-hidden relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[#6B7280] font-['Inter']">
                            No Image
                          </div>
                        )}
                        <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6A00] transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[#FF6A00] text-xs uppercase tracking-wider font-['Montserrat'] font-semibold">
                            {product.category.replace(/-/g, " ")}
                          </span>
                          {product.size && (
                            <span className="text-[#6B7280] text-xs font-['Inter']">• {product.size}</span>
                          )}
                        </div>
                        <h3 className="font-['Montserrat'] font-bold text-lg uppercase text-[#1A1A1A] mb-2">
                          {product.name}
                        </h3>
                        <p className="text-[#6B7280] text-sm line-clamp-2 mb-4 font-['Inter']">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 text-[#FF6A00] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="font-['Montserrat'] font-bold text-sm uppercase tracking-wider">
                            View Details
                          </span>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setFilterOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-['Montserrat'] font-bold text-xl uppercase text-[#1A1A1A]">
                Filters
              </h3>
              <button onClick={() => setFilterOpen(false)} className="text-[#1A1A1A]">
                <X size={24} />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search products..."
                className="w-full bg-[#F8F9FA] border border-gray-200 text-[#1A1A1A] px-4 py-3 text-sm focus:border-[#FF6A00] focus:outline-none font-['Inter']"
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Category</label>
              <div className="space-y-2">
                {categoryOptions.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="m-category"
                      checked={filters.category === cat.id}
                      onChange={() => updateFilter("category", filters.category === cat.id ? "" : cat.id)}
                      className="filter-checkbox"
                    />
                    <span className="text-[#1A1A1A]/80 text-sm font-['Inter']">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFilter("size", filters.size === size ? "" : size)}
                    className={`px-3 py-1 text-sm border font-['Inter'] ${
                      filters.size === size
                        ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                        : "border-gray-200 text-[#1A1A1A]/60"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Grit */}
            <div className="mb-8">
              <label className="text-[#6B7280] text-sm mb-2 block font-['Inter']">Grit</label>
              <div className="flex flex-wrap gap-2">
                {gritOptions.map((grit) => (
                  <button
                    key={grit}
                    onClick={() => updateFilter("grit", filters.grit === grit ? "" : grit)}
                    className={`px-3 py-1 text-sm border font-['Inter'] ${
                      filters.grit === grit
                        ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                        : "border-gray-200 text-[#1A1A1A]/60"
                    }`}
                  >
                    {grit}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearFilters}
                className="flex-1 border border-gray-200 text-[#1A1A1A] py-3 font-['Montserrat'] font-bold uppercase tracking-wider text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 bg-[#FF6A00] text-white py-3 font-['Montserrat'] font-bold uppercase tracking-wider text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
