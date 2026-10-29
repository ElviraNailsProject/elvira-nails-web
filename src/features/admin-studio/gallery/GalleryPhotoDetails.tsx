import Image from "next/image";
import type { RefObject } from "react";
import { Button, Field, Toggle } from "../shared/ui/controls";
import type { GalleryPhoto } from "./gallery.types";
import styles from "./GalleryPhotoDetails.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { galleryMessages, galleryCategoryKeys } from "./gallery.messages";

const categories = [
  "Маникюр",
  "Педикюр",
  "Наращивание",
  "Дизайн",
  "Работы учениц",
];

type GalleryPhotoDetailsProps = {
  selected: GalleryPhoto | undefined;
  selectedIndex: number;
  photoCount: number;
  uploading: boolean;
  replacementInput: RefObject<HTMLInputElement | null>;
  patchSelected: (patch: Partial<GalleryPhoto>) => void;
  reorder: (id: string, targetIndex: number) => void;
  onDelete: (id: string) => void;
  save: () => void;
};

export function GalleryPhotoDetails({
  selected,
  selectedIndex,
  photoCount,
  uploading,
  replacementInput,
  patchSelected,
  reorder,
  onDelete,
  save,
}: GalleryPhotoDetailsProps) {
  const { t } = useStudioTranslation(galleryMessages);
  return (
    <aside className={styles.details} aria-label={t("details")}>
      <h2>{t("details")}</h2>
      {selected ? (
        <div className={styles.detailsBody}>
          <div className={styles.imageSection}>
            <div
              className={styles.preview}
              style={{ backgroundColor: selected.color }}
            >
              {selected.src ? (
                <Image
                  unoptimized
                  src={selected.src}
                  alt={selected.alt || selected.name}
                  width={selected.width}
                  height={selected.height}
                  className={styles.photo}
                />
              ) : (
                <span>{t("placeholder")}</span>
              )}
            </div>
            <div className={styles.fileDetails}>
              <div>
                <p>{selected.name}</p>
                <small>
                  {selected.width} × {selected.height}
                </small>
              </div>
              <Button
                variant="secondary"
                type="button"
                disabled={uploading}
                onClick={() => replacementInput.current?.click()}
              >
                {t("replace")}
              </Button>
            </div>
          </div>

          <div className={styles.metadata}>
            <Field label={t("category")}>
              <select
                value={selected.category}
                onChange={(event) =>
                  patchSelected({ category: event.target.value })
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(galleryCategoryKeys[category])}
                  </option>
                ))}
              </select>
            </Field>
            <div className={styles.orderRow}>
              <div className={styles.homeToggle}>
                <span>{t("onHome")}</span>
                <Toggle
                  label={t("onHome")}
                  checked={selected.onHome}
                  onChange={(onHome) => patchSelected({ onHome })}
                />
              </div>
              <div className={styles.orderButtons}>
                <button
                  type="button"
                  aria-label={t("moveEarlier")}
                  disabled={uploading || selectedIndex === 0}
                  onClick={() => reorder(selected.id, selectedIndex - 1)}
                >
                  ←
                </button>
                <span aria-label={t("position")}>{selectedIndex + 1}</span>
                <button
                  type="button"
                  aria-label={t("moveLater")}
                  disabled={uploading || selectedIndex === photoCount - 1}
                  onClick={() => reorder(selected.id, selectedIndex + 1)}
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <Field label={t("caption")}>
            <input
              value={selected.alt}
              maxLength={300}
              onChange={(event) => patchSelected({ alt: event.target.value })}
              placeholder={t("describe")}
            />
          </Field>
          <div className={styles.actions}>
            <Button
              variant="secondary"
              type="button"
              disabled={uploading}
              onClick={() => onDelete(selected.id)}
            >
              {t("delete")}
            </Button>
            <Button
              variant="primary"
              type="button"
              disabled={uploading}
              onClick={() => save()}
            >
              {t("save")}
            </Button>
          </div>
        </div>
      ) : (
        <p className={styles.empty}>{t("empty")}</p>
      )}
    </aside>
  );
}
