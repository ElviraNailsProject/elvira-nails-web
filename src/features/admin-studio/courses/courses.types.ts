export type Topic = { id: string; title: string };
export type CourseModule = {
  id: string;
  title: string;
  hours: number;
  topics: Topic[];
};
export type Course = {
  id: string;
  title: string;
  price: number;
  days: number;
  format: string;
  included: string[];
  open: boolean;
  modules: CourseModule[];
  image?: string;
};

export type CourseDeletion = { kind: "course" | "module"; id: string };
