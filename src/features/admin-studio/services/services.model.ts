import type { Service } from "./services.types";
import type { StudioLocale } from "../shared/i18n/studio-translations";

export function formatServiceDuration(
  minutes: number,
  locale: StudioLocale = "ru",
) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const units = {
    ru: ["ч", "мин"],
    uk: ["год", "хв"],
    en: ["h", "min"],
    nl: ["u", "min"],
  }[locale];
  return [
    hours ? `${hours} ${units[0]}` : "",
    rest ? `${rest} ${units[1]}` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function createServiceDraft(): Service {
  return {
    id: crypto.randomUUID(),
    title: "",
    category: "Маникюр",
    price: 0,
    minutes: 60,
    description: "",
    visible: false,
    color: "#e9d9cc",
    addOns: [],
  };
}
