import type { Course } from "./courses.types";

export const totalHours = (course: Course) =>
  course.modules.reduce((total, module) => total + module.hours, 0);

export function createCourseDraft(): Course {
  return {
    id: crypto.randomUUID(),
    title: "",
    price: 0,
    days: 1,
    format: "Офлайн, группа до 4 человек",
    included: [],
    open: false,
    modules: [],
  };
}
