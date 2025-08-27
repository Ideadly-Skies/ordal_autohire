import { Jobseeker } from "./jobseeker";

export async function fetchJobseeker(userId: string): Promise<Jobseeker | null> {
  const res = await fetch(`/api/jobseekers/${encodeURIComponent(userId)}`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json?.data ?? null;
}
