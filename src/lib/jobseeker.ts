export type Jobseeker = {
  plan?: "free" | "pro";
  locale?: string;
  personal_info?: {
    first_name?: string;
    last_name?: string;
    dob?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
  };
  background_info?: {
    yoe?: number;
    summary?: string;
    interests?: string[];
    title?: string;
    company?: string;
    employment_type?: string;
    start_date?: string;
    end_date?: string;
    duration?: string;
    description?: string;
  };
  skills?: string[];
  resume_summary?: string;
  created_at?: number;
  education?: Array<{
    institution?: string;
    degree?: string;
    field_of_study?: string;
    start_year?: string;
    end_year?: string;
  }>;
};
