import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";

// Public Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import DealerPage from "@/pages/DealerPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import CatalogPage from "@/pages/CatalogPage";
import ContactPage from "@/pages/ContactPage";

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminDealers from "@/pages/admin/AdminDealers";
import AdminInquiries from "@/pages/admin/AdminInquiries";
import AdminSettings from "@/pages/admin/AdminSettings";

// Layout Components
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/dealer" element={<DealerPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/dealers" element={<AdminDealers />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
