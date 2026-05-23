import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FileText, ChevronRight, Eye, EyeOff } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${API}/pages`);
        setPages(data || []);
      } catch (error) {
        console.error("Failed to fetch pages:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div data-testid="admin-pages">
      <div className="mb-8">
        <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white lg:hidden">
          Pages (CMS)
        </h1>
        <p className="text-[#6B7280] text-sm">
          Manage page content, SEO metadata, and section visibility. Changes reflect on the website immediately.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link
              key={page.id}
              to={`/admin/pages/${page.key}`}
              data-testid={`page-card-${page.key}`}
              className="bg-[#1A1A1A] border border-white/5 p-5 hover:border-[#FF6A00]/50 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#0F0F0F] border border-white/5 flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-[#FF6A00]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold uppercase tracking-wider text-sm truncate">
                      {page.title}
                    </p>
                    <p className="text-[#6B7280] text-xs font-mono">/{page.key}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-[#6B7280] group-hover:text-[#FF6A00] flex-shrink-0" />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className={`flex items-center gap-1 ${page.enabled ? "text-green-400" : "text-[#6B7280]"}`}>
                  {page.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  {page.enabled ? "Enabled" : "Disabled"}
                </span>
                {page.sections?.length > 0 && (
                  <span className="text-[#6B7280]">
                    {page.sections.length} section{page.sections.length === 1 ? "" : "s"}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
