import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "./auth";

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json(
      { message: "Non autorisé" },
      { status: 401 }
    );
  }
  return null;
}
