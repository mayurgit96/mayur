import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryOptions = [
  { id: "cutting-wheels", name: "Cutting Wheels" },
  { id: "grinding-wheels", name: "Grinding Wheels" },
  { id: "flap-discs", name: "Flap Discs" },
  { id: "saw-blades", name: "Saw Blades" },
  { id: "non-woven-wheels", name: "Non-Woven Wheels" },
  { id: "buffing-polishing", name: "Buffing & Polishing" }
];

const initialFormData = {
  name: "",
  category: "",
  subcategory: "",
  size: "",
  thickness: "",
  grit: "",
  description: "",
  use_cases: [],
  image_url: "",
  specifications: {},
  is_featured: false,
  is_new: false,
  is_active: true
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [useCaseInput, setUseCaseInput] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [search, filter]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filter) params.append("category", filter);
      const { data } = await axios.get(`${API}/products?${params.toString()}`, { withCredentials: true });
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      size: product.size || "",
      thickness: product.thickness || "",
      grit: product.grit || "",
      description: product.description || "",
      use_cases: product.use_cases || [],
      image_url: product.image_url || "",
      specifications: product.specifications || {},
      is_featured: product.is_featured || false,
      is_new: product.is_new || false,
      is_active: product.is_active !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`${API}/products/${editingProduct.id}`, formData, { withCredentials: true });
        toast.success("Product updated successfully!");
      } else {
        await axios.post(`${API}/products`, formData, { withCredentials: true });
        toast.success("Product created successfully!");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${API}/products/${id}`, { withCredentials: true });
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const addUseCase = () => {
    if (useCaseInput.trim()) {
      setFormData({ ...formData, use_cases: [...formData.use_cases, useCaseInput.trim()] });
      setUseCaseInput("");
    }
  };

  const removeUseCase = (idx) => {
    setFormData({ ...formData, use_cases: formData.use_cases.filter((_, i) => i !== idx) });
  };

  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData({ ...formData, specifications: { ...formData.specifications, [specKey.trim()]: specValue.trim() } });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpec = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  return (
    <div data-testid="admin-products">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white lg:hidden">
          Products
        </h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-[#1A1A1A] border border-white/10 text-white pl-10 pr-4 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={openCreateModal}
            data-testid="add-product-btn"
            className="bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider px-4 py-2 flex items-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1A] border border-white/5">
          <p className="text-[#6B7280] mb-4">No products found</p>
          <button
            onClick={openCreateModal}
            className="text-[#FF6A00] hover:text-white transition-colors"
          >
            Add your first product
          </button>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Product</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Category</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Size</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Status</th>
                <th className="text-right text-[#6B7280] text-xs uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#0F0F0F] overflow-hidden flex-shrink-0">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-xs">N/A</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <div className="flex gap-2 mt-0.5">
                          {product.is_featured && (
                            <span className="text-[#FF6A00] text-xs uppercase tracking-wider">Featured</span>
                          )}
                          {product.is_new && (
                            <span className="text-green-400 text-xs uppercase tracking-wider">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#6B7280] text-sm capitalize">{product.category.replace(/-/g, " ")}</td>
                  <td className="p-4 text-[#6B7280] text-sm">{product.size || "-"}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${
                      product.is_active ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                    }`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-2 text-[#6B7280] hover:text-white transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-[#6B7280] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white">
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Size</label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder='e.g., 4"'
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Thickness</label>
                <input
                  type="text"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                  placeholder="e.g., 1.2mm"
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Grit</label>
                <input
                  type="text"
                  value={formData.grit}
                  onChange={(e) => setFormData({ ...formData, grit: e.target.value })}
                  placeholder="e.g., 80"
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
              />
            </div>

            {/* Use Cases */}
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Use Cases</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={useCaseInput}
                  onChange={(e) => setUseCaseInput(e.target.value)}
                  placeholder="Add use case"
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUseCase())}
                />
                <button type="button" onClick={addUseCase} className="bg-[#FF6A00] text-white px-4 py-2">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.use_cases.map((uc, idx) => (
                  <span key={idx} className="bg-[#0F0F0F] text-white px-3 py-1 text-sm flex items-center gap-2">
                    {uc}
                    <button type="button" onClick={() => removeUseCase(idx)} className="text-[#6B7280] hover:text-red-500">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Specifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  placeholder="Key"
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  placeholder="Value"
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
                <button type="button" onClick={addSpec} className="bg-[#FF6A00] text-white px-4 py-2">
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between bg-[#0F0F0F] px-3 py-2 text-sm">
                    <span><span className="text-[#6B7280]">{key}:</span> <span className="text-white">{value}</span></span>
                    <button type="button" onClick={() => removeSpec(key)} className="text-[#6B7280] hover:text-red-500">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-6 sm:gap-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  data-testid="product-is-featured-toggle"
                  className="w-5 h-5 accent-[#FF6A00]"
                />
                <span className="text-white text-sm">Featured Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new}
                  onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                  data-testid="product-is-new-toggle"
                  className="w-5 h-5 accent-[#FF6A00]"
                />
                <span className="text-white text-sm">New Product</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 accent-[#FF6A00]"
                />
                <span className="text-white text-sm">Active</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 border border-white/10 text-white py-3 font-bold uppercase tracking-wider text-sm hover:border-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#FF6A00] text-white py-3 font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-[#1A1A1A] transition-colors"
              >
                {editingProduct ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
