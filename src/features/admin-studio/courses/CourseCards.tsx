import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { courseMessages } from "./courses.messages";
import type { Course } from "./courses.types";
import { totalHours } from "./courses.model";
import styles from "./CourseCards.module.css";

type CourseCardsProps = {
  courses: Course[];
  selectedId: string | null;
  onSelect: (course: Course) => void;
};

export function CourseCards({
  courses,
  selectedId,
  onSelect,
}: CourseCardsProps) {
  const { t } = useStudioTranslation(courseMessages);
  return (
    <div className={styles.courseCards}>
      {courses.map((course) => (
        <button
          type="button"
          key={course.id}
          className={styles.courseCard}
          aria-pressed={selectedId === course.id}
          onClick={() => onSelect(course)}
        >
          <strong>{course.title}</strong>
          <small>
            {t("courseSummary", {
              days: course.days,
              hours: totalHours(course),
              modules: course.modules.length,
            })}
          </small>
          <span>{course.price} €</span>
        </button>
      ))}
    </div>
  );
}
