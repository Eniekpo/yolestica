import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { body, fail, HttpError } from "@/lib/http";
import { inquirySchema } from "@/lib/validation";
import { rateLimit, requestIp } from "@/lib/rate-limit";
export async function POST(request: Request) {
  try {
    const input = await body(request);
    const user = await currentUser();
    if (input.clientRequest && !user)
      throw new HttpError(401, "Please sign in again.");
    await rateLimit("inquiry:ip", requestIp(request), 20);
    const data = inquirySchema.parse(
      user
        ? {
            ...input,
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
          }
        : input,
    );
    await rateLimit("inquiry:email", data.email, 6);
    await db.inquiry.create({ data: { ...data, userId: user?.id ?? null } });
    return NextResponse.json(
      {
        message:
          "Thank you — your request has been saved. We’ll follow up using your contact details.",
      },
      { status: 201 },
    );
  } catch (error) {
    return fail(error);
  }
}
