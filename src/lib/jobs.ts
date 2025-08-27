// src/lib/jobs.ts
import { db } from "../../server/firebaseAdmin";

export type Job = {
  id: string;
  title: string;
  company: string;
  description?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  created_at?: number;
  poster_id?: string;
  edition_prices?: Record<string, number>;
  status?: string;
};

export async function listJobs(opts?: {
  limit?: number;
  status?: "open" | "closed" | null;
  order?: "new" | "old";
}): Promise<Job[]> {
  const { limit = 24, status = "open", order = "new" } = opts ?? {};

  try {
    // Try indexed query first (needs composite index)
    let q = db.collection("jobs") as FirebaseFirestore.Query;
    if (status) q = q.where("status", "==", status);
    q = q.orderBy("created_at", order === "new" ? "desc" : "asc").limit(limit);

    const snap = await q.get();
    return snap.docs.map((d) => {
      const { id, ...data } = d.data() as Job;
      return { id: d.id, ...data };
    });
  } catch (e: unknown) {
    // If no index, fall back: filter by status and sort in memory
    const error = e as { code?: string; message?: string };
    if (String(error.code) === "9" || /requires an index/i.test(String(error.message))) {
      let q = db.collection("jobs") as FirebaseFirestore.Query;
      if (status) q = q.where("status", "==", status);
      // pull a bit more then sort locally
      const snap = await q.limit(Math.max(limit, 100)).get();
      const items = snap.docs.map((d) => {
        const data = d.data() as Job;
        const { id: _id, ...rest } = data;
        return { id: d.id, ...rest };
      });
      items.sort((a, b) =>
        (Number(b.created_at ?? 0) - Number(a.created_at ?? 0)) *
        (order === "new" ? 1 : -1)
      );
      return items.slice(0, limit);
    }
    throw e;
  }
}