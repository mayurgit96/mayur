import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  FolderTree
} from "lucide-react";
import { useState } from "react";

const sidebarLinks = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Categories", path: "/admin/categories", icon: FolderTree },
  { name: "Dealer Applications", path: "/admin/dealers", icon: Users },
  { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
  { name: "Settings", path: "/admin/settings", icon: Settings }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Sidebar */}
      <aside
        data-testid="admin-sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] border-r border-white/5 transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6A00] rounded flex items-center justify-center">
                <span className="font-['Barlow_Condensed'] font-black text-white text-sm">M</span>
              </div>
              <span className="font-['Barlow_Condensed'] font-bold text-white">ADMIN</span>
            </Link>
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`admin-nav-${link.name.toLowerCase().replace(" ", "-")}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-[#FF6A00]/10 text-[#FF6A00]"
                      : "text-[#6B7280] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-['IBM_Plex_Sans'] font-medium text-sm">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-2 mb-2">
              <div className="w-8 h-8 bg-[#0F3D2E] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{user?.name?.charAt(0) || "A"}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-[#6B7280] text-xs">{user?.email || ""}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              data-testid="admin-logout-btn"
              className="flex items-center gap-3 w-full px-4 py-3 text-[#6B7280] hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-['IBM_Plex_Sans'] font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-[#1A1A1A] border-b border-white/5 flex items-center justify-between px-6">
          <button
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(true)}
            data-testid="admin-menu-toggle"
          >
            <Menu size={24} />
          </button>
          <div className="hidden lg:block">
            <h1 className="font-['Barlow_Condensed'] font-bold text-white text-xl uppercase tracking-wider">
              {sidebarLinks.find((l) => l.path === location.pathname)?.name || "Dashboard"}
            </h1>
          </div>
          <Link
            to="/"
            target="_blank"
            className="text-[#6B7280] hover:text-white text-sm font-medium"
          >
            View Site →
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
