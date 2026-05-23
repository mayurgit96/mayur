import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, FolderTree, Tag, Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ImageUploader from "@/components/ImageUploader";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  subcategories: [],
  sort_order: 0
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyCategory);
  const [subInput, setSubInput] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/categories`);
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({ ...emptyCategory, sort_order: categories.length + 1 });
    setSubInput("");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setFormData({
      name: cat.name || "",
      slug: cat.slug || "",
      description: cat.description || "",
      image_url: cat.image_url || "",
      subcategories: (cat.subcategories || []).map((s) => ({ name: s.name, slug: s.slug })),
      sort_order: cat.sort_order || 0
    });
    setSubInput("");
    setModalOpen(true);
  };

  const addSubcategory = () => {
    const name = subInput.trim();
    if (!name) return;
    const slug = slugify(name);
    if (formData.subcategories.some((s) => s.slug === slug)) {
      toast.error("Subcategory already exists");
      return;
    }
    setFormData({
      ...formData,
      subcategories: [...formData.subcategories, { name, slug }]
    });
    setSubInput("");
  };

  const removeSubcategory = (slug) => {
    setFormData({
      ...formData,
      subcategories: formData.subcategories.filter((s) => s.slug !== slug)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug?.trim() || slugify(formData.name),
        description: formData.description || "",
        image_url: formData.image_url || "",
        subcategories: formData.subcategories,
        sort_order: parseInt(formData.sort_order) || 0
      };
      if (editing) {
        await axios.put(`${API}/categories/${editing.id}`, payload, { withCredentials: true });
        toast.success("Category updated!");
      } else {
        await axios.post(`${API}/categories`, payload, { withCredentials: true });
        toast.success("Category created!");
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"? Products will keep their category slug.`)) return;
    try {
      await axios.delete(`${API}/categories/${cat.id}`, { withCredentials: true });
      toast.success("Category deleted");
      fetchCategories();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div data-testid="admin-categories">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white lg:hidden">
          Categories
        </h1>
        <div className="flex-1" />
        <button
          onClick={openCreate}
          data-testid="add-category-btn"
          className="bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider px-4 py-2 flex items-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1A] border border-white/5">
          <FolderTree size={40} className="text-[#6B7280] mx-auto mb-4" />
          <p className="text-[#6B7280] mb-4">No categories yet</p>
          <button
            onClick={openCreate}
            className="text-[#FF6A00] hover:text-white transition-colors"
          >
            Add your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              data-testid={`category-card-${cat.slug}`}
              className="bg-[#1A1A1A] border border-white/5 p-5 hover:border-[#FF6A00]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-12 h-12 object-cover bg-[#0F0F0F] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#0F0F0F] border border-white/5 flex items-center justify-center flex-shrink-0">
                      <FolderTree size={18} className="text-[#FF6A00]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-white font-bold uppercase tracking-wider truncate">{cat.name}</p>
                    <p className="text-[#6B7280] text-xs font-mono truncate">{cat.slug}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(cat)}
                    data-testid={`edit-category-${cat.slug}`}
                    className="p-2 text-[#6B7280] hover:text-white transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    data-testid={`delete-category-${cat.slug}`}
                    className="p-2 text-[#6B7280] hover:text-red-500 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {cat.description && (
                <p className="text-[#6B7280] text-sm mb-3 line-clamp-2">{cat.description}</p>
              )}

              <div className="pt-3 border-t border-white/5">
                <p className="text-[#6B7280] text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag size={12} /> Subcategories ({cat.subcategories?.length || 0})
                </p>
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((s) => (
                      <span
                        key={s.slug}
                        data-testid={`subcat-${cat.slug}-${s.slug}`}
                        className="text-xs bg-[#0F0F0F] border border-white/5 text-white/80 px-2 py-1"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#6B7280] text-xs italic">No subcategories</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white">
              {editing ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setFormData({
                    ...formData,
                    name: newName,
                    // Auto-fill slug only when creating
                    slug: editing ? formData.slug : slugify(newName)
                  });
                }}
                required
                data-testid="category-name-input"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                data-testid="category-slug-input"
                placeholder="auto-generated from name"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none font-mono text-sm"
              />
              <p className="text-[#6B7280] text-xs mt-1">URL-friendly identifier. Used in /products?category=...</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Category Image</label>
                <ImageUploader
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  testId="category-image"
                />
              </div>
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Sort Order</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                  data-testid="category-sort-input"
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                data-testid="category-description-input"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none resize-none"
              />
            </div>

            {/* Subcategories */}
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Subcategories</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={subInput}
                  onChange={(e) => setSubInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSubcategory();
                    }
                  }}
                  placeholder='e.g., "4 inch", "TCT", "Diamond"'
                  data-testid="subcategory-input"
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-2 focus:border-[#FF6A00] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addSubcategory}
                  data-testid="add-subcategory-btn"
                  className="bg-[#FF6A00] text-white px-4 py-2 hover:bg-white hover:text-[#1A1A1A] transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.subcategories.length === 0 ? (
                  <p className="text-[#6B7280] text-xs italic">No subcategories added yet</p>
                ) : (
                  formData.subcategories.map((s) => (
                    <span
                      key={s.slug}
                      data-testid={`form-subcat-${s.slug}`}
                      className="bg-[#0F0F0F] border border-white/10 text-white px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      <span>{s.name}</span>
                      <span className="text-[#6B7280] text-xs font-mono">/{s.slug}</span>
                      <button
                        type="button"
                        onClick={() => removeSubcategory(s.slug)}
                        data-testid={`remove-subcat-${s.slug}`}
                        className="text-[#6B7280] hover:text-red-500"
                        aria-label="Remove"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>
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
                disabled={saving}
                data-testid="save-category-btn"
                className="flex-1 bg-[#FF6A00] text-white py-3 font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-[#1A1A1A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader className="animate-spin" size={16} /> : null}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
