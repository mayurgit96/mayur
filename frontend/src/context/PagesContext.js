import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const PagesContext = createContext(null);

/**
 * PagesContext — caches the CMS pages list so any component can read a page or section by key.
 * Components should use `getPage(pageKey)` / `getSection(pageKey, sectionKey)` helpers
 * which fall back gracefully when the CMS doesn't have data yet.
 */
export function PagesProvider({ children }) {
  const [pages, setPages] = useState({}); // keyed by page key
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/pages`);
      const byKey = {};
      (data || []).forEach((p) => {
        byKey[p.key] = p;
      });
      setPages(byKey);
    } catch (error) {
      console.error("Failed to fetch CMS pages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getPage = (key) => pages[key] || null;

  const getSection = (pageKey, sectionKey) => {
    const page = pages[pageKey];
    if (!page || !Array.isArray(page.sections)) return null;
    return page.sections.find((s) => s.key === sectionKey) || null;
  };

  return (
    <PagesContext.Provider value={{ pages, loading, refetch, getPage, getSection }}>
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const ctx = useContext(PagesContext);
  if (!ctx) throw new Error("usePages must be used within a PagesProvider");
  return ctx;
}
