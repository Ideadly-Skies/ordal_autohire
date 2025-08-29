export interface Job {
  id?: string;
  title: string;
  company: string;
  location: string;
  work_mode: string;
  type: string;
  salary_min: string;
  salary_max: string;
  experience: string;
  created_at: string;
  applicants: number;
  description: string;
  requirements: string[];
  offers: string[];
  poster_id?: string;
  poster_name?: string;
  status: "open" | "closed"; // Made required with specific values
}
