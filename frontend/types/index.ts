// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// ─── Portfolio ────────────────────────────────────────────────────────────────
export interface Portfolio {
  id?: number;
  user_id?: number;
  headline?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  avatar_url?: string;
  cv_url?: string;
}

export interface Skill {
  id: number;
  user_id: number;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  created_at: string;
}

export interface Experience {
  id: number;
  user_id: number;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

export interface Project {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  tech_stack?: string;
  project_url?: string;
  github_url?: string;
  image_url?: string;
  created_at: string;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────
export interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  type: string;
  category: string;
  tags: string[];
  url: string;
  description: string;
  salary?: string;
  published_at: string;
}

// ─── Applications ─────────────────────────────────────────────────────────────
export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface JobApplication {
  id: number;
  user_id: number;
  job_id: string;
  job_title: string;
  company_name: string;
  job_url?: string;
  location?: string;
  job_type?: string;
  status: ApplicationStatus;
  notes?: string;
  applied_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  withdrawn: number;
  total: number;
}
