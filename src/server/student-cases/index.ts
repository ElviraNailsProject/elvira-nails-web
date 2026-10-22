import type { Where } from "payload";
import { getCMS } from "@/cms/client";
import {
  studentCaseIdSchema,
  type PublicStudentCaseListQuery,
  type StudentCaseLocale,
  type StudentCasePage,
} from "@/features/student-cases/contracts";
import { ApiError } from "@/server/http";
import { publicCase } from "./mapper";

// Public reads deliberately carry no owner session, even when the owner views the website.
export const studentCases = {
  async listPublic(
    query: PublicStudentCaseListQuery,
  ): Promise<StudentCasePage> {
    const cms = await getCMS();
    const and: Where[] = [{ _status: { equals: "published" } }];
    if (query.status) and.push({ status: { equals: query.status } });
    if (query.q) and.push({ studentName: { contains: query.q } });
    const result = await cms.find({
      collection: "student-cases",
      where: { and },
      page: query.page,
      limit: query.pageSize,
      sort: "sortOrder",
      depth: 1,
      locale: "all",
      draft: false,
      overrideAccess: false,
    });
    return {
      items: result.docs.map((doc) => publicCase(doc, query.locale)),
      pagination: {
        page: result.page ?? 1,
        pageSize: result.limit,
        total: result.totalDocs,
        totalPages: result.totalPages,
      },
    };
  },
  async getPublic(id: string, locale: StudentCaseLocale) {
    if (!studentCaseIdSchema.safeParse(id).success)
      throw new ApiError(404, "CASE_NOT_FOUND", "Student case not found.");
    const cms = await getCMS();
    const result = await cms.find({
      collection: "student-cases",
      where: {
        and: [{ id: { equals: id } }, { _status: { equals: "published" } }],
      },
      limit: 1,
      depth: 1,
      locale: "all",
      draft: false,
      overrideAccess: false,
    });
    if (!result.docs[0])
      throw new ApiError(404, "CASE_NOT_FOUND", "Student case not found.");
    return publicCase(result.docs[0], locale);
  },
};
