import "@/App.css";
import "react-quill-new/dist/quill.snow.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { PagesProvider } from "@/context/PagesContext";

// Public Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import DealerPage from "@/pages/DealerPage";
import CatalogPage from "@/pages/CatalogPage";
import ContactPage from "@/pages/ContactPage";
import StaticContentPage from "@/pages/StaticContentPage";

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminDealers from "@/pages/admin/AdminDealers";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminPages from "@/pages/admin/AdminPages";
import AdminPageEditor from "@/pages/admin/AdminPageEditor";

// Layout Components
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <PagesProvider>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/dealer" element={<DealerPage />} />
                <Route path="/catalog" element={<CatalogPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<StaticContentPage pageKey="privacy" />} />
                <Route path="/terms" element={<StaticContentPage pageKey="terms" />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/pages" element={<AdminPages />} />
                <Route path="/admin/pages/:pageKey" element={<AdminPageEditor />} />
                <Route path="/admin/dealers" element={<AdminDealers />} />
                <Route path="/admin/inquiries" element={<AdminInquiries />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Routes>
            <Toaster position="top-right" />
          </PagesProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
