import { publicStudentCaseListQuerySchema } from "@/features/student-cases/contracts";
import { apiError } from "@/server/http";
import { studentCases } from "@/server/student-cases";
import { caseJson, studentCaseQuery } from "@/server/student-cases/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const query = publicStudentCaseListQuerySchema.parse(
      studentCaseQuery(request),
    );
    return caseJson(await studentCases.listPublic(query));
  } catch (error) {
    return apiError(error);
  }
}
