import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { courseMessages } from "./courses.messages";
import { Button, Icon } from "../shared/ui/controls";
import type { Course, CourseModule } from "./courses.types";
import { totalHours } from "./courses.model";
import formStyles from "../shared/styles/editor-form.module.css";
import styles from "./CourseProgram.module.css";

type CourseProgramProps = {
  current: Course;
  editingModule: string | null;
  draggedModule: string | null;
  setEditingModule: (id: string | null) => void;
  setDraggedModule: (id: string | null) => void;
  changeModule: (id: string, patch: Partial<CourseModule>) => void;
  addModule: () => void;
  moveModule: (from: number, to: number) => void;
  onDeleteModule: (id: string) => void;
};

export function CourseProgram({
  current,
  editingModule,
  draggedModule,
  setEditingModule,
  setDraggedModule,
  changeModule,
  addModule,
  moveModule,
  onDeleteModule,
}: CourseProgramProps) {
  const { t } = useStudioTranslation(courseMessages);
  return (
    <section className={styles.program} aria-label={t("modules")}>
      <header className={styles.programHeader}>
        <h2>
          {t("programmeTitle", { title: current.title || t("newCourse") })}
        </h2>
        <small>
          {t("programmeSummary", {
            modules: current.modules.length,
            hours: totalHours(current),
          })}
        </small>
      </header>
      <div className={styles.modules}>
        {current.modules.map((module, index) => (
          <article
            key={module.id}
            className={`${styles.module} ${draggedModule === module.id ? styles.dragging : ""}`}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedModule)
                moveModule(
                  current.modules.findIndex(
                    (item) => item.id === draggedModule,
                  ),
                  index,
                );
              setDraggedModule(null);
            }}
          >
            <button
              type="button"
              className={styles.dragHandle}
              draggable
              aria-label={t("moveModule", { title: module.title })}
              onDragStart={() => setDraggedModule(module.id)}
              onDragEnd={() => setDraggedModule(null)}
              onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                  event.preventDefault();
                  moveModule(index, index + (event.key === "ArrowUp" ? -1 : 1));
                }
              }}
            >
              {Array.from({ length: 6 }, (_, dot) => (
                <Icon name="drag-dot" key={dot} />
              ))}
            </button>
            <span className={styles.moduleNumber}>{index + 1}</span>
            <div className={styles.moduleContent}>
              {editingModule === module.id ? (
                <>
                  <div className={styles.moduleEditHeading}>
                    <label className={formStyles.field}>
                      <span>{t("moduleName")}</span>
                      <input
                        aria-label={t("moduleNameLabel", { index: index + 1 })}
                        value={module.title}
                        maxLength={120}
                        onChange={(event) =>
                          changeModule(module.id, {
                            title: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label className={formStyles.field}>
                      <span>{t("hours")}</span>
                      <input
                        aria-label={t("moduleHours", { index: index + 1 })}
                        type="number"
                        min={0.5}
                        max={200}
                        step={0.5}
                        value={module.hours}
                        onChange={(event) =>
                          changeModule(module.id, {
                            hours: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                  </div>
                  <div className={styles.topicInputs}>
                    {module.topics.map((topic, topicIndex) => (
                      <div key={topic.id}>
                        <input
                          value={topic.title}
                          aria-label={t("topicLabel", {
                            topic: topicIndex + 1,
                            module: index + 1,
                          })}
                          maxLength={200}
                          onChange={(event) =>
                            changeModule(module.id, {
                              topics: module.topics.map((item) =>
                                item.id === topic.id
                                  ? { ...item, title: event.target.value }
                                  : item,
                              ),
                            })
                          }
                        />
                        <button
                          type="button"
                          className={formStyles.iconButton}
                          aria-label={t("deleteTopic", {
                            topic: topicIndex + 1,
                            module: index + 1,
                          })}
                          onClick={() =>
                            changeModule(module.id, {
                              topics: module.topics.filter(
                                (item) => item.id !== topic.id,
                              ),
                            })
                          }
                        >
                          <Icon name="delete" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.editorTools}>
                    <Button
                      className={formStyles.compactButton}
                      onClick={() => setEditingModule(null)}
                    >
                      {t("done")}
                    </Button>
                    <button
                      type="button"
                      className={formStyles.textButton}
                      disabled={index === 0}
                      onClick={() => moveModule(index, index - 1)}
                    >
                      {t("moveUp")}
                    </button>
                    <button
                      type="button"
                      className={formStyles.textButton}
                      disabled={index === current.modules.length - 1}
                      onClick={() => moveModule(index, index + 1)}
                    >
                      {t("moveDown")}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{module.title}</h3>
                  <ul className={styles.topics}>
                    {module.topics.map((topic) => (
                      <li key={topic.id}>{topic.title}</li>
                    ))}
                  </ul>
                </>
              )}
              <button
                type="button"
                className={formStyles.textButton}
                onClick={() => {
                  changeModule(module.id, {
                    topics: [
                      ...module.topics,
                      { id: crypto.randomUUID(), title: "" },
                    ],
                  });
                  setEditingModule(module.id);
                }}
              >
                {t("addTopic")}
              </button>
            </div>
            <div className={styles.moduleActions}>
              <span>{t("hoursShort", { hours: module.hours })}</span>
              <button
                type="button"
                className={formStyles.iconButton}
                aria-label={t("editModule", { title: module.title })}
                onClick={() =>
                  setEditingModule(
                    editingModule === module.id ? null : module.id,
                  )
                }
              >
                <Icon name="edit" />
              </button>
              <button
                type="button"
                className={formStyles.iconButton}
                aria-label={t("deleteModule", { title: module.title })}
                onClick={() => onDeleteModule(module.id)}
              >
                <Icon name="delete" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <button
        type="button"
        className={formStyles.dashedButton}
        onClick={addModule}
      >
        <Icon name="add" />
        {t("addModule")}
      </button>
    </section>
  );
}
