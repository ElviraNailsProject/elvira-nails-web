import { publicStudentCaseDetailQuerySchema } from "@/features/student-cases/contracts";
import { apiError } from "@/server/http";
import { studentCases } from "@/server/student-cases";
import { caseJson, studentCaseQuery } from "@/server/student-cases/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { locale } = publicStudentCaseDetailQuerySchema.parse(
      studentCaseQuery(request),
    );
    const { id } = await context.params;
    return caseJson({ data: await studentCases.getPublic(id, locale) });
  } catch (error) {
    return apiError(error);
  }
}
