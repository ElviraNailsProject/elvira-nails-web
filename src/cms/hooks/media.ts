import { randomUUID } from "node:crypto";
import sharp from "sharp";
import {
  APIError,
  type CollectionBeforeDeleteHook,
  type CollectionBeforeOperationHook,
  type PayloadRequest,
  type Where,
} from "payload";
import { isAdmin } from "../access/admin";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 20_000_000;
const allowedFormats = new Set(["jpeg", "png", "webp"]);

/** Decode and re-encode rather than trusting a client MIME type or retaining camera metadata. */
export async function prepareImage(data: Buffer): Promise<Buffer> {
  if (!data.length || data.length > MAX_IMAGE_BYTES)
    throw new APIError("Загрузите фотографию размером до 5 МБ.", 400);
  try {
    const image = sharp(data, {
      limitInputPixels: MAX_IMAGE_PIXELS,
      failOn: "warning",
    });
    const metadata = await image.metadata();
    if (
      !metadata.format ||
      !allowedFormats.has(metadata.format) ||
      (metadata.pages ?? 1) > 1
    ) {
      throw new Error("Unsupported image");
    }
    return await image
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new APIError(
      "Нужна обычная фотография JPEG, PNG или WebP до 20 мегапикселей. SVG и анимация не поддерживаются.",
      400,
    );
  }
}

function mediaReferenceQuery(id: string | number, prefix = ""): Where {
  return {
    or: [
      { [`${prefix}photo`]: { equals: id } },
      { [`${prefix}gallery.image`]: { equals: id } },
    ],
  };
}

async function hasReferences(
  id: string | number,
  req: PayloadRequest,
): Promise<boolean> {
  const current = await req.payload.find({
    collection: "student-cases",
    where: mediaReferenceQuery(id),
    depth: 0,
    draft: false,
    limit: 1,
    overrideAccess: true,
    select: { studentName: true },
    req,
  });
  if (current.docs.length) return true;
  // Published and draft versions must remain restorable without broken image references.
  const versions = await req.payload.findVersions({
    collection: "student-cases",
    where: mediaReferenceQuery(id, "version."),
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
  });
  return versions.docs.length > 0;
}

export const protectReferencedMedia: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  if (await hasReferences(id, req)) {
    throw new APIError(
      "Фото используется в кейсе или его сохранённой версии. Удалите его из кейса; история версий сохраняет исходный файл.",
      409,
    );
  }
};

export const processMediaUpload: CollectionBeforeOperationHook = async ({
  args,
  operation,
  req,
}) => {
  if ((operation !== "create" && operation !== "update") || !req.file)
    return args;
  // beforeOperation runs before collection access checks; do not decode unauthenticated uploads.
  if (!isAdmin(req.user))
    throw new APIError(
      "Для загрузки фотографии войдите в аккаунт администратора.",
      403,
    );
  if (operation === "update") {
    // Replacing a shared file would silently change already published cases and old versions.
    throw new APIError(
      "Чтобы заменить фотографию, загрузите новый файл и выберите его в кейсе.",
      409,
    );
  }
  const data = await prepareImage(req.file.data);
  req.file.data = data;
  req.file.name = `${randomUUID()}.webp`;
  req.file.mimetype = "image/webp";
  req.file.size = data.length;
  return args;
};
