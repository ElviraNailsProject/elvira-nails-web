"use client";

import { useRef, useState, type RefObject } from "react";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import type { GalleryPhoto } from "./gallery.types";
import { initialPhotos } from "./gallery.demo";
import {
  MAX_PHOTOS,
  MAX_PREVIEW_CHARS,
  readPhoto,
  GalleryImageError,
} from "./gallery.images";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryPhotoDetails } from "./GalleryPhotoDetails";
import styles from "./GalleryEditor.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { galleryMessages, type GalleryNotice } from "./gallery.messages";

export function GalleryEditor({
  uploadInput,
}: {
  uploadInput: RefObject<HTMLInputElement | null>;
}) {
  const { t } = useStudioTranslation(galleryMessages);
  const [photos, setPhotos, save] = useLocalDraft<GalleryPhoto[]>(
    "gallery",
    initialPhotos,
  );
  const [selectedId, setSelectedId] = useState("example-1");
  const [error, setError] = useState<GalleryNotice | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState(false);
  const [announcement, setAnnouncement] = useState<GalleryNotice | null>(null);
  const replacementInput = useRef<HTMLInputElement>(null);
  const uploadInProgress = useRef(false);
  const selected = photos.find((photo) => photo.id === selectedId) ?? photos[0];
  const selectedIndex = selected
    ? photos.findIndex((photo) => photo.id === selected.id)
    : -1;

  async function upload(files: FileList | File[], replaceId?: string) {
    if (uploadInProgress.current) return;
    const requested = Array.from(files);
    if (!requested.length) return;
    setError(null);
    if (!replaceId && photos.length + requested.length > MAX_PHOTOS) {
      setError({ key: "limit", params: { count: MAX_PHOTOS } });
      return;
    }
    uploadInProgress.current = true;
    setUploading(true);
    try {
      const loaded = await Promise.all(
        (replaceId ? requested.slice(0, 1) : requested).map(readPhoto),
      );
      const existingSize = photos.reduce(
        (total, photo) =>
          total + (photo.id === replaceId ? 0 : (photo.src?.length ?? 0)),
        0,
      );
      if (
        existingSize +
          loaded.reduce((total, photo) => total + (photo.src?.length ?? 0), 0) >
        MAX_PREVIEW_CHARS
      ) {
        throw new GalleryImageError("storageFull");
      }
      if (replaceId) {
        setPhotos((current) =>
          current.map((photo) =>
            photo.id === replaceId ? { ...photo, ...loaded[0] } : photo,
          ),
        );
        setAnnouncement({ key: "replaced" });
      } else {
        const additions = loaded.map((photo) => ({
          ...photo,
          id: crypto.randomUUID(),
          category: "Маникюр",
          alt: "",
          onHome: false,
          color: "#e9d9cc",
        }));
        setPhotos((current) => [...current, ...additions]);
        setSelectedId(additions[0].id);
        setAnnouncement({ key: "added", params: { count: additions.length } });
      }
    } catch (cause) {
      setError(
        cause instanceof GalleryImageError
          ? { key: cause.code, params: cause.params }
          : { key: "uploadFailed" },
      );
    } finally {
      uploadInProgress.current = false;
      setUploading(false);
    }
  }

  function patchSelected(patch: Partial<GalleryPhoto>) {
    if (!selected) return;
    setPhotos((current) =>
      current.map((photo) =>
        photo.id === selected.id ? { ...photo, ...patch } : photo,
      ),
    );
  }

  function reorder(id: string, targetIndex: number) {
    if (uploadInProgress.current) return;
    const oldIndex = photos.findIndex((photo) => photo.id === id);
    if (
      oldIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= photos.length ||
      oldIndex === targetIndex
    )
      return;
    const next = [...photos];
    const [photo] = next.splice(oldIndex, 1);
    next.splice(targetIndex, 0, photo);
    setPhotos(next);
    setAnnouncement({
      key: "moved",
      params: { name: photo.name, position: targetIndex + 1 },
    });
  }

  return (
    <div className={styles.columns}>
      <GalleryGrid
        photos={photos}
        selectedId={selected?.id}
        error={error ? t(error.key, error.params) : ""}
        uploading={uploading}
        announcement={
          announcement ? t(announcement.key, announcement.params) : ""
        }
        uploadInput={uploadInput}
        replacementInput={replacementInput}
        upload={upload}
        setSelectedId={setSelectedId}
        reorder={reorder}
      />
      <GalleryPhotoDetails
        selected={selected}
        selectedIndex={selectedIndex}
        photoCount={photos.length}
        uploading={uploading}
        replacementInput={replacementInput}
        patchSelected={patchSelected}
        reorder={reorder}
        onDelete={(id) => {
          setDeleteError(false);
          setDeleteId(id);
        }}
        save={() => save()}
      />

      {deleteId && (
        <ConfirmDialog
          title={t("deleteTitle")}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => {
            const next = photos.filter((photo) => photo.id !== deleteId);
            if (save(next)) {
              setDeleteId(null);
              setAnnouncement({ key: "deleted" });
            } else {
              setDeleteError(true);
            }
          }}
        >
          {t("deleteBody")}
          {deleteError ? <p role="alert">{t("deleteFailed")}</p> : null}
        </ConfirmDialog>
      )}
    </div>
  );
}
