import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

export function apiError(error: unknown): Response {
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = Object.create(null);
    for (const issue of error.issues) {
      const field = issue.path.length ? issue.path.join(".") : "_form";
      (fields[field] ??= []).push(issue.message);
    }
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Check the highlighted fields.",
          fields,
        },
      },
      { status: 400, headers: PRIVATE_HEADERS },
    );
  }
  const known = error instanceof ApiError;
  return Response.json(
    {
      error: {
        code: known ? error.code : "INTERNAL_ERROR",
        message: known
          ? error.message
          : "Something went wrong. Please try again.",
      },
    },
    { status: known ? error.status : 500, headers: PRIVATE_HEADERS },
  );
}
