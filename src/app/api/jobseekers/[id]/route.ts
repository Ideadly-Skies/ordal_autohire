import { NextResponse } from "next/server";
import { db } from "../../../../../server/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = decodeURIComponent(params.id);
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const snap = await db.collection("jobseekers").doc(id).get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id, data: snap.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String((err as Error)?.message || err) },
      { status: 500 }
    );
  }
}
