import type { GalleryPhoto } from "./gallery.types";
import type { GalleryNotice } from "./gallery.messages";

export class GalleryImageError extends Error {
  constructor(
    public readonly code: GalleryNotice["key"],
    public readonly params?: GalleryNotice["params"],
  ) {
    super(code);
    this.name = "GalleryImageError";
  }
}

const MAX_FILE_BYTES = 1_000_000;
export const MAX_PREVIEW_CHARS = 1_500_000;
export const MAX_PHOTOS = 40;

export async function readPhoto(
  file: File,
): Promise<Pick<GalleryPhoto, "src" | "width" | "height" | "name">> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type)
  ) {
    throw new GalleryImageError("fileType", { name: file.name });
  }
  if (file.size > MAX_FILE_BYTES)
    throw new GalleryImageError("fileSize", { name: file.name });
  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(new GalleryImageError("fileRead", { name: file.name }));
    reader.readAsDataURL(file);
  });
  const dimensions = await new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      const image = new window.Image();
      image.onload = () =>
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () =>
        reject(new GalleryImageError("fileDecode", { name: file.name }));
      image.src = src;
    },
  );
  return { src, name: file.name, ...dimensions };
}
