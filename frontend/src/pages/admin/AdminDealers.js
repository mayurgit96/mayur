import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Check, X, MessageCircle, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSettings } from "@/context/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusColors = {
  pending: "bg-yellow-600/20 text-yellow-500",
  approved: "bg-green-600/20 text-green-400",
  rejected: "bg-red-600/20 text-red-400",
  contacted: "bg-blue-600/20 text-blue-400"
};

export default function AdminDealers() {
  const { getWhatsAppLink } = useSettings();
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState(null);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchDealers();
  }, [filter]);

  const fetchDealers = async () => {
    try {
      const params = filter ? `?status=${filter}` : "";
      const { data } = await axios.get(`${API}/dealers${params}`, { withCredentials: true });
      setDealers(data);
    } catch (error) {
      console.error("Failed to fetch dealers:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/dealers/${id}/status?status=${status}`, {}, { withCredentials: true });
      toast.success(`Status updated to ${status}`);
      fetchDealers();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteDealer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await axios.delete(`${API}/dealers/${id}`, { withCredentials: true });
      toast.success("Application deleted");
      fetchDealers();
    } catch (error) {
      toast.error("Failed to delete application");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div data-testid="admin-dealers">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white lg:hidden">
          Dealer Applications
        </h1>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="contacted">Contacted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader"></div>
        </div>
      ) : dealers.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1A] border border-white/5">
          <p className="text-[#6B7280]">No dealer applications found</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Name</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Contact</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Location</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Business</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Date</th>
                <th className="text-right text-[#6B7280] text-xs uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map((dealer) => (
                <tr key={dealer.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <p className="text-white font-medium">{dealer.name}</p>
                    {dealer.business_name && (
                      <p className="text-[#6B7280] text-sm">{dealer.business_name}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-white text-sm">{dealer.phone}</p>
                    {dealer.email && <p className="text-[#6B7280] text-sm">{dealer.email}</p>}
                  </td>
                  <td className="p-4 text-[#6B7280] text-sm">
                    {dealer.city}{dealer.state && `, ${dealer.state}`}
                  </td>
                  <td className="p-4 text-[#6B7280] text-sm">{dealer.business_type}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[dealer.status]}`}>
                      {dealer.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B7280] text-sm">{formatDate(dealer.created_at)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedDealer(dealer)}
                        className="p-2 text-[#6B7280] hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={getWhatsAppLink(`Hi ${dealer.name}, regarding your dealer application for Mayur Abrasives...`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#6B7280] hover:text-[#25D366] transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </a>
                      {dealer.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(dealer.id, "approved")}
                            className="p-2 text-[#6B7280] hover:text-green-500 transition-colors"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => updateStatus(dealer.id, "rejected")}
                            className="p-2 text-[#6B7280] hover:text-red-500 transition-colors"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteDealer(dealer.id)}
                        className="p-2 text-[#6B7280] hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dealer Details Modal */}
      <Dialog open={!!selectedDealer} onOpenChange={() => setSelectedDealer(null)}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white">
              Application Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedDealer && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#6B7280] text-sm">Name</p>
                  <p className="text-white">{selectedDealer.name}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Phone</p>
                  <p className="text-white">{selectedDealer.phone}</p>
                </div>
                {selectedDealer.email && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Email</p>
                    <p className="text-white">{selectedDealer.email}</p>
                  </div>
                )}
                {selectedDealer.business_name && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Business Name</p>
                    <p className="text-white">{selectedDealer.business_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-[#6B7280] text-sm">Business Type</p>
                  <p className="text-white">{selectedDealer.business_type}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Location</p>
                  <p className="text-white">{selectedDealer.city}{selectedDealer.state && `, ${selectedDealer.state}`}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Status</p>
                  <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[selectedDealer.status]}`}>
                    {selectedDealer.status}
                  </span>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Applied On</p>
                  <p className="text-white">{formatDate(selectedDealer.created_at)}</p>
                </div>
              </div>
              {selectedDealer.message && (
                <div>
                  <p className="text-[#6B7280] text-sm">Message</p>
                  <p className="text-white bg-[#0F0F0F] p-4 mt-2">{selectedDealer.message}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <select
                  value={selectedDealer.status}
                  onChange={(e) => {
                    updateStatus(selectedDealer.id, e.target.value);
                    setSelectedDealer({ ...selectedDealer, status: e.target.value });
                  }}
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <a
                  href={getWhatsAppLink(`Hi ${selectedDealer.name}, regarding your dealer application for Mayur Abrasives...`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-6 py-3 flex items-center gap-2 font-bold text-sm uppercase tracking-wider"
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
