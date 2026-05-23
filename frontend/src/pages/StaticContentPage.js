import { useEffect } from "react";
import { usePages } from "@/context/PagesContext";

export default function StaticContentPage({ pageKey }) {
  const { getPage } = usePages();
  const page = getPage(pageKey);

  useEffect(() => {
    if (page?.seo?.meta_title) document.title = page.seo.meta_title;
    return () => {
      document.title = "Mayur Abrasives";
    };
  }, [page]);

  return (
    <div data-testid={`static-page-${pageKey}`} className="pt-24 sm:pt-28 pb-16 min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-12 h-1 bg-[#FF6A00]"></div>
          <p className="font-['Montserrat'] font-bold text-xs sm:text-sm uppercase tracking-[0.2em] text-[#FF6A00]">
            {page?.title || pageKey}
          </p>
        </div>
        <h1 className="font-['Montserrat'] font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1A1A1A] mb-8">
          {page?.title || pageKey}
        </h1>
        {page?.content_html ? (
          <div
            data-testid="static-content"
            className="cms-rendered text-[#1A1A1A] font-['Inter']"
            dangerouslySetInnerHTML={{ __html: page.content_html }}
          />
        ) : (
          <p className="text-[#6B7280]">Content coming soon. Edit this page from Admin → Pages.</p>
        )}
      </div>
    </div>
  );
}
