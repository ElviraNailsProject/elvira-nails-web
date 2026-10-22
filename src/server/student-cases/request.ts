import { ApiError } from "@/server/http";

/** Reject ambiguous repeated query parameters instead of silently choosing one. */
export function studentCaseQuery(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const result: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    if (key in result)
      throw new ApiError(
        400,
        "INVALID_QUERY",
        "Query parameters must not be repeated.",
      );
    result[key] = value;
  }
  return result;
}

export function caseJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
}
