// src/app/api/jobseekers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const docId = decodeURIComponent(id);

    if (!docId) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const snap = await db.collection("jobseekers").doc(docId).get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id: docId, data: snap.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String((err as Error)?.message || err) },
      { status: 500 }
    );
  }
}
