import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { body, fail, HttpError } from "@/lib/http";
import { profileSchema } from "@/lib/validation";
export async function POST(request: Request) {
  try {
    const input = await body(request);
    const user = await currentUser();
    if (!user) throw new HttpError(401, "Please sign in again.");
    const data = profileSchema.parse(input);
    await db.user.update({ where: { id: user.id }, data });
    return NextResponse.json({ message: "Your profile has been updated." });
  } catch (error) {
    return fail(error);
  }
}
