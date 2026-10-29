import { getStudioLocale } from "@/features/admin-studio/shared/i18n/studio-translations";

const titles = {
  content: {
    ru: "Контент сайта",
    uk: "Контент сайту",
    en: "Website content",
    nl: "Website-inhoud",
  },
  promotions: { ru: "Акции", uk: "Акції", en: "Promotions", nl: "Acties" },
  settings: {
    ru: "Настройки студии",
    uk: "Налаштування студії",
    en: "Studio settings",
    nl: "Studio-instellingen",
  },
} as const;

export function studioPageTitle(segments: string[], language: string) {
  if (segments.length !== 2 || segments[0] !== "studio") return undefined;
  const section = segments[1];
  if (
    section !== "content" &&
    section !== "promotions" &&
    section !== "settings"
  )
    return undefined;
  return `${titles[section][getStudioLocale(language)]} — Elvira`;
}
