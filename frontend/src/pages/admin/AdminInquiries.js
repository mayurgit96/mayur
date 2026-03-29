import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { MessageCircle, Trash2, Eye, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSettings } from "@/context/SettingsContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const statusColors = {
  new: "bg-blue-600/20 text-blue-400",
  contacted: "bg-yellow-600/20 text-yellow-500",
  resolved: "bg-green-600/20 text-green-400",
  closed: "bg-[#6B7280]/20 text-[#6B7280]"
};

const typeLabels = {
  general: "General",
  quote: "Quote Request",
  contact: "Contact",
  support: "Support"
};

export default function AdminInquiries() {
  const { getWhatsAppLink } = useSettings();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, typeFilter]);

  const fetchInquiries = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("inquiry_type", typeFilter);
      const { data } = await axios.get(`${API}/inquiries?${params.toString()}`, { withCredentials: true });
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API}/inquiries/${id}/status?status=${status}`, {}, { withCredentials: true });
      toast.success(`Status updated to ${status}`);
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await axios.delete(`${API}/inquiries/${id}`, { withCredentials: true });
      toast.success("Inquiry deleted");
      fetchInquiries();
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div data-testid="admin-inquiries">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-['Barlow_Condensed'] font-bold text-3xl uppercase text-white lg:hidden">
          Inquiries
        </h1>
        <div className="flex gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 text-white px-4 py-2 text-sm focus:border-[#FF6A00] focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="general">General</option>
            <option value="quote">Quote Request</option>
            <option value="contact">Contact</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="loader"></div>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-20 bg-[#1A1A1A] border border-white/5">
          <p className="text-[#6B7280]">No inquiries found</p>
        </div>
      ) : (
        <div className="bg-[#1A1A1A] border border-white/5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Contact</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Type</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Message</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Status</th>
                <th className="text-left text-[#6B7280] text-xs uppercase tracking-wider p-4">Date</th>
                <th className="text-right text-[#6B7280] text-xs uppercase tracking-wider p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-4">
                    <p className="text-white font-medium">{inquiry.name}</p>
                    <p className="text-[#6B7280] text-sm">{inquiry.phone}</p>
                    {inquiry.company && <p className="text-[#6B7280] text-xs">{inquiry.company}</p>}
                  </td>
                  <td className="p-4">
                    <span className="text-[#FF6A00] text-xs uppercase tracking-wider">
                      {typeLabels[inquiry.inquiry_type] || inquiry.inquiry_type}
                    </span>
                    {inquiry.product_name && (
                      <p className="text-[#6B7280] text-xs mt-1">{inquiry.product_name}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="text-[#6B7280] text-sm line-clamp-2 max-w-xs">{inquiry.message}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[inquiry.status]}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-[#6B7280] text-sm whitespace-nowrap">{formatDate(inquiry.created_at)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedInquiry(inquiry)}
                        className="p-2 text-[#6B7280] hover:text-white transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <a
                        href={getWhatsAppLink(`Hi ${inquiry.name}, regarding your inquiry about Mayur Abrasives...`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#6B7280] hover:text-[#25D366] transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </a>
                      {inquiry.status === "new" && (
                        <button
                          onClick={() => updateStatus(inquiry.id, "contacted")}
                          className="p-2 text-[#6B7280] hover:text-green-500 transition-colors"
                          title="Mark as Contacted"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
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

      {/* Inquiry Details Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="bg-[#1A1A1A] border border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-['Barlow_Condensed'] font-bold text-2xl uppercase text-white">
              Inquiry Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#6B7280] text-sm">Name</p>
                  <p className="text-white">{selectedInquiry.name}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Phone</p>
                  <p className="text-white">{selectedInquiry.phone}</p>
                </div>
                {selectedInquiry.email && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Email</p>
                    <p className="text-white">{selectedInquiry.email}</p>
                  </div>
                )}
                {selectedInquiry.company && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Company</p>
                    <p className="text-white">{selectedInquiry.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-[#6B7280] text-sm">Type</p>
                  <p className="text-[#FF6A00]">{typeLabels[selectedInquiry.inquiry_type] || selectedInquiry.inquiry_type}</p>
                </div>
                {selectedInquiry.product_name && (
                  <div>
                    <p className="text-[#6B7280] text-sm">Product</p>
                    <p className="text-white">{selectedInquiry.product_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-[#6B7280] text-sm">Status</p>
                  <span className={`text-xs px-2 py-1 uppercase tracking-wider ${statusColors[selectedInquiry.status]}`}>
                    {selectedInquiry.status}
                  </span>
                </div>
                <div>
                  <p className="text-[#6B7280] text-sm">Date</p>
                  <p className="text-white">{formatDate(selectedInquiry.created_at)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-[#6B7280] text-sm">Message</p>
                <p className="text-white bg-[#0F0F0F] p-4 mt-2">{selectedInquiry.message}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => {
                    updateStatus(selectedInquiry.id, e.target.value);
                    setSelectedInquiry({ ...selectedInquiry, status: e.target.value });
                  }}
                  className="flex-1 bg-[#0F0F0F] border border-white/10 text-white px-4 py-3 focus:border-[#FF6A00] focus:outline-none"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <a
                  href={getWhatsAppLink(`Hi ${selectedInquiry.name}, regarding your inquiry about Mayur Abrasives...\n\nYour message: "${selectedInquiry.message}"`)}
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
