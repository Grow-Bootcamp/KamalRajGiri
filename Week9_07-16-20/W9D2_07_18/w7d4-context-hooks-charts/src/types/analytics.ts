export interface MonthlyAnalytics {
  month: string;
  completed: number;
  pending: number;
  created: number;
}

export interface CategoryAnalytics {
  category: string;
  tasks: number;
}

export interface SkillAnalytics {
  subject: string;
  score: number;
}