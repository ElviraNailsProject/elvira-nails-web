/* Uploaded banner previews are local data URLs. */
/* eslint-disable @next/next/no-img-element */
import type { ChangeEventHandler, FormEventHandler, RefObject } from "react";
import { Button, Icon, Toggle } from "../shared/ui/controls";
import { DetailsPanel } from "../shared/ui/DetailsPanel";
import type { Promotion } from "./promotions.types";
import { formatDate } from "./promotions.model";
import styles from "./PromotionDetailsPanel.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { promotionMessages } from "./promotions.messages";

type PromotionDetailsPanelProps = {
  selected: Promotion;
  isNew: boolean;
  uploading: boolean;
  hasChanges: boolean;
  error: string;
  uploadRef: RefObject<HTMLInputElement | null>;
  change: <K extends keyof Promotion>(key: K, value: Promotion[K]) => void;
  submit: FormEventHandler<HTMLFormElement>;
  upload: ChangeEventHandler<HTMLInputElement>;
  onClose: () => void;
  onCancelNew: () => void;
  onDelete: () => void;
  onRevert: () => void;
};

export function PromotionDetailsPanel({
  selected,
  isNew,
  uploading,
  hasChanges,
  error,
  uploadRef,
  change,
  submit,
  upload,
  onClose,
  onCancelNew,
  onDelete,
  onRevert,
}: PromotionDetailsPanelProps) {
  const { t, locale } = useStudioTranslation(promotionMessages);
  return (
    <div className={styles.details}>
      <DetailsPanel
        title={isNew ? t("newTitle") : t("detailsTitle")}
        onClose={onClose}
      >
        <form className={styles.form} onSubmit={submit} aria-busy={uploading}>
          <fieldset className={styles.editorFields} disabled={uploading}>
            <section className={styles.section}>
              <h2>
                <Icon name="image" />
                {t("image")}
              </h2>
              <div className={styles.indented}>
                <button
                  className={styles.banner}
                  style={{ backgroundColor: selected.color }}
                  type="button"
                  onClick={() => uploadRef.current?.click()}
                  disabled={uploading}
                  aria-label={t("chooseBanner")}
                >
                  {selected.image ? (
                    <img
                      className={styles.uploadedImage}
                      src={selected.image}
                      alt={selected.alt || t("preview")}
                    />
                  ) : (
                    <>
                      <Icon name="promotion-banner-placeholder" />
                      <span>{t("bannerPlaceholder")}</span>
                    </>
                  )}
                </button>
                <div className={styles.fileRow}>
                  <div>
                    <span title={selected.fileName || undefined}>
                      {!selected.fileName ||
                      selected.fileName === "Изображение не выбрано"
                        ? t("noImage")
                        : selected.fileName}
                    </span>
                    <small>
                      {!selected.fileInfo ||
                      selected.fileInfo === "PNG, JPG или WebP · до 1 МБ"
                        ? t("fileHint")
                        : selected.fileInfo.replace(/КБ$/, "kB")}
                    </small>
                  </div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => uploadRef.current?.click()}
                    disabled={uploading}
                  >
                    <Icon name="replace-image" />
                    {uploading ? t("loading") : t("replace")}
                  </Button>
                </div>
                <input
                  ref={uploadRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={styles.fileInput}
                  onChange={upload}
                  aria-label={t("bannerFile")}
                />
              </div>
            </section>

            <section className={styles.section}>
              <label className={styles.labelWithIcon} htmlFor="promotion-name">
                <Icon name="tag" />
                {t("adminName")}
              </label>
              <div className={styles.indented}>
                <input
                  id="promotion-name"
                  value={selected.name}
                  maxLength={120}
                  required
                  onChange={(event) => change("name", event.target.value)}
                  placeholder={t("name")}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2>
                <Icon name="schedule" />
                {t("period")}
              </h2>
              <div className={styles.indented}>
                <div className={styles.dateFields}>
                  <label>
                    {t("start")}
                    <span className={styles.dateInput}>
                      <input
                        aria-label={t("startLabel")}
                        type="date"
                        value={selected.start}
                        max={selected.end || undefined}
                        required
                        onChange={(event) =>
                          change("start", event.target.value)
                        }
                      />
                      <Icon name="date-picker" />
                    </span>
                  </label>
                  <label>
                    {t("end")}
                    <span className={styles.dateInput}>
                      <input
                        aria-label={t("endLabel")}
                        type="date"
                        value={selected.end}
                        min={selected.start || undefined}
                        required
                        onChange={(event) => change("end", event.target.value)}
                      />
                      <Icon name="date-picker" />
                    </span>
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <div>
                    {t("autoHide")}
                    <small>
                      {selected.autoHide
                        ? t("disappearsAt", {
                            date: formatDate(selected.end, locale),
                          })
                        : t("noExpiry")}
                    </small>
                  </div>
                  <Toggle
                    checked={selected.autoHide}
                    onChange={(checked) => change("autoHide", checked)}
                    label={t("autoHideLabel")}
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.visibilityRow}>
                <div>
                  <h2>
                    <Icon name="visibility" />
                    {t("showOnSite")}
                  </h2>
                  <small className={styles.indented}>
                    {selected.visible
                      ? t("customerVisible")
                      : t("customerHidden")}
                  </small>
                </div>
                <Toggle
                  checked={selected.visible}
                  onChange={(checked) => change("visible", checked)}
                  label={t("showSelected")}
                />
              </div>
            </section>

            <section className={styles.technical}>
              <h2>
                <span className={styles.settingsIcon} aria-hidden="true">
                  <Icon name="settings-spokes" />
                  <Icon name="settings-center" />
                </span>
                {t("technical")}
              </h2>
              <label className={styles.linkLabel}>
                {t("link")}
                <input
                  value={selected.href}
                  onChange={(event) => change("href", event.target.value)}
                  placeholder="/services"
                  maxLength={300}
                />
              </label>
              <div className={styles.technicalGrid}>
                <label>
                  {t("order")}
                  <input
                    type="number"
                    min={1}
                    max={9999}
                    step={1}
                    required
                    value={
                      Number.isFinite(selected.order) ? selected.order : ""
                    }
                    onChange={(event) =>
                      change("order", event.target.valueAsNumber)
                    }
                  />
                </label>
                <label>
                  {t("alt")}
                  <input
                    value={selected.alt}
                    onChange={(event) => change("alt", event.target.value)}
                    maxLength={200}
                  />
                </label>
                <label>
                  {t("code")}
                  <input
                    value={selected.code}
                    maxLength={30}
                    onChange={(event) => change("code", event.target.value)}
                  />
                </label>
                <label>
                  {t("discount")}
                  <span className={styles.percentage}>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={
                        Number.isFinite(selected.discount)
                          ? selected.discount
                          : ""
                      }
                      onChange={(event) =>
                        change("discount", event.target.valueAsNumber)
                      }
                    />
                    <span>%</span>
                  </span>
                </label>
              </div>
            </section>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}
            <div className={styles.formActions}>
              <Button
                variant="secondary"
                type="button"
                onClick={isNew ? onCancelNew : onDelete}
                disabled={uploading}
              >
                <Icon name="delete-danger" />
                {isNew ? t("cancel") : t("delete")}
              </Button>
              <Button variant="primary" type="submit" disabled={uploading}>
                <Icon name="check" />
                {t("save")}
              </Button>
            </div>
            {hasChanges && !isNew ? (
              <Button
                variant="ghost"
                className={styles.cancelChanges}
                onClick={onRevert}
              >
                {t("revert")}
              </Button>
            ) : null}
          </fieldset>
        </form>
      </DetailsPanel>
    </div>
  );
}
