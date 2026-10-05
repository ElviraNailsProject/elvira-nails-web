import { Locale as PrismaLocale } from "@/generated/prisma/client";

export const supportedLocales = {
  nl: PrismaLocale.NL,
  en: PrismaLocale.EN,
  ru: PrismaLocale.RU,
  uk: PrismaLocale.UK,
} as const;

export type SupportedLocale = keyof typeof supportedLocales;

export function parseLocale(value: string | null): PrismaLocale {
  const locale = value?.toLowerCase() ?? "en";

  if (locale in supportedLocales) {
    return supportedLocales[locale as SupportedLocale];
  }

  throw new Error("INVALID_LOCALE");
}
