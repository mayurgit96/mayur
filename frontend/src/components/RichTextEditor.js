import { useMemo } from "react";
import ReactQuill from "react-quill-new";

/**
 * RichTextEditor — thin wrapper around react-quill-new with a toolbar that
 * matches what the CMS spec requires: bold/italic, headings, bullet/ordered
 * lists, links, and image embed (paste URL or base64 data URL).
 */
export default function RichTextEditor({ value, onChange, placeholder = "Start typing...", testId }) {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        [{ align: [] }],
        ["clean"]
      ]
    }),
    []
  );

  return (
    <div data-testid={testId || "rich-text-editor"} className="cms-richtext bg-white text-[#1A1A1A]">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
