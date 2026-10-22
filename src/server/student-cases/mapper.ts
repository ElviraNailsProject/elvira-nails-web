import type {
  PublicStudentCaseDto,
  StudentCaseLocale,
} from "@/features/student-cases/contracts";
import type { StudentCase, Media } from "@/cms/payload-types";

function translated(value: unknown, locale: string): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && locale in value) {
    const result = (value as Record<string, unknown>)[locale];
    return typeof result === "string" ? result : "";
  }
  return "";
}

function image(value: string | Media | null | undefined) {
  if (!value || typeof value !== "object" || !value.url) return null;
  const parsed = new URL(value.url, "http://local.invalid");
  if (!parsed.pathname.startsWith("/api/cms/media/file/")) return null;
  return { id: value.id, url: parsed.pathname, altText: value.alt };
}

export function publicCase(
  doc: StudentCase,
  requested: StudentCaseLocale,
): PublicStudentCaseDto {
  const candidates = [requested.toLowerCase(), "en", "nl", "ru", "uk"];
  const locale =
    candidates.find(
      (candidate) =>
        translated(doc.resultTitle, candidate).trim() &&
        translated(doc.story, candidate).trim(),
    ) || requested.toLowerCase();
  return {
    id: doc.id,
    studentName: doc.studentName,
    studentPhoto: image(doc.photo)?.url ?? null,
    city: doc.city || null,
    status: doc.status,
    locale: locale.toUpperCase() as StudentCaseLocale,
    resultTitle: translated(doc.resultTitle, locale),
    story: translated(doc.story, locale),
    testimonial: translated(doc.testimonial, locale) || null,
    contacts: doc.publishContacts
      ? (doc.contacts ?? []).map(({ type, value }) => ({ type, value }))
      : [],
    images: (doc.gallery ?? []).flatMap((row) => {
      if (!row.isPublished) return [];
      const file = image(row.image);
      return file ? [{ ...file, isCover: row.isCover === true }] : [];
    }),
  };
}
