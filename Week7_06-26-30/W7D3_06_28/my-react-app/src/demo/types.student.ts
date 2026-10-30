export type Student = {
  id: number;
  name: string;
  age: number;
  city?: string;
  isEnrolled?: boolean;
  courses: string[];
};