"use client";

import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { courseMessages } from "./courses.messages";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import { demoCourses } from "./courses.demo";
import { createCourseDraft } from "./courses.model";
import type { Course, CourseModule, CourseDeletion } from "./courses.types";
import { CourseCards } from "./CourseCards";
import { CourseProgram } from "./CourseProgram";
import { CourseDetails } from "./CourseDetails";
import formStyles from "../shared/styles/editor-form.module.css";

export function CoursesEditor({ addSignal = 0 }: { addSignal?: number }) {
  const { t } = useStudioTranslation(courseMessages);
  const [courses, setCourses, save] = useLocalDraft<Course[]>(
    "courses",
    demoCourses,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    courses[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<Course | null>(null);
  const [lastAddSignal, setLastAddSignal] = useState(addSignal);
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [draggedModule, setDraggedModule] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<CourseDeletion | null>(null);
  const [message, setMessage] = useState<keyof typeof courseMessages | "">("");
  const [uploading, setUploading] = useState(false);
  const coverRequest = useRef(0);
  useLayoutEffect(
    () => () => {
      coverRequest.current += 1;
    },
    [addSignal],
  );
  const current = draft ?? courses.find((course) => course.id === selectedId);
  const isNew =
    !!current && !courses.some((course) => course.id === current.id);

  if (lastAddSignal !== addSignal) {
    setLastAddSignal(addSignal);
    const course = createCourseDraft();
    setSelectedId(course.id);
    setDraft(course);
    setEditingModule(null);
    setMessage("");
    setUploading(false);
  }

  function cancelCover() {
    coverRequest.current += 1;
    setUploading(false);
  }

  function update(patch: Partial<Course>) {
    if (current) setDraft({ ...current, ...patch });
    setMessage("");
  }

  function selectCourse(course: Course) {
    cancelCover();
    setSelectedId(course.id);
    setDraft(null);
    setEditingModule(null);
    setMessage("");
  }

  function changeModule(id: string, patch: Partial<CourseModule>) {
    if (current)
      update({
        modules: current.modules.map((module) =>
          module.id === id ? { ...module, ...patch } : module,
        ),
      });
  }

  function addModule() {
    if (!current) return;
    const courseModule: CourseModule = {
      id: crypto.randomUUID(),
      title: t("newModule"),
      hours: 1,
      topics: [],
    };
    update({ modules: [...current.modules, courseModule] });
    setEditingModule(courseModule.id);
  }

  function moveModule(from: number, to: number) {
    if (!current || from < 0 || to < 0 || to >= current.modules.length) return;
    const modules = [...current.modules];
    const [courseModule] = modules.splice(from, 1);
    modules.splice(to, 0, courseModule);
    update({ modules });
  }

  function saveCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || uploading) return;
    if (
      !current.title.trim() ||
      current.modules.some(
        (module) =>
          !module.title.trim() ||
          !Number.isFinite(module.hours) ||
          module.hours <= 0 ||
          module.topics.some((topic) => !topic.title.trim()),
      )
    ) {
      setMessage("validationError");
      return;
    }
    const cleaned = {
      ...current,
      title: current.title.trim(),
      modules: current.modules.map((module) => ({
        ...module,
        title: module.title.trim(),
        topics: module.topics.map((topic) => ({
          ...topic,
          title: topic.title.trim(),
        })),
      })),
    };
    const next = isNew
      ? [...courses, cleaned]
      : courses.map((course) => (course.id === cleaned.id ? cleaned : course));
    if (save(next)) {
      setCourses(next);
      setDraft(null);
      setEditingModule(null);
    }
  }

  function cancelChanges() {
    cancelCover();
    setDraft(null);
    setEditingModule(null);
    if (isNew) setSelectedId(courses[0]?.id ?? null);
    setMessage("");
  }

  function confirmDelete() {
    if (!deleting) return;
    cancelCover();
    if (deleting.kind === "module" && current) {
      update({
        modules: current.modules.filter((module) => module.id !== deleting.id),
      });
      setEditingModule(null);
      setDeleting(null);
      return;
    }
    const next = courses.filter((course) => course.id !== deleting.id);
    if (save(next)) {
      setCourses(next);
      setSelectedId(next[0]?.id ?? null);
      setDraft(null);
      setDeleting(null);
      setEditingModule(null);
    } else {
      setMessage("deleteFailed");
    }
  }

  function changeCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !current) return;
    cancelCover();
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 1_000_000
    ) {
      setMessage("imageLimit");
      return;
    }
    const courseId = current.id;
    const request = ++coverRequest.current;
    setUploading(true);
    setMessage("");
    const fail = () => {
      if (coverRequest.current !== request) return;
      setUploading(false);
      setMessage("imageInvalid");
    };
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return fail();
      if (coverRequest.current !== request) return;
      const src = reader.result;
      const image = new window.Image();
      image.onload = () => {
        if (coverRequest.current !== request) return;
        setDraft((previous) => {
          const course = previous ?? current;
          return course.id === courseId ? { ...course, image: src } : previous;
        });
        setUploading(false);
      };
      image.onerror = fail;
      image.src = src;
    };
    reader.onerror = fail;
    reader.readAsDataURL(file);
  }

  return (
    <div className={formStyles.columns}>
      <section className={formStyles.mainColumn} aria-label={t("curriculum")}>
        <CourseCards
          courses={courses}
          selectedId={selectedId}
          onSelect={selectCourse}
        />
        {current ? (
          <CourseProgram
            current={current}
            editingModule={editingModule}
            draggedModule={draggedModule}
            setEditingModule={setEditingModule}
            setDraggedModule={setDraggedModule}
            changeModule={changeModule}
            addModule={addModule}
            moveModule={moveModule}
            onDeleteModule={(id) => setDeleting({ kind: "module", id })}
          />
        ) : (
          <p className={formStyles.empty}>{t("emptyCourses")}</p>
        )}
      </section>
      {current ? (
        <CourseDetails
          current={current}
          isNew={isNew}
          hasChanges={draft !== null}
          uploading={uploading}
          message={message ? t(message) : ""}
          update={update}
          onSave={saveCourse}
          onCoverChange={changeCover}
          onCancel={cancelChanges}
          onDelete={(id) => setDeleting({ kind: "course", id })}
        />
      ) : (
        <aside className={`${formStyles.panel} ${formStyles.emptyPanel}`}>
          <h2>{t("details")}</h2>
          <p>{t("selectCourse")}</p>
        </aside>
      )}
      {deleting && (
        <ConfirmDialog
          title={
            deleting.kind === "course"
              ? t("deleteCourseTitle")
              : t("deleteModuleTitle")
          }
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        >
          {deleting.kind === "course"
            ? t("deleteCourseDescription")
            : t("deleteModuleDescription")}
          {message === "deleteFailed" ? <p role="alert">{t(message)}</p> : null}
        </ConfirmDialog>
      )}
    </div>
  );
}
