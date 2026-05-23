import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ACCEPTED_MIMES = "image/jpeg,image/png,image/webp,image/jpg";

/**
 * ImageUploader — single image picker with URL input + device upload + preview.
 * Used by AdminProducts (primary image), AdminCategories, AdminPageEditor, AdminSettings.
 *
 * Props:
 *  - value: string (current image URL or data URL)
 *  - onChange: (newValue: string) => void
 *  - label?: string
 *  - testId?: string (root testid)
 *  - height?: tailwind class for preview height (default h-32)
 *  - placeholder?: URL input placeholder
 */
export default function ImageUploader({
  value,
  onChange,
  label,
  testId = "image-uploader",
  height = "h-32",
  placeholder = "Paste image URL or upload below"
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are supported");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Image must be smaller than 100MB");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await axios.post(`${API}/upload-image`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid={testId} className="space-y-2">
      {label && <label className="text-[#6B7280] text-xs uppercase tracking-wider block">{label}</label>}

      {/* Preview */}
      <div className={`w-full ${height} bg-[#0F0F0F] border border-white/10 flex items-center justify-center overflow-hidden`}>
        {value ? (
          <img
            src={value}
            alt="Preview"
            data-testid={`${testId}-preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageIcon size={28} className="text-[#3A3A3A]" />
        )}
      </div>

      {/* URL input */}
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`${testId}-url`}
        placeholder={placeholder}
        className="w-full bg-[#0F0F0F] border border-white/10 text-white px-3 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
      />

      {/* File upload */}
      <input
        type="file"
        accept={ACCEPTED_MIMES}
        ref={inputRef}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
        data-testid={`${testId}-file`}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          data-testid={`${testId}-upload-btn`}
          className="flex-1 border border-white/10 text-white text-xs uppercase tracking-wider py-2 px-3 flex items-center justify-center gap-2 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
          {uploading ? "Uploading..." : "Upload from device"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            data-testid={`${testId}-clear`}
            className="border border-white/10 text-[#6B7280] hover:text-red-500 px-3 transition-colors"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
