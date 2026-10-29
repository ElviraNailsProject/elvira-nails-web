export const studioLocales = ["ru", "uk", "en", "nl"] as const;
export type StudioLocale = (typeof studioLocales)[number];
export type StudioMessages = Record<string, Record<StudioLocale, string>>;
export type StudioParams = Record<string, string | number>;

export function getStudioLocale(language: string): StudioLocale {
  const locale = language.toLowerCase().split(/[-_]/)[0];
  return studioLocales.includes(locale as StudioLocale)
    ? (locale as StudioLocale)
    : "ru";
}

export function translateStudioMessage<T extends StudioMessages>(
  locale: StudioLocale,
  messages: T,
  key: keyof T & string,
  params: StudioParams = {},
): string {
  const message = messages[key]?.[locale] ?? messages[key]?.ru ?? key;
  return message.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    Object.hasOwn(params, name) ? String(params[name]) : placeholder,
  );
}
