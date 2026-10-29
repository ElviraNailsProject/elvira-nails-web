import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { serviceMessages, serviceCategoryKeys } from "./services.messages";
import Image from "next/image";
import { useRef, type ChangeEvent, type FormEvent } from "react";
import { Button, Icon } from "../shared/ui/controls";
import { categories } from "./services.demo";
import type { Category, Service } from "./services.types";
import { ServiceAddOns } from "./ServiceAddOns";
import formStyles from "../shared/styles/editor-form.module.css";
import styles from "./ServiceDetails.module.css";

type ServiceDetailsProps = {
  current: Service;
  isNew: boolean;
  hasChanges: boolean;
  uploading: boolean;
  message: string;
  update: (patch: Partial<Service>) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export function ServiceDetails({
  current,
  isNew,
  hasChanges,
  uploading,
  message,
  update,
  onSave,
  onPhotoChange,
  onCancel,
  onClose,
  onDelete,
}: ServiceDetailsProps) {
  const { t } = useStudioTranslation(serviceMessages);
  const upload = useRef<HTMLInputElement>(null);
  return (
    <aside className={formStyles.panel} aria-label={t("details")}>
      <div className={`${formStyles.panelHeader} ${styles.servicePanelHeader}`}>
        <h2>{isNew ? t("newService") : t("details")}</h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label={t("closeDetails")}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </div>
      <form className={formStyles.panelBody} onSubmit={onSave}>
        <section className={styles.photoSection}>
          <h3>{t("servicePhoto")}</h3>
          <div className={styles.photoUpload}>
            <div className={styles.photoPreview}>
              {current.image ? (
                <Image
                  src={current.image}
                  alt={t("photoAlt", {
                    title: current.title || t("newService"),
                  })}
                  width={96}
                  height={96}
                  unoptimized
                />
              ) : (
                <span>{t("photoPlaceholder")}</span>
              )}
            </div>
            <div className={styles.uploadDetails}>
              <span className={styles.fileName}>
                {current.imageName ?? t("noPhoto")}
              </span>
              <small>{t("photoHint")}</small>
              <Button
                className={formStyles.compactButton}
                variant="secondary"
                onClick={() => upload.current?.click()}
              >
                <Icon name="replace-image" /> {t("replacePhoto")}
              </Button>
              <input
                ref={upload}
                type="file"
                accept="image/jpeg,image/webp,image/png"
                aria-label={t("servicePhoto")}
                onChange={onPhotoChange}
                hidden
              />
            </div>
          </div>
        </section>
        <section className={formStyles.formSection}>
          <label className={formStyles.field}>
            <span>{t("name")}</span>
            <input
              required
              maxLength={120}
              value={current.title}
              placeholder={t("serviceName")}
              onChange={(event) => update({ title: event.target.value })}
            />
          </label>
          <label className={formStyles.field}>
            <span>{t("category")}</span>
            <select
              value={current.category}
              onChange={(event) =>
                update({ category: event.target.value as Category })
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {t(serviceCategoryKeys[category])}
                </option>
              ))}
            </select>
          </label>
          <div className={formStyles.fieldPair}>
            <label className={formStyles.field}>
              <span>{t("priceEuro")}</span>
              <input
                type="number"
                required
                min="0"
                max="10000"
                step="0.5"
                value={current.price}
                onChange={(event) =>
                  update({ price: Number(event.target.value) })
                }
              />
            </label>
            <label className={formStyles.field}>
              <span>{t("durationMinutes")}</span>
              <input
                type="number"
                required
                min="5"
                max="1440"
                step="5"
                value={current.minutes}
                onChange={(event) =>
                  update({ minutes: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <label className={formStyles.field}>
            <span>{t("description")}</span>
            <textarea
              rows={3}
              maxLength={2000}
              value={current.description}
              onChange={(event) => update({ description: event.target.value })}
            />
          </label>
        </section>
        <ServiceAddOns
          addOns={current.addOns}
          onChange={(addOns) => update({ addOns })}
        />
        {message && (
          <p role="status" className={formStyles.feedback}>
            {message}
          </p>
        )}
        <div className={formStyles.formActions}>
          <Button
            variant="secondary"
            onClick={() => (isNew ? onCancel() : onDelete(current.id))}
          >
            {isNew ? t("cancel") : t("delete")}
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
