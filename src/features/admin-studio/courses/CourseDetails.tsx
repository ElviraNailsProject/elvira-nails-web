import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import {
  courseMessages,
  courseFormatKeys,
  courseInclusionKeys,
} from "./courses.messages";
import Image from "next/image";
import { useRef, type ChangeEvent, type FormEvent } from "react";
import { Button, Toggle } from "../shared/ui/controls";
import { includedOptions } from "./courses.demo";
import type { Course } from "./courses.types";
import formStyles from "../shared/styles/editor-form.module.css";
import styles from "./CourseDetails.module.css";

type CourseDetailsProps = {
  current: Course;
  isNew: boolean;
  hasChanges: boolean;
  uploading: boolean;
  message: string;
  update: (patch: Partial<Course>) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onCoverChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
};

export function CourseDetails({
  current,
  isNew,
  hasChanges,
  uploading,
  message,
  update,
  onSave,
  onCoverChange,
  onCancel,
  onDelete,
}: CourseDetailsProps) {
  const { t } = useStudioTranslation(courseMessages);
  const fileInput = useRef<HTMLInputElement>(null);
  return (
    <aside className={formStyles.panel} aria-label={t("details")}>
      <div className={formStyles.panelHeader}>
        <h2>{isNew ? t("newCourse") : t("details")}</h2>
      </div>
      <form className={formStyles.panelBody} onSubmit={onSave}>
        <section className={styles.courseCoverSection}>
          <h3>{t("cover")}</h3>
          <div className={styles.courseCover}>
            {current.image ? (
              <Image
                src={current.image}
                alt={t("coverAlt", { title: current.title || t("newCourse") })}
                fill
                sizes="320px"
                unoptimized
              />
            ) : (
              <span>{t("coverPlaceholder")}</span>
            )}
          </div>
          <Button
            className={formStyles.compactButton}
            onClick={() => fileInput.current?.click()}
          >
            {t("replaceCover")}
          </Button>
          <input
            ref={fileInput}
            hidden
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label={t("cover")}
            onChange={onCoverChange}
          />
        </section>
        <section className={formStyles.formSection}>
          <label className={formStyles.field}>
            <span>{t("courseName")}</span>
            <input
              required
              maxLength={120}
              value={current.title}
              onChange={(event) => update({ title: event.target.value })}
            />
          </label>
          <div className={formStyles.fieldPair}>
            <label className={formStyles.field}>
              <span>{t("price")}</span>
              <input
                required
                type="number"
                min={0}
                max={10000}
                step={0.5}
                value={current.price}
                onChange={(event) =>
                  update({ price: Number(event.target.value) })
                }
              />
            </label>
            <label className={formStyles.field}>
              <span>{t("days")}</span>
              <input
                required
                type="number"
                min={1}
                max={365}
                value={current.days}
                onChange={(event) =>
                  update({ days: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <label className={formStyles.field}>
            <span>{t("format")}</span>
            <select
              value={current.format}
              onChange={(event) => update({ format: event.target.value })}
            >
              {Object.entries(courseFormatKeys).map(([value, key]) => (
                <option key={value} value={value}>
                  {t(key)}
                </option>
              ))}
            </select>
          </label>
        </section>
        <fieldset className={styles.inclusions}>
          <legend>{t("included")}</legend>
          {includedOptions.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={current.included.includes(option)}
                onChange={(event) =>
                  update({
                    included: event.target.checked
                      ? [...current.included, option]
                      : current.included.filter((item) => item !== option),
                  })
                }
              />
              <span>{t(courseInclusionKeys[option])}</span>
            </label>
          ))}
        </fieldset>
        <div className={styles.enrollment}>
          <div>
            <h3>{t("enrolment")}</h3>
            <small>{t("enrolmentHint")}</small>
          </div>
          <Toggle
            label={t("enrolment")}
            checked={current.open}
            onChange={(open) => update({ open })}
          />
        </div>
        {message && (
          <p role="status" className={formStyles.feedback}>
            {message}
          </p>
        )}
        <div className={formStyles.formActions}>
          <Button onClick={() => (isNew ? onCancel() : onDelete(current.id))}>
            {isNew ? t("cancel") : t("deleteCourse")}
          </Button>
          <Button type="submit" variant="primary" disabled={uploading}>
            {uploading ? t("uploading") : t("save")}
          </Button>
        </div>
        {hasChanges && !isNew && (
          <button
            type="button"
            className={formStyles.cancelLink}
            onClick={onCancel}
          >
            {t("cancelChanges")}
          </button>
        )}
      </form>
    </aside>
  );
}
