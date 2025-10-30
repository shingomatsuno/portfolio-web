export interface UserSkill {
  user_id: string;
  skill_id: number;
}

export interface UserPr {
  id: string;
  user_id: string;
  pr_text: string;
}

export interface UserProject {
  id: string;
  user_id: string;
  period_from: string;
  period_to?: string | null;
  project_name: string;
  details: string;
  skills: number[];
}

export interface Profile {
  id: string;
  username: string;
  name: string;
  birthday: string | null;
  avatar_url: string | null;
  bio: string | null;
  github_url: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserFreeText {
  id: string;
  user_id: string;
  free_text: string;
}
