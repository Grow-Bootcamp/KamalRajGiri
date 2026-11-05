import type {
  MonthlyAnalytics,
  CategoryAnalytics,
  SkillAnalytics,
} from '../types/analytics';

export const monthlyAnalytics: MonthlyAnalytics[] = [
  { month: 'Jan', completed: 20, pending: 10, created: 30 },
  { month: 'Feb', completed: 35, pending: 15, created: 50 },
  { month: 'Mar', completed: 40, pending: 8, created: 48 },
  { month: 'Apr', completed: 32, pending: 12, created: 44 },
  { month: 'May', completed: 50, pending: 10, created: 60 },
  { month: 'Jun', completed: 60, pending: 5, created: 65 },
];

export const categoryAnalytics: CategoryAnalytics[] = [
  { category: 'Development', tasks: 45 },
  { category: 'Learning', tasks: 30 },
  { category: 'Testing', tasks: 15 },
  { category: 'Planning', tasks: 10 },
];

export const skillAnalytics: SkillAnalytics[] = [
  { subject: 'React', score: 85 },
  { subject: 'TypeScript', score: 75 },
  { subject: 'Node.js', score: 80 },
  { subject: 'Database', score: 65 },
  { subject: 'Testing', score: 70 },
];