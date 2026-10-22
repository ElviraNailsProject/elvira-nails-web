import { ZodError } from "zod";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly fields?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const PRIVATE_HEADERS = {
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
        ...(known && error.fields ? { fields: error.fields } : {}),
      },
    },
    { status: known ? error.status : 500, headers: PRIVATE_HEADERS },
  );
}

/** Cookie-authenticated mutations require an explicit browser Origin. */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const expected = process.env.APP_ORIGIN || new URL(request.url).origin;
  let valid = false;
  try {
    valid = Boolean(
      origin && new URL(origin).origin === new URL(expected).origin,
    );
  } catch {
    valid = false;
  }
  if (!valid || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new ApiError(
      403,
      "INVALID_ORIGIN",
      "This request origin is not allowed.",
    );
  }
}

/** Never trust Content-Length alone: it may be absent or deliberately incorrect. */
export async function readBody(
  request: Request,
  maxBytes: number,
): Promise<Uint8Array> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new ApiError(413, "BODY_TOO_LARGE", "The request is too large.");
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new ApiError(413, "BODY_TOO_LARGE", "The request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function readJson(
  request: Request,
  maxBytes = 256 * 1024,
): Promise<unknown> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim() !==
    "application/json"
  ) {
    throw new ApiError(
      415,
      "UNSUPPORTED_CONTENT_TYPE",
      "Use application/json.",
    );
  }
  const bytes = await readBody(request, maxBytes);
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new ApiError(
      400,
      "INVALID_JSON",
      "The request must contain valid JSON.",
    );
  }
}
