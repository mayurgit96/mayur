import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Save, Loader, Upload, X, Image as ImageIcon, Monitor, Smartphone } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SLIDER_SLOT_COUNT = 5;

const emptySlide = () => ({ desktop: "", mobile: "" });

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSlider, setSavingSlider] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null); // e.g. "0-desktop"
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    google_maps_embed: "",
    logo_url: "",
    slider_slides: Array.from({ length: SLIDER_SLOT_COUNT }, emptySlide),
    slider_interval: 3
  });
  const fileInputRefs = useRef({});
  const logoFileRef = useRef(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/settings`);
      // Pad slides to fixed slot count
      const incoming = Array.isArray(data.slider_slides) ? data.slider_slides : [];
      const slides = Array.from({ length: SLIDER_SLOT_COUNT }, (_, i) => ({
        desktop: incoming[i]?.desktop || "",
        mobile: incoming[i]?.mobile || ""
      }));
      setSettings({
        whatsapp_number: data.whatsapp_number || "",
        company_email: data.company_email || "",
        company_phone: data.company_phone || "",
        company_address: data.company_address || "",
        google_maps_embed: data.google_maps_embed || "",
        logo_url: data.logo_url || "",
        slider_slides: slides,
        slider_interval: data.slider_interval || 3
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(
        `${API}/settings`,
        {
          whatsapp_number: settings.whatsapp_number,
          company_email: settings.company_email,
          company_phone: settings.company_phone,
          company_address: settings.company_address,
          google_maps_embed: settings.google_maps_embed,
          logo_url: settings.logo_url
        },
        { withCredentials: true }
      );
      toast.success("Company settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Image must be smaller than 100MB");
      return;
    }
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSettings((prev) => ({ ...prev, logo_url: data.url }));
      toast.success("Logo uploaded — click Save Settings to persist");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const updateSlide = (idx, variant, value) => {
    const slides = settings.slider_slides.map((s, i) =>
      i === idx ? { ...s, [variant]: value } : s
    );
    setSettings({ ...settings, slider_slides: slides });
  };

  const handleFileUpload = async (idx, variant, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Image must be smaller than 100MB");
      return;
    }
    const key = `${idx}-${variant}`;
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      updateSlide(idx, variant, data.url);
      toast.success(`Slide ${idx + 1} ${variant} image uploaded`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const clearSlideImage = (idx, variant) => {
    updateSlide(idx, variant, "");
  };

  const saveSliderSettings = async () => {
    setSavingSlider(true);
    try {
      // Keep only slides that have at least a desktop image (mobile optional)
      const cleaned = settings.slider_slides
        .map((s) => ({ desktop: (s.desktop || "").trim(), mobile: (s.mobile || "").trim() }))
        .filter((s) => s.desktop || s.mobile);
      const intervalNum = Math.max(2, Math.min(15, parseInt(settings.slider_interval) || 3));
      await axios.put(
        `${API}/settings`,
        { slider_slides: cleaned, slider_interval: intervalNum },
        { withCredentials: true }
      );
      toast.success("Slider settings saved!");
    } catch (error) {
      toast.error("Failed to save slider settings");
    } finally {
      setSavingSlider(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div data-testid="admin-settings">
      <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white mb-8 lg:hidden">
        Settings
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Company Settings */}
        <div className="bg-[#1A1A1A] border border-white/5 p-6">
          <h2 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-6">
            Company Information
          </h2>

          <form onSubmit={handleCompanySubmit} className="space-y-6">
            {/* Brand Logo */}
            <div data-testid="logo-settings">
              <label className="text-[#6B7280] text-sm mb-2 block">Brand Logo</label>
              <div className="bg-[#0F0F0F] border border-white/10 p-4 space-y-3">
                <div className="w-full h-28 bg-white flex items-center justify-center overflow-hidden">
                  {settings.logo_url ? (
                    <img
                      src={settings.logo_url}
                      alt="Current logo"
                      data-testid="logo-preview"
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <span className="text-[#6B7280] text-xs">No logo uploaded</span>
                  )}
                </div>
                <input
                  type="text"
                  value={settings.logo_url}
                  onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                  data-testid="logo-url-input"
                  placeholder="Paste logo image URL"
                  className="w-full bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
                />
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={logoFileRef}
                    onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                    className="hidden"
                    data-testid="logo-file-input"
                  />
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    disabled={uploadingLogo}
                    data-testid="logo-upload-btn"
                    className="flex-1 border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 flex items-center justify-center gap-2 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader className="animate-spin" size={14} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        Upload from device
                      </>
                    )}
                  </button>
                  {settings.logo_url && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, logo_url: "" })}
                      data-testid="logo-clear-btn"
                      className="border border-white/10 text-[#6B7280] hover:text-red-500 px-3 py-2 text-xs uppercase tracking-wider transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <p className="text-[#6B7280] text-xs">PNG/JPG/WEBP, max 100MB. Save Settings after upload to persist.</p>
              </div>
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">WhatsApp Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                data-testid="settings-whatsapp-input"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                placeholder="+919876543210"
              />
              <p className="text-[#6B7280] text-xs mt-1">Include country code (e.g., +91 for India)</p>
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Company Email</label>
              <input
                type="email"
                value={settings.company_email}
                onChange={(e) => setSettings({ ...settings, company_email: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                placeholder="info@company.com"
              />
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Company Phone</label>
              <input
                type="text"
                value={settings.company_phone}
                onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                placeholder="+91-XXX-XXXXXXX"
              />
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Company Address</label>
              <textarea
                value={settings.company_address}
                onChange={(e) => setSettings({ ...settings, company_address: e.target.value })}
                rows={3}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none resize-none"
                placeholder="Full company address"
              />
            </div>

            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Google Maps Embed URL</label>
              <input
                type="url"
                value={settings.google_maps_embed}
                onChange={(e) => setSettings({ ...settings, google_maps_embed: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <p className="text-[#6B7280] text-xs mt-1">Get the embed URL from Google Maps share option</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              data-testid="save-settings-btn"
              className="w-full bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider px-6 py-4 flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </div>

        {/* Hero Slider Settings */}
        <div data-testid="hero-slider-settings" className="bg-[#1A1A1A] border border-white/5 p-6">
          <h2 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-2">
            Hero Image Slider
          </h2>
          <p className="text-[#6B7280] text-sm mb-6">
            Manage up to {SLIDER_SLOT_COUNT} slides. Each slide can have separate <strong className="text-white">Desktop</strong> and{" "}
            <strong className="text-white">Mobile</strong> banner images. Mobile is optional — if blank, the desktop image is shown on mobile too.
          </p>

          <div className="space-y-5">
            {/* Slide Interval */}
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Slide Interval (seconds)</label>
              <input
                type="number"
                min={2}
                max={15}
                value={settings.slider_interval}
                onChange={(e) => setSettings({ ...settings, slider_interval: e.target.value })}
                data-testid="slider-interval-input"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
              />
              <p className="text-[#6B7280] text-xs mt-1">Time between auto-transitions (2–15 seconds)</p>
            </div>

            {/* Slides */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {settings.slider_slides.map((slide, idx) => (
                <div
                  key={idx}
                  data-testid={`slider-slot-${idx}`}
                  className="bg-[#0F0F0F] border border-white/10 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-bold uppercase tracking-wider">
                      Slide {idx + 1}
                    </p>
                    {(slide.desktop || slide.mobile) && (
                      <button
                        type="button"
                        onClick={() => {
                          updateSlide(idx, "desktop", "");
                          updateSlide(idx, "mobile", "");
                        }}
                        data-testid={`slider-slot-${idx}-clear-all`}
                        className="text-[#6B7280] hover:text-red-500 text-xs uppercase tracking-wider transition-colors"
                      >
                        Clear slide
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Desktop variant */}
                    <SlideImageField
                      idx={idx}
                      variant="desktop"
                      icon={<Monitor size={14} />}
                      label="Desktop Banner"
                      value={slide.desktop}
                      onChange={(v) => updateSlide(idx, "desktop", v)}
                      onClear={() => clearSlideImage(idx, "desktop")}
                      onFile={(file) => handleFileUpload(idx, "desktop", file)}
                      uploading={uploadingKey === `${idx}-desktop`}
                      fileInputRefs={fileInputRefs}
                    />
                    {/* Mobile variant */}
                    <SlideImageField
                      idx={idx}
                      variant="mobile"
                      icon={<Smartphone size={14} />}
                      label="Mobile Banner"
                      value={slide.mobile}
                      onChange={(v) => updateSlide(idx, "mobile", v)}
                      onClear={() => clearSlideImage(idx, "mobile")}
                      onFile={(file) => handleFileUpload(idx, "mobile", file)}
                      uploading={uploadingKey === `${idx}-mobile`}
                      fileInputRefs={fileInputRefs}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={saveSliderSettings}
              disabled={savingSlider}
              data-testid="save-slider-btn"
              className="w-full bg-[#FF6A00] text-white font-bold text-sm uppercase tracking-wider px-6 py-4 flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
            >
              {savingSlider ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
              {savingSlider ? "Saving..." : "Save Slider Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlideImageField({
  idx,
  variant,
  icon,
  label,
  value,
  onChange,
  onClear,
  onFile,
  uploading,
  fileInputRefs
}) {
  const inputKey = `${idx}-${variant}`;
  return (
    <div
      data-testid={`slider-slot-${idx}-${variant}`}
      className="bg-[#1A1A1A] border border-white/5 p-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[#FF6A00] text-xs uppercase tracking-wider font-bold">
          {icon} {label}
        </span>
        {value && (
          <button
            type="button"
            onClick={onClear}
            data-testid={`slider-slot-${idx}-${variant}-clear`}
            className="text-[#6B7280] hover:text-red-500 transition-colors"
            aria-label={`Clear ${variant} image for slide ${idx + 1}`}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Preview */}
      <div
        className={`w-full ${variant === "mobile" ? "h-28 mx-auto max-w-[140px]" : "h-28"} bg-[#0F0F0F] border border-white/5 flex items-center justify-center overflow-hidden`}
      >
        {value ? (
          <img src={value} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={24} className="text-[#3A3A3A]" />
        )}
      </div>

      {/* URL input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`slider-slot-${idx}-${variant}-url`}
        placeholder="Paste image URL"
        className="w-full bg-[#0F0F0F] border border-white/10 text-white px-3 py-2 text-xs focus:border-[#FF6A00] focus:outline-none"
      />

      {/* File upload */}
      <input
        type="file"
        accept="image/*"
        ref={(el) => {
          fileInputRefs.current[inputKey] = el;
        }}
        onChange={(e) => onFile(e.target.files?.[0])}
        className="hidden"
        data-testid={`slider-slot-${idx}-${variant}-file`}
      />
      <button
        type="button"
        onClick={() => fileInputRefs.current[inputKey]?.click()}
        disabled={uploading}
        data-testid={`slider-slot-${idx}-${variant}-upload-btn`}
        className="w-full border border-white/10 text-white text-[11px] uppercase tracking-wider py-1.5 px-2 flex items-center justify-center gap-1 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader className="animate-spin" size={12} />
            Uploading...
          </>
        ) : (
          <>
            <Upload size={12} />
            Upload
          </>
        )}
      </button>
    </div>
  );
}
