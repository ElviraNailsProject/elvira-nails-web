import type { Promotion, PromotionStatus } from "./promotions.types";
import type {
  StudioLocale,
  StudioParams,
} from "../shared/i18n/studio-translations";
import type { promotionMessages } from "./promotions.messages";

type PromotionTranslator = (
  key: keyof typeof promotionMessages,
  params?: StudioParams,
) => string;

export function formatDate(value: string, locale: StudioLocale = "ru") {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function statusOf(promotion: Promotion, today: string): PromotionStatus {
  if (!promotion.visible || (promotion.autoHide && promotion.end < today))
    return "hidden";
  return promotion.start > today ? "scheduled" : "active";
}

export function timingText(
  promotion: Promotion,
  today: string,
  t: PromotionTranslator,
) {
  const end = Date.parse(`${promotion.end}T12:00:00Z`);
  const now = Date.parse(`${today}T12:00:00Z`);
  const start = Date.parse(`${promotion.start}T12:00:00Z`);
  const remaining = Math.round((end - now) / 86_400_000);
  if (start > now)
    return t("startsIn", { days: Math.round((start - now) / 86_400_000) });
  if (remaining < 0) return t("endedAgo", { days: Math.abs(remaining) });
  if (remaining === 0) return t("lastDay");
  return t("remaining", { days: remaining });
}

export function visibilityText(
  promotion: Promotion,
  today: string,
  t: PromotionTranslator,
  locale: StudioLocale,
) {
  if (promotion.autoHide && promotion.end < today)
    return t("automaticallyHidden");
  if (!promotion.visible) return t("hiddenFromCustomers");
  if (promotion.start > today)
    return t("appearsOn", { date: formatDate(promotion.start, locale) });
  return t("visibleOnSite");
}
