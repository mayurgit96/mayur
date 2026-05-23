import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Save, Loader, Upload, X, Image as ImageIcon } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const SLIDER_SLOT_COUNT = 5;

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSlider, setSavingSlider] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    google_maps_embed: "",
    slider_images: [],
    slider_interval: 3
  });
  const fileInputRefs = useRef([]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/settings`);
      // Pad slider images to fixed slot count
      const images = Array.from({ length: SLIDER_SLOT_COUNT }, (_, i) => (data.slider_images || [])[i] || "");
      setSettings({
        whatsapp_number: data.whatsapp_number || "",
        company_email: data.company_email || "",
        company_phone: data.company_phone || "",
        company_address: data.company_address || "",
        google_maps_embed: data.google_maps_embed || "",
        slider_images: images,
        slider_interval: data.slider_interval || 3
      });
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        whatsapp_number: settings.whatsapp_number,
        company_email: settings.company_email,
        company_phone: settings.company_phone,
        company_address: settings.company_address,
        google_maps_embed: settings.google_maps_embed
      };
      await axios.put(`${API}/settings`, payload, { withCredentials: true });
      toast.success("Company settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSliderImageChange = (idx, value) => {
    const newImages = [...settings.slider_images];
    newImages[idx] = value;
    setSettings({ ...settings, slider_images: newImages });
  };

  const handleFileUpload = async (idx, file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }
    setUploadingIdx(idx);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      handleSliderImageChange(idx, data.url);
      toast.success(`Image ${idx + 1} uploaded`);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingIdx(null);
    }
  };

  const clearSliderImage = (idx) => {
    handleSliderImageChange(idx, "");
  };

  const saveSliderSettings = async () => {
    setSavingSlider(true);
    try {
      // Only send non-empty images, preserving order
      const cleanedImages = settings.slider_images.filter((img) => img && img.trim());
      const intervalNum = Math.max(2, Math.min(15, parseInt(settings.slider_interval) || 3));
      await axios.put(
        `${API}/settings`,
        { slider_images: cleanedImages, slider_interval: intervalNum },
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

          <form onSubmit={handleSubmit} className="space-y-6">
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
            Manage up to {SLIDER_SLOT_COUNT} images shown on the homepage hero slider. Add a URL or upload a file (max 5MB).
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
              <p className="text-[#6B7280] text-xs mt-1">Time between auto-transitions (2-15 seconds)</p>
            </div>

            {/* Slider Image Slots */}
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {settings.slider_images.map((imgUrl, idx) => (
                <div
                  key={idx}
                  data-testid={`slider-slot-${idx}`}
                  className="bg-[#0F0F0F] border border-white/10 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-white text-sm font-semibold">Image {idx + 1}</label>
                    {imgUrl && (
                      <button
                        type="button"
                        onClick={() => clearSliderImage(idx)}
                        data-testid={`slider-slot-${idx}-clear`}
                        className="text-[#6B7280] hover:text-red-500 transition-colors"
                        aria-label={`Clear image ${idx + 1}`}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="w-full h-32 bg-[#1A1A1A] border border-white/5 flex items-center justify-center overflow-hidden">
                    {imgUrl ? (
                      <img src={imgUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={32} className="text-[#3A3A3A]" />
                    )}
                  </div>

                  {/* URL input */}
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleSliderImageChange(idx, e.target.value)}
                    data-testid={`slider-slot-${idx}-url`}
                    placeholder="Paste image URL or upload below"
                    className="w-full bg-[#1A1A1A] border border-white/10 text-white px-3 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
                  />

                  {/* File upload */}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={(el) => (fileInputRefs.current[idx] = el)}
                      onChange={(e) => handleFileUpload(idx, e.target.files?.[0])}
                      className="hidden"
                      data-testid={`slider-slot-${idx}-file`}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      disabled={uploadingIdx === idx}
                      data-testid={`slider-slot-${idx}-upload-btn`}
                      className="flex-1 border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 flex items-center justify-center gap-2 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
                    >
                      {uploadingIdx === idx ? (
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
