import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Save, Video, Loader } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [settings, setSettings] = useState({
    whatsapp_number: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    google_maps_embed: "",
    hero_video_url: ""
  });
  const [videoPrompt, setVideoPrompt] = useState(
    "Create a cinematic 5-second loop video of an industrial worker using an angle grinder cutting metal, bright sparks flying in slow motion, dark industrial workshop environment, dramatic lighting, ultra realistic, high contrast, glowing orange sparks, metal cutting close-up shots"
  );

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/settings`);
      setSettings(data);
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
      await axios.put(`${API}/settings`, settings, { withCredentials: true });
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const generateVideo = async () => {
    if (!window.confirm("This will generate a new hero video using AI. This may take a few minutes. Continue?")) return;
    
    setGeneratingVideo(true);
    try {
      const { data } = await axios.post(`${API}/generate-video`, { prompt: videoPrompt }, { withCredentials: true });
      setSettings({ ...settings, hero_video_url: data.video_url });
      toast.success("Video generated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to generate video");
    } finally {
      setGeneratingVideo(false);
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

        {/* Video Settings */}
        <div className="bg-[#1A1A1A] border border-white/5 p-6">
          <h2 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white mb-6">
            Hero Video (Sora 2)
          </h2>

          <div className="space-y-6">
            <div>
              <label className="text-[#6B7280] text-sm mb-2 block">Current Video URL</label>
              <input
                type="url"
                value={settings.hero_video_url}
                onChange={(e) => setSettings({ ...settings, hero_video_url: e.target.value })}
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                placeholder="Video URL (or generate below)"
              />
            </div>

            {settings.hero_video_url && (
              <div>
                <label className="text-[#6B7280] text-sm mb-2 block">Preview</label>
                <video
                  src={settings.hero_video_url}
                  autoPlay
                  muted
                  loop
                  className="w-full h-48 object-cover bg-[#0F0F0F]"
                />
              </div>
            )}

            <div className="border-t border-white/5 pt-6">
              <h3 className="font-['Barlow_Condensed'] font-bold text-lg uppercase text-white mb-4">
                Generate New Video
              </h3>
              <p className="text-[#6B7280] text-sm mb-4">
                Use AI (Sora 2) to generate a new hero video for your website. 
                This process may take 2-5 minutes.
              </p>

              <div className="mb-4">
                <label className="text-[#6B7280] text-sm mb-2 block">Video Prompt</label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={4}
                  className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none resize-none text-sm"
                />
              </div>

              <button
                onClick={generateVideo}
                disabled={generatingVideo}
                data-testid="generate-video-btn"
                className="w-full border border-[#FF6A00] text-[#FF6A00] font-bold text-sm uppercase tracking-wider px-6 py-4 flex items-center justify-center gap-2 hover:bg-[#FF6A00] hover:text-white transition-colors disabled:opacity-50"
              >
                {generatingVideo ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Generating Video (this may take a few minutes)...
                  </>
                ) : (
                  <>
                    <Video size={18} />
                    Generate Video with Sora 2
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
