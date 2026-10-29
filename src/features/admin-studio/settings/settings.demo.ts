import type { StudioSettings } from "./settings.types";

export const initialSettings: StudioSettings = {
  phone: "+48 123 456 789",
  whatsapp: "+48 123 456 789",
  customerEmail: "studio@example.com",
  notificationEmail: "admin@example.com",
  hours: "Пн–Сб 9:00–20:00, Вс — выходной",
  street: "",
  postcode: "",
  city: "",
  directions: "",
  mapUrl: "",
  socials: [
    {
      name: "Instagram",
      url: "https://instagram.com/",
      enabled: true,
    },
    {
      name: "Facebook",
      url: "https://facebook.com/",
      enabled: true,
    },
    {
      name: "TikTok",
      url: "",
      enabled: false,
    },
    {
      name: "Telegram",
      url: "",
      enabled: true,
    },
    {
      name: "YouTube",
      url: "",
      enabled: false,
    },
  ],
};
