import path from "node:path";
import type { CollectionConfig } from "payload";

import { adminOnly } from "../access/admin";
import { readMedia } from "../access/media";
import { processMediaUpload, protectReferencedMedia } from "../hooks/media";

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Фотография", plural: "Фотографии" },
  admin: {
    useAsTitle: "alt",
    group: "Контент",
    defaultColumns: ["filename", "alt", "updatedAt"],
  },
  access: {
    create: adminOnly,
    read: readMedia,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeOperation: [processMediaUpload],
    beforeDelete: [protectReferencedMedia],
  },
  upload: {
    // Never place protected uploads inside Next's public directory.
    staticDir: path.resolve(process.cwd(), ".local/cms-media"),
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    pasteURL: false,
    crop: false,
    focalPoint: false,
    withMetadata: false,
    adminThumbnail: "thumbnail",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        fit: "inside",
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 80 } },
      },
      {
        name: "card",
        width: 960,
        withoutEnlargement: true,
        formatOptions: { format: "webp", options: { quality: 85 } },
      },
    ],
    modifyResponseHeaders: ({ headers }) => {
      // Revoking publication must revoke the next request, including after admin previews.
      headers.set("Cache-Control", "private, no-store, max-age=0");
      headers.set("Vary", "Cookie, Authorization");
      headers.set("X-Content-Type-Options", "nosniff");
      return headers;
    },
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Описание фотографии",
      required: true,
      maxLength: 300,
      admin: {
        description:
          "Кратко опишите содержимое фотографии. Это описание помогает посетителям, использующим программы чтения с экрана.",
      },
    },
  ],
};
