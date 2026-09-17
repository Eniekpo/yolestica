import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { body, fail, HttpError } from "@/lib/http";
import { adminInquirySchema } from "@/lib/validation";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const input = await body(request);
    const user = await currentUser();
    if (user?.role !== "ADMIN")
      throw new HttpError(403, "Administrator access required.");
    const { id } = await params;
    z.uuid().parse(id);
    const data = adminInquirySchema.parse(input);
    await db.inquiry.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.note
          ? { notes: { create: { body: data.note, authorId: user.id } } }
          : {}),
      },
    });
    return NextResponse.json({ message: "Follow-up saved." });
  } catch (error) {
    return fail(error);
  }
}
