import { useState, useEffect } from "react";
import axios from "axios";
import { Package, Users, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentDealers, setRecentDealers] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, dealersRes, inquiriesRes] = await Promise.all([
        axios.get(`${API}/stats`, { withCredentials: true }),
        axios.get(`${API}/dealers?status=pending`, { withCredentials: true }),
        axios.get(`${API}/inquiries?status=new`, { withCredentials: true })
      ]);
      setStats(statsRes.data);
      setRecentDealers(dealersRes.data.slice(0, 5));
      setRecentInquiries(inquiriesRes.data.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Products", value: stats?.products || 0, icon: Package, color: "bg-[#0F3D2E]" },
    { label: "Total Dealers", value: stats?.dealers || 0, icon: Users, color: "bg-[#FF6A00]" },
    { label: "Pending Dealers", value: stats?.pending_dealers || 0, icon: AlertCircle, color: "bg-yellow-600" },
    { label: "New Inquiries", value: stats?.new_inquiries || 0, icon: MessageSquare, color: "bg-blue-600" }
  ];

  return (
    <div data-testid="admin-dashboard">
      <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white mb-8 lg:hidden">
        Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              data-testid={`stat-card-${idx}`}
              className="bg-[#1A1A1A] border border-white/5 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <TrendingUp size={20} className="text-[#6B7280]" />
              </div>
              <p className="font-['Barlow_Condensed'] font-black text-4xl text-white mb-1">
                {stat.value}
              </p>
              <p className="text-[#6B7280] text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Dealer Applications */}
        <div className="bg-[#1A1A1A] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white">
              Pending Dealer Applications
            </h2>
            <Link to="/admin/dealers" className="text-[#FF6A00] text-sm hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          {recentDealers.length === 0 ? (
            <p className="text-[#6B7280] text-center py-8">No pending applications</p>
          ) : (
            <div className="space-y-4">
              {recentDealers.map((dealer) => (
                <div
                  key={dealer.id}
                  className="flex items-center justify-between p-4 bg-[#0F0F0F] border border-white/5"
                >
                  <div>
                    <p className="text-white font-medium">{dealer.name}</p>
                    <p className="text-[#6B7280] text-sm">{dealer.city} • {dealer.business_type}</p>
                  </div>
                  <span className="bg-yellow-600/20 text-yellow-500 text-xs px-2 py-1 uppercase tracking-wider">
                    Pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="bg-[#1A1A1A] border border-white/5 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-['Barlow_Condensed'] font-bold text-xl uppercase text-white">
              New Inquiries
            </h2>
            <Link to="/admin/inquiries" className="text-[#FF6A00] text-sm hover:text-white transition-colors">
              View All →
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-[#6B7280] text-center py-8">No new inquiries</p>
          ) : (
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 bg-[#0F0F0F] border border-white/5"
                >
                  <div>
                    <p className="text-white font-medium">{inquiry.name}</p>
                    <p className="text-[#6B7280] text-sm line-clamp-1">{inquiry.message}</p>
                  </div>
                  <span className="bg-blue-600/20 text-blue-400 text-xs px-2 py-1 uppercase tracking-wider">
                    New
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
