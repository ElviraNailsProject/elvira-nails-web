export const trainingStatuses = [
  { label: "Учится", value: "STUDYING" },
  { label: "В ожидании", value: "WAITING" },
  { label: "Закончила", value: "COMPLETED" },
] as const;

export const contactTypes = [
  "INSTAGRAM",
  "WHATSAPP",
  "TELEGRAM",
  "TIKTOK",
  "EMAIL",
  "WEBSITE",
] as const;

export type MediaReference =
  string | number | { id: string | number } | null | undefined;

export interface GalleryRow {
  image?: MediaReference;
  isPublished?: boolean | null;
  isCover?: boolean | null;
}

export interface CaseMediaReferences {
  photo?: MediaReference;
  gallery?: GalleryRow[] | null;
}

export function mediaID(value: MediaReference): string | undefined {
  if (typeof value === "string" || typeof value === "number")
    return String(value);
  if (value && (typeof value.id === "string" || typeof value.id === "number"))
    return String(value.id);
  return undefined;
}

/** Check each gallery row together: separate array query conditions can match different rows. */
export function visibleMediaIDs(doc: CaseMediaReferences): string[] {
  const ids = new Set<string>();
  const portrait = mediaID(doc.photo);
  if (portrait) ids.add(portrait);
  for (const row of doc.gallery ?? []) {
    const id = mediaID(row.image);
    if (row.isPublished === true && id) ids.add(id);
  }
  return [...ids];
}

export function validateGallery(
  value: unknown[] | null | undefined,
): string | true {
  if (!value) return true;
  if (value.some((row) => !row || typeof row !== "object"))
    return "Выберите фотографию для каждой строки галереи.";
  const rows = value as GalleryRow[];
  if (!rows) return true;
  if (rows.length > 40) return "В галерее может быть не больше 40 фотографий.";
  const ids = rows.map((row) => mediaID(row.image)).filter(Boolean);
  if (new Set(ids).size !== ids.length)
    return "Не добавляйте одну фотографию в галерею дважды.";
  if (rows.filter((row) => row.isCover).length > 1)
    return "Выберите только одну обложку.";
  if (rows.some((row) => row.isCover && !row.isPublished))
    return "Обложка должна быть видна посетителям.";
  return true;
}

export function validateContacts(
  rows: unknown[] | null | undefined,
): string | true {
  if (!rows) return true;
  if (rows.length > 6) return "Добавьте не больше шести контактов.";
  const types = rows.map((row) =>
    row && typeof row === "object" && "type" in row ? row.type : undefined,
  );
  return (
    new Set(types).size === rows.length || "Оставьте один контакт каждого типа."
  );
}

export function validateContactValue(
  type: unknown,
  value: unknown,
): string | true {
  if (typeof value !== "string" || !value.trim()) return "Введите контакт.";
  if (value.length > 254 || /[\u0000-\u001f\u007f]/.test(value))
    return "Введите корректный контакт длиной до 254 символов.";
  const trimmed = value.trim();
  if (type === "EMAIL" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed))
    return "Введите корректный email.";
  if (type === "WEBSITE") {
    try {
      const url = new URL(trimmed);
      if (url.protocol !== "https:" || url.username || url.password)
        return "Укажите полный HTTPS-адрес без логина и пароля.";
    } catch {
      return "Укажите полный HTTPS-адрес сайта.";
    }
  }
  if (type === "WHATSAPP" && !/^\+?[1-9][\d\s()-]{5,24}$/.test(trimmed))
    return "Укажите телефон с кодом страны.";
  if (
    (type === "INSTAGRAM" || type === "TIKTOK") &&
    !/^@?[a-zA-Z0-9._]{1,30}$/.test(trimmed)
  )
    return "Укажите имя профиля, например @sofia.nails.";
  if (
    type === "TELEGRAM" &&
    !/^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(trimmed) &&
    !/^\+?[1-9][\d\s()-]{5,24}$/.test(trimmed)
  )
    return "Укажите имя Telegram или телефон с кодом страны.";
  return true;
}

export function redactCaseForPublic<
  T extends {
    contacts?: unknown;
    publishContacts?: boolean | null;
    gallery?: GalleryRow[] | null;
  },
>(doc: T): T {
  return {
    ...doc,
    contacts: doc.publishContacts === true ? (doc.contacts ?? []) : [],
    gallery: doc.gallery?.filter((row) => row.isPublished === true) ?? [],
  };
}
