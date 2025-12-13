import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";
import { ensureGameCollections, getDb } from "@/lib/db";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return { ok: false as const, res: NextResponse.json({ error: "Not authenticated" }, { status: 401 }) };

  try {
    const auth = await verifyAuthToken(token);
    return { ok: true as const, auth };
  } catch {
    return { ok: false as const, res: NextResponse.json({ error: "Invalid token" }, { status: 401 }) };
  }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  await ensureGameCollections();
  const gate = await requireAdmin();
  if (!gate.ok) return gate.res;

  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = await getDb();
  const blacklist = db.collection("blacklist");

  const result = await blacklist.deleteOne({ _id: new ObjectId(id) });
  if (!result.deletedCount) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
