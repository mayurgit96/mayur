import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/admin");
    } catch (err) {
      const errorMsg = formatApiErrorDetail(err.response?.data?.detail) || err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FF6A00] rounded mx-auto mb-4 flex items-center justify-center">
            <span className="font-['Barlow_Condensed'] font-black text-white text-3xl">M</span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white tracking-wider">
            Admin Login
          </h1>
          <p className="text-[#6B7280] text-sm mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          data-testid="admin-login-form"
          className="bg-[#1A1A1A] border border-white/5 p-8"
        >
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="text-[#6B7280] text-sm mb-2 block">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              data-testid="admin-email-input"
              className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-8">
            <label className="text-[#6B7280] text-sm mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="admin-password-input"
                className="w-full bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 pr-12 focus:border-[#FF6A00] focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-btn"
            className="w-full bg-[#FF6A00] text-white font-['IBM_Plex_Sans'] font-bold text-sm uppercase tracking-widest px-6 py-4 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[#6B7280] text-sm mt-6">
          <a href="/" className="hover:text-white transition-colors">← Back to Website</a>
        </p>
      </div>
    </div>
  );
}
