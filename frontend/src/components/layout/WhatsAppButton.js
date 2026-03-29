import { MessageCircle } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export default function WhatsAppButton() {
  const { getWhatsAppLink } = useSettings();

  return (
    <a
      href={getWhatsAppLink("Hi, I'm interested in your abrasive products.")}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-button"
      className="whatsapp-float"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} className="text-white" />
    </a>
  );
}
