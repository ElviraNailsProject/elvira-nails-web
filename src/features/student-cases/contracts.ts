import { z } from "zod";

// Public website contract is independent of Payload's administrative document format.
export const studentCaseLocales = ["NL", "EN", "RU", "UK"] as const;
export const studentCaseStatuses = [
  "WAITING",
  "STUDYING",
  "COMPLETED",
] as const;
export const studentContactTypes = [
  "INSTAGRAM",
  "WHATSAPP",
  "TELEGRAM",
  "TIKTOK",
  "EMAIL",
  "WEBSITE",
] as const;
export type StudentCaseLocale = (typeof studentCaseLocales)[number];
export type StudentCaseStatus = (typeof studentCaseStatuses)[number];
export type StudentContactType = (typeof studentContactTypes)[number];

const queryInteger = (fallback: number, max: number) =>
  z
    .string()
    .regex(/^[1-9]\d*$/)
    .transform(Number)
    .pipe(z.number().int().min(1).max(max))
    .default(fallback);
const queryLocale = z
  .string()
  .trim()
  .toUpperCase()
  .pipe(z.enum(studentCaseLocales))
  .default("EN");
export const publicStudentCaseListQuerySchema = z
  .object({
    locale: queryLocale,
    q: z.string().trim().max(120).optional(),
    status: z.enum(studentCaseStatuses).optional(),
    page: queryInteger(1, 100000),
    pageSize: queryInteger(12, 50),
  })
  .strict();
export const publicStudentCaseDetailQuerySchema = z
  .object({ locale: queryLocale })
  .strict();
export const studentCaseIdSchema = z.uuid();
export type PublicStudentCaseListQuery = z.infer<
  typeof publicStudentCaseListQuerySchema
>;

export interface PublicStudentCaseDto {
  id: string;
  studentName: string;
  studentPhoto: string | null;
  city: string | null;
  status: StudentCaseStatus;
  locale: StudentCaseLocale;
  resultTitle: string;
  story: string;
  testimonial: string | null;
  contacts: { type: StudentContactType; value: string }[];
  images: { id: string; url: string; altText: string; isCover: boolean }[];
}
export interface StudentCasePage<T = PublicStudentCaseDto> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
