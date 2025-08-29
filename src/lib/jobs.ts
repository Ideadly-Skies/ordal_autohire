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
  page?: number;
}): Promise<Job[]> {
  const { limit = 24, status = "open", order = "new", page = 1 } = opts ?? {};

  try {
    let q = db.collection("jobs") as FirebaseFirestore.Query;
    if (status) q = q.where("status", "==", status);
    q = q.orderBy("created_at", order === "new" ? "desc" : "asc");

    // Calculate how many docs to skip
    const skip = (page - 1) * limit;
    if (skip > 0) {
      // Firestore does not support offset efficiently, so we fetch and discard
      const prevSnap = await q.limit(skip).get();
      const last = prevSnap.docs[prevSnap.docs.length - 1];
      if (last) {
        q = q.startAfter(last);
      }
    }

    q = q.limit(limit);

    const snap = await q.get();
    return snap.docs.map((d) => {
      const { id, ...data } = d.data() as Job;
      return { id: d.id, ...data };
    });
  } catch (e: unknown) {
    // Fallback: filter by status and sort in memory
    const error = e as { code?: string; message?: string };
    if (
      String(error.code) === "9" ||
      /requires an index/i.test(String(error.message))
    ) {
      let q = db.collection("jobs") as FirebaseFirestore.Query;
      if (status) q = q.where("status", "==", status);
      // pull a bit more then sort locally
      const snap = await q.limit(Math.max(limit * (page + 2), 100)).get();
      const items = snap.docs.map((d) => {
        const data = d.data() as Job;
        const { id: _id, ...rest } = data;
        return { id: d.id, ...rest };
      });
      items.sort(
        (a, b) =>
          (Number(b.created_at ?? 0) - Number(a.created_at ?? 0)) *
          (order === "new" ? 1 : -1)
      );
      return items.slice((page - 1) * limit, page * limit);
    }
    throw e;
  }
}

export async function getJobsCount(opts?: {
  status?: "open" | "closed" | null;
}) {
  const { status = "open" } = opts ?? {};
  let q = db.collection("jobs") as FirebaseFirestore.Query;
  if (status) q = q.where("status", "==", status);
  const snap = await q.get();
  return snap.size;
}
