import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function body(request: Request) {
  const expected = new URL(process.env.APP_URL || "http://localhost:3000")
    .origin;
  if (request.headers.get("origin") !== expected)
    throw new HttpError(
      403,
      "This request could not be verified. Reload the page and try again.",
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(415, "Expected JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Missing request body.");
  let size = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 24000) {
      await reader.cancel();
      throw new HttpError(413, "This submission is too large.");
    }
    chunks.push(value);
  }
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("Invalid object");
    return parsed;
  } catch {
    throw new HttpError(400, "Invalid request body.");
  }
}
export function fail(error: unknown) {
  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) {
      const k = String(issue.path[0] || "form");
      fields[k] ??= issue.message;
    }
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields },
      { status: 400 },
    );
  }
  if (error instanceof HttpError)
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  )
    return NextResponse.json(
      {
        error:
          "An account could not be created with these details. Try signing in or resetting your password.",
      },
      { status: 409 },
    );
  console.error(
    "Request failed:",
    error instanceof Error ? error.name : "UnknownError",
  );
  return NextResponse.json(
    {
      error:
        "We couldn’t complete your request. Please try again shortly or contact us on WhatsApp.",
    },
    { status: 503 },
  );
}
