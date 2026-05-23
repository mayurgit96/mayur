import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Upload, X, Star, ChevronUp, ChevronDown, Loader, Image as ImageIcon } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ACCEPTED_MIMES = "image/jpeg,image/png,image/webp,image/jpg";
const ALLOWED_MIMES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/**
 * MultiImageUploader — gallery editor for product images.
 *
 * Props:
 *  - images: string[] — current list. images[0] is treated as the primary.
 *  - onChange: (newImages: string[]) => void
 *  - max: number (default 10)
 *  - testId?: string
 */
export default function MultiImageUploader({ images = [], onChange, max = 10, testId = "multi-image-uploader" }) {
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState("");
  const [uploadingCount, setUploadingCount] = useState(0);

  const safeImages = (images || []).filter((img) => img && typeof img === "string");

  const addImage = (url) => {
    if (!url || !url.trim()) return false;
    if (safeImages.includes(url)) {
      toast.error("Image already added");
      return false;
    }
    if (safeImages.length >= max) {
      toast.error(`Maximum ${max} images`);
      return false;
    }
    onChange([...safeImages, url.trim()]);
    return true;
  };

  const removeImage = (idx) => {
    onChange(safeImages.filter((_, i) => i !== idx));
  };

  const moveImage = (idx, direction) => {
    const next = [...safeImages];
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= next.length) return;
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    onChange(next);
  };

  const setPrimary = (idx) => {
    if (idx === 0) return;
    const next = [...safeImages];
    const [picked] = next.splice(idx, 1);
    next.unshift(picked);
    onChange(next);
  };

  const handleAddUrl = () => {
    if (addImage(urlInput)) setUrlInput("");
  };

  const handleFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList).slice(0, max - safeImages.length);
    if (files.length === 0) {
      toast.error(`Maximum ${max} images`);
      return;
    }
    setUploadingCount(files.length);
    try {
      const uploaded = [];
      for (const file of files) {
        if (!ALLOWED_MIMES.includes(file.type)) {
          toast.error(`${file.name}: only JPG/PNG/WEBP allowed — skipped`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: larger than 5MB — skipped`);
          continue;
        }
        try {
          const fd = new FormData();
          fd.append("file", file);
          const { data } = await axios.post(`${API}/upload-image`, fd, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" }
          });
          if (data?.url && !safeImages.includes(data.url) && !uploaded.includes(data.url)) {
            uploaded.push(data.url);
          }
        } catch (err) {
          toast.error(`${file.name}: upload failed`);
        }
      }
      if (uploaded.length > 0) {
        onChange([...safeImages, ...uploaded].slice(0, max));
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
      }
    } finally {
      setUploadingCount(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div data-testid={testId} className="space-y-3">
      {/* Add controls */}
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddUrl();
            }
          }}
          placeholder="Paste image URL and press Enter or click Add"
          data-testid={`${testId}-url-input`}
          className="flex-1 min-w-[200px] bg-[#0F0F0F] border border-white/10 text-white px-3 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
        />
        <button
          type="button"
          onClick={handleAddUrl}
          data-testid={`${testId}-add-url-btn`}
          className="bg-[#FF6A00] text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-white hover:text-[#1A1A1A] transition-colors"
        >
          Add URL
        </button>
        <input
          type="file"
          accept={ACCEPTED_MIMES}
          multiple
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          data-testid={`${testId}-file`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingCount > 0 || safeImages.length >= max}
          data-testid={`${testId}-upload-btn`}
          className="border border-white/10 text-white px-4 py-2 text-xs uppercase tracking-wider flex items-center gap-2 hover:border-[#FF6A00] hover:text-[#FF6A00] transition-colors disabled:opacity-50"
        >
          {uploadingCount > 0 ? <Loader className="animate-spin" size={14} /> : <Upload size={14} />}
          {uploadingCount > 0 ? `Uploading ${uploadingCount}...` : "Upload Files"}
        </button>
      </div>

      <p className="text-[#6B7280] text-xs">
        JPG / PNG / WEBP up to 5MB each. {safeImages.length}/{max} images. Tip: the first image is shown as the primary.
      </p>

      {/* Gallery */}
      {safeImages.length === 0 ? (
        <div className="border border-dashed border-white/10 py-12 flex flex-col items-center justify-center text-[#6B7280] text-sm">
          <ImageIcon size={32} className="mb-2 text-[#3A3A3A]" />
          No images yet — add a URL or upload from your device
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {safeImages.map((url, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={`${url}-${idx}`}
                data-testid={`${testId}-item-${idx}`}
                className={`relative bg-[#0F0F0F] border ${isPrimary ? "border-[#FF6A00]" : "border-white/10"} p-2`}
              >
                <div className="w-full aspect-square bg-[#1A1A1A] overflow-hidden mb-2">
                  <img src={url} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
                {isPrimary && (
                  <span
                    data-testid={`${testId}-item-${idx}-primary-badge`}
                    className="absolute top-3 left-3 bg-[#FF6A00] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1"
                  >
                    <Star size={10} fill="currentColor" /> Primary
                  </span>
                )}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, -1)}
                      disabled={idx === 0}
                      data-testid={`${testId}-item-${idx}-up`}
                      className="text-[#6B7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                      aria-label="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 1)}
                      disabled={idx === safeImages.length - 1}
                      data-testid={`${testId}-item-${idx}-down`}
                      className="text-[#6B7280] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-1"
                      aria-label="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimary(idx)}
                        data-testid={`${testId}-item-${idx}-set-primary`}
                        className="text-[#6B7280] hover:text-[#FF6A00] transition-colors p-1"
                        aria-label="Set as primary"
                        title="Set as primary"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      data-testid={`${testId}-item-${idx}-remove`}
                      className="text-[#6B7280] hover:text-red-500 transition-colors p-1"
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
