export type Jobseeker = {
  plan?: "free" | "pro";
  locale?: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
    dob?: string;
    email?: string;
    phone?: string;
  };
  background_info?: {
    yoe?: number;
    summary?: string;
    interests?: string[];
  };
  skills?: string[];
  resume_summary?: string;
  created_at?: number;
};
