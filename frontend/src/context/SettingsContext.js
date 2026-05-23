import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const SettingsContext = createContext(null);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    whatsapp_number: "+919876543210",
    company_email: "info@mayurabrasives.com",
    company_phone: "+91-141-2345678",
    company_address: "Industrial Area, Jaipur, Rajasthan, India - 302001",
    google_maps_embed: "",
    hero_video_url: "",
    slider_images: [],
    slider_slides: [],
    slider_interval: 3,
    logo_url: ""
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/settings`);
      setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const getWhatsAppLink = (message = "") => {
    const phone = settings.whatsapp_number.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}${message ? `?text=${encodedMessage}` : ""}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, getWhatsAppLink }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
