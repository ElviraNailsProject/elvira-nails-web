import Image from "next/image";
import { useState, type RefObject } from "react";
import { Icon } from "../shared/ui/controls";
import type { GalleryPhoto } from "./gallery.types";
import styles from "./GalleryGrid.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { galleryMessages, galleryCategoryKeys } from "./gallery.messages";

type GalleryGridProps = {
  photos: GalleryPhoto[];
  selectedId: string | undefined;
  error: string;
  uploading: boolean;
  announcement: string;
  uploadInput: RefObject<HTMLInputElement | null>;
  replacementInput: RefObject<HTMLInputElement | null>;
  upload: (files: FileList | File[], replaceId?: string) => Promise<void>;
  setSelectedId: (id: string) => void;
  reorder: (id: string, targetIndex: number) => void;
};

export function GalleryGrid({
  photos,
  selectedId,
  error,
  uploading,
  announcement,
  uploadInput,
  replacementInput,
  upload,
  setSelectedId,
  reorder,
}: GalleryGridProps) {
  const { t } = useStudioTranslation(galleryMessages);
  const [dragging, setDragging] = useState<string | null>(null);
  return (
    <section className={styles.gallery} aria-label={t("title")}>
      <p className={styles.instructions} id="gallery-sort-help">
        {t("sortHelp")}
        <span className={styles.srOnly}>{t("keyboardHelp")}</span>
      </p>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <input
        className={styles.fileInput}
        ref={uploadInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        disabled={uploading}
        aria-label={t("choosePhotos")}
        onChange={(event) => {
          if (event.target.files) void upload(event.target.files);
          event.target.value = "";
        }}
      />
      <input
        className={styles.fileInput}
        ref={replacementInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        disabled={uploading}
        aria-label={t("replacePhoto")}
        onChange={(event) => {
          if (event.target.files && selectedId)
            void upload(event.target.files, selectedId);
          event.target.value = "";
        }}
      />
      <div className={styles.grid}>
        <button
          type="button"
          className={styles.uploadTile}
          disabled={uploading}
          onClick={() => uploadInput.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (event.dataTransfer.files.length)
              void upload(event.dataTransfer.files);
          }}
        >
          <Icon name="upload" />
          <span>{uploading ? t("uploading") : t("upload")}</span>
          <small>{t("multipleHint")}</small>
        </button>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={`${styles.tile} ${selectedId === photo.id ? styles.selected : ""} ${dragging === photo.id ? styles.dragging : ""}`}
            style={{ backgroundColor: photo.color }}
            aria-label={t("photoLabel", {
              index: index + 1,
              category: galleryCategoryKeys[photo.category]
                ? t(galleryCategoryKeys[photo.category])
                : photo.category,
            })}
            aria-pressed={selectedId === photo.id}
            aria-describedby="gallery-sort-help"
            draggable={!uploading}
            onClick={() => setSelectedId(photo.id)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", photo.id);
              setDragging(photo.id);
            }}
            onDragEnd={() => setDragging(null)}
            onDragOver={(event) => {
              if (dragging) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (dragging) reorder(dragging, index);
              setDragging(null);
            }}
            onKeyDown={(event) => {
              if (
                event.altKey &&
                ["ArrowLeft", "ArrowRight"].includes(event.key)
              ) {
                event.preventDefault();
                reorder(photo.id, index + (event.key === "ArrowLeft" ? -1 : 1));
              }
            }}
          >
            {photo.src ? (
              <Image
                unoptimized
                src={photo.src}
                alt={photo.alt || photo.name}
                width={photo.width}
                height={photo.height}
                className={styles.photo}
              />
            ) : (
              <Icon name="gallery-image-placeholder" />
            )}
            <span className={styles.categoryBadge}>
              {galleryCategoryKeys[photo.category]
                ? t(galleryCategoryKeys[photo.category])
                : photo.category}
            </span>
            {photo.onHome && (
              <span className={styles.homeBadge}>{t("onHome")}</span>
            )}
          </button>
        ))}
      </div>
      <p className={styles.count}>
        {t("count", {
          total: photos.length,
          home: photos.filter((photo) => photo.onHome).length,
        })}
      </p>
      <p className={styles.srOnly} role="status">
        {announcement}
      </p>
    </section>
  );
}
