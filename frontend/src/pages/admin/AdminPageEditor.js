import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader, Eye, EyeOff, Upload, X, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPageEditor() {
  const { pageKey } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const fileRefs = useRef({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/pages/${pageKey}`);
        setPage(data);
      } catch (error) {
        toast.error("Failed to load page");
      } finally {
        setLoading(false);
      }
    })();
  }, [pageKey]);

  const handleSave = async () => {
    if (!page) return;
    setSaving(true);
    try {
      await axios.put(
        `${API}/pages/${pageKey}`,
        {
          title: page.title,
          enabled: page.enabled,
          sections: page.sections,
          content_html: page.content_html,
          seo: page.seo,
          meta: page.meta
        },
        { withCredentials: true }
      );
      toast.success("Page saved!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to save page");
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (idx, patch) => {
    const sections = [...page.sections];
    sections[idx] = { ...sections[idx], ...patch };
    setPage({ ...page, sections });
  };

  const updateSectionMeta = (idx, metaPatch) => {
    const sections = [...page.sections];
    sections[idx] = { ...sections[idx], meta: { ...(sections[idx].meta || {}), ...metaPatch } };
    setPage({ ...page, sections });
  };

  const updateMeta = (patch) => {
    setPage({ ...page, meta: { ...(page.meta || {}), ...patch } });
  };

  const updateSeo = (patch) => {
    setPage({ ...page, seo: { ...(page.seo || {}), ...patch } });
  };

  const uploadImage = async (file, onUrl, key) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      onUrl(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="loader"></div>
      </div>
    );
  }
  if (!page) return null;

  return (
    <div data-testid="admin-page-editor" className="pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/pages"
            className="text-[#6B7280] hover:text-white transition-colors"
            aria-label="Back to pages"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white">
              {page.title}
            </h1>
            <p className="text-[#6B7280] text-xs font-mono">/{page.key}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
            <input
              type="checkbox"
              checked={page.enabled}
              onChange={(e) => setPage({ ...page, enabled: e.target.checked })}
              data-testid="page-enabled-toggle"
              className="w-4 h-4 accent-[#FF6A00]"
            />
            {page.enabled ? "Enabled" : "Disabled"}
          </label>
          <button
            onClick={handleSave}
            disabled={saving}
            data-testid="save-page-btn"
            className="bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider px-5 py-2.5 flex items-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Page title */}
        <Card title="Page Settings">
          <Field label="Page Title">
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              data-testid="page-title-input"
              className="cms-input"
            />
          </Field>
        </Card>

        {/* Sections */}
        {page.sections && page.sections.length > 0 && (
          <Card title="Sections">
            <div className="space-y-5">
              {page.sections.map((section, idx) => (
                <SectionEditor
                  key={`${section.key}-${idx}`}
                  idx={idx}
                  section={section}
                  pageKey={page.key}
                  fileRefs={fileRefs}
                  uploadingKey={uploadingKey}
                  uploadImage={uploadImage}
                  onChange={(patch) => updateSection(idx, patch)}
                  onMetaChange={(metaPatch) => updateSectionMeta(idx, metaPatch)}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Long-form content (Privacy, Terms, About) */}
        {(page.key === "privacy" || page.key === "terms" || page.key === "about") && (
          <Card title="Content">
            <RichTextEditor
              value={page.content_html}
              onChange={(html) => setPage({ ...page, content_html: html })}
              placeholder="Write the page content..."
              testId="page-content-editor"
            />
          </Card>
        )}

        {/* Footer-specific meta */}
        {page.key === "footer" && <FooterMetaEditor page={page} updateMeta={updateMeta} />}

        {/* SEO */}
        {page.key !== "footer" && (
          <Card title="SEO" testId="seo-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Meta Title">
                <input
                  type="text"
                  value={page.seo?.meta_title || ""}
                  onChange={(e) => updateSeo({ meta_title: e.target.value })}
                  data-testid="seo-meta-title"
                  placeholder="Page title for search engines"
                  className="cms-input"
                />
              </Field>
              <Field label="Keywords">
                <input
                  type="text"
                  value={page.seo?.keywords || ""}
                  onChange={(e) => updateSeo({ keywords: e.target.value })}
                  data-testid="seo-keywords"
                  placeholder="comma, separated, keywords"
                  className="cms-input"
                />
              </Field>
              <Field label="Meta Description" className="md:col-span-2">
                <textarea
                  value={page.seo?.meta_description || ""}
                  onChange={(e) => updateSeo({ meta_description: e.target.value })}
                  data-testid="seo-meta-description"
                  rows={3}
                  placeholder="Short description (~150-160 chars)"
                  className="cms-input resize-none"
                />
              </Field>
              <Field label="OG Image URL" className="md:col-span-2">
                <input
                  type="text"
                  value={page.seo?.og_image || ""}
                  onChange={(e) => updateSeo({ og_image: e.target.value })}
                  data-testid="seo-og-image"
                  placeholder="https://... (image shown when shared)"
                  className="cms-input"
                />
              </Field>
            </div>
          </Card>
        )}
      </div>

      {/* Floating save bar (mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0F0F0F] border-t border-white/10 p-3 flex items-center gap-3">
        <span className="text-sm text-[#6B7280] flex-1">Unsaved changes are local</span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF6A00] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children, testId }) {
  return (
    <div data-testid={testId} className="bg-[#1A1A1A] border border-white/5 p-5 sm:p-6">
      <h2 className="font-['Barlow_Condensed'] font-bold text-lg uppercase text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="text-[#6B7280] text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function ImagePickerField({ label, value, onChange, placeholder, testIdPrefix, fileRefs, uploadingKey, uploadImage }) {
  const fileKey = `${testIdPrefix}-file`;
  const uploading = uploadingKey === fileKey;
  return (
    <Field label={label}>
      <div className="bg-[#0F0F0F] border border-white/10 p-3 space-y-2">
        <div className="w-full h-24 bg-[#1A1A1A] border border-white/5 flex items-center justify-center overflow-hidden">
          {value ? (
            <img src={value} alt={label} className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={20} className="text-[#3A3A3A]" />
          )}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Paste image URL"}
          data-testid={`${testIdPrefix}-url`}
          className="cms-input text-xs"
        />
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/*"
            ref={(el) => {
              fileRefs.current[fileKey] = el;
            }}
            onChange={(e) => uploadImage(e.target.files?.[0], onChange, fileKey)}
            className="hidden"
            data-testid={`${testIdPrefix}-file`}
          />
          <button
            type="button"
            onClick={() => fileRefs.current[fileKey]?.click()}
            disabled={uploading}
            data-testid={`${testIdPrefix}-upload-btn`}
            className="flex-1 border border-white/10 text-white text-[11px] uppercase tracking-wider py-1.5 flex items-center justify-center gap-1 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader className="animate-spin" size={12} /> : <Upload size={12} />}
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              data-testid={`${testIdPrefix}-clear`}
              className="border border-white/10 text-[#6B7280] hover:text-red-500 px-2 transition-colors"
              aria-label="Clear"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
    </Field>
  );
}

function SectionEditor({ idx, section, pageKey, fileRefs, uploadingKey, uploadImage, onChange, onMetaChange }) {
  const prefix = `section-${idx}`;
  const showImageFields = section.key !== "hero" || pageKey !== "home"; // homepage hero uses settings.slider_slides

  return (
    <div data-testid={`${prefix}-${section.key}`} className="bg-[#0F0F0F] border border-white/10 p-4">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="min-w-0">
          <p className="text-white font-bold text-sm uppercase tracking-wider truncate">
            {section.heading || section.key}
          </p>
          <p className="text-[#6B7280] text-xs font-mono">{section.key}</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-white cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            checked={section.enabled !== false}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            data-testid={`${prefix}-enabled-toggle`}
            className="w-4 h-4 accent-[#FF6A00]"
          />
          {section.enabled !== false ? (
            <span className="flex items-center gap-1 text-green-400">
              <Eye size={12} /> Visible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#6B7280]">
              <EyeOff size={12} /> Hidden
            </span>
          )}
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Heading">
          <input
            type="text"
            value={section.heading || ""}
            onChange={(e) => onChange({ heading: e.target.value })}
            data-testid={`${prefix}-heading`}
            className="cms-input"
          />
        </Field>
        <Field label="Subheading">
          <input
            type="text"
            value={section.subheading || ""}
            onChange={(e) => onChange({ subheading: e.target.value })}
            data-testid={`${prefix}-subheading`}
            className="cms-input"
          />
        </Field>
      </div>

      <Field label="Description" className="mt-4">
        <RichTextEditor
          value={section.description}
          onChange={(html) => onChange({ description: html })}
          placeholder="Section description..."
          testId={`${prefix}-description`}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Field label="Button Text">
          <input
            type="text"
            value={section.button_text || ""}
            onChange={(e) => onChange({ button_text: e.target.value })}
            data-testid={`${prefix}-button-text`}
            className="cms-input"
          />
        </Field>
        <Field label="Button Link">
          <input
            type="text"
            value={section.button_link || ""}
            onChange={(e) => onChange({ button_link: e.target.value })}
            data-testid={`${prefix}-button-link`}
            placeholder="/products or https://..."
            className="cms-input"
          />
        </Field>
      </div>

      {/* About section custom stat fields */}
      {section.key === "about" && pageKey === "home" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <Field label="Stat 1 Value">
            <input
              type="text"
              value={section.meta?.stat1_value || ""}
              onChange={(e) => onMetaChange({ stat1_value: e.target.value })}
              data-testid={`${prefix}-stat1-value`}
              className="cms-input"
            />
          </Field>
          <Field label="Stat 1 Label">
            <input
              type="text"
              value={section.meta?.stat1_label || ""}
              onChange={(e) => onMetaChange({ stat1_label: e.target.value })}
              data-testid={`${prefix}-stat1-label`}
              className="cms-input"
            />
          </Field>
          <Field label="Stat 2 Value">
            <input
              type="text"
              value={section.meta?.stat2_value || ""}
              onChange={(e) => onMetaChange({ stat2_value: e.target.value })}
              className="cms-input"
            />
          </Field>
          <Field label="Stat 2 Label">
            <input
              type="text"
              value={section.meta?.stat2_label || ""}
              onChange={(e) => onMetaChange({ stat2_label: e.target.value })}
              className="cms-input"
            />
          </Field>
        </div>
      )}

      {showImageFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <ImagePickerField
            label="Image"
            value={section.image_url}
            onChange={(url) => onChange({ image_url: url })}
            testIdPrefix={`${prefix}-image`}
            fileRefs={fileRefs}
            uploadingKey={uploadingKey}
            uploadImage={uploadImage}
          />
          <ImagePickerField
            label="Desktop Banner"
            value={section.desktop_banner}
            onChange={(url) => onChange({ desktop_banner: url })}
            testIdPrefix={`${prefix}-desktop`}
            fileRefs={fileRefs}
            uploadingKey={uploadingKey}
            uploadImage={uploadImage}
          />
          <ImagePickerField
            label="Mobile Banner"
            value={section.mobile_banner}
            onChange={(url) => onChange({ mobile_banner: url })}
            testIdPrefix={`${prefix}-mobile`}
            fileRefs={fileRefs}
            uploadingKey={uploadingKey}
            uploadImage={uploadImage}
          />
        </div>
      )}

      {section.key === "hero" && pageKey === "home" && (
        <p className="mt-3 text-xs text-[#6B7280]">
          Tip: the homepage hero slider images (desktop + mobile) are managed in <Link to="/admin/settings" className="text-[#FF6A00] underline">Settings → Hero Image Slider</Link>.
          Use the toggle above to show/hide the slider entirely.
        </p>
      )}
    </div>
  );
}

function FooterMetaEditor({ page, updateMeta }) {
  const meta = page.meta || {};
  const links = meta.quick_links || [];
  const social = meta.social || {};

  const updateLink = (idx, patch) => {
    const next = [...links];
    next[idx] = { ...next[idx], ...patch };
    updateMeta({ quick_links: next });
  };
  const addLink = () => updateMeta({ quick_links: [...links, { label: "New Link", href: "/" }] });
  const removeLink = (idx) => updateMeta({ quick_links: links.filter((_, i) => i !== idx) });

  return (
    <Card title="Footer Content" testId="footer-meta-card">
      <Field label="Company Description">
        <textarea
          value={meta.company_description || ""}
          onChange={(e) => updateMeta({ company_description: e.target.value })}
          data-testid="footer-company-description"
          rows={3}
          className="cms-input resize-none"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Field label="Copyright Text">
          <input
            type="text"
            value={meta.copyright_text || ""}
            onChange={(e) => updateMeta({ copyright_text: e.target.value })}
            data-testid="footer-copyright-text"
            placeholder="© 2026 Mayur Abrasives. All rights reserved."
            className="cms-input"
          />
        </Field>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[#6B7280] text-xs uppercase tracking-wider">Quick Links</label>
          <button
            type="button"
            onClick={addLink}
            data-testid="footer-add-link-btn"
            className="text-[#FF6A00] text-xs uppercase tracking-wider hover:text-white transition-colors flex items-center gap-1"
          >
            <Plus size={12} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {links.length === 0 && (
            <p className="text-[#6B7280] text-xs italic">No quick links yet</p>
          )}
          {links.map((link, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(idx, { label: e.target.value })}
                data-testid={`footer-link-${idx}-label`}
                placeholder="Label"
                className="cms-input flex-1"
              />
              <input
                type="text"
                value={link.href}
                onChange={(e) => updateLink(idx, { href: e.target.value })}
                data-testid={`footer-link-${idx}-href`}
                placeholder="/path"
                className="cms-input flex-1"
              />
              <button
                type="button"
                onClick={() => removeLink(idx)}
                data-testid={`footer-link-${idx}-remove`}
                className="text-[#6B7280] hover:text-red-500 p-2"
                aria-label="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-[#6B7280] text-xs uppercase tracking-wider mb-3 block">Social Media Links</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["facebook", "instagram", "linkedin", "youtube", "twitter", "whatsapp"].map((key) => (
            <Field key={key} label={key}>
              <input
                type="text"
                value={social[key] || ""}
                onChange={(e) => updateMeta({ social: { ...social, [key]: e.target.value } })}
                data-testid={`footer-social-${key}`}
                placeholder={`https://${key}.com/...`}
                className="cms-input"
              />
            </Field>
          ))}
        </div>
      </div>
    </Card>
  );
}
