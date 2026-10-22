import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";

import {
  MAX_IMAGE_BYTES,
  prepareImage,
  processMediaUpload,
} from "../src/cms/hooks/media";

test("uploaded photos are resized, encoded as WebP, and lose EXIF metadata", async () => {
  const input = await sharp({
    create: { width: 3000, height: 1500, channels: 3, background: "#bda391" },
  })
    .withExif({
      IFD0: { Artist: "Private photographer", Copyright: "Private" },
    })
    .jpeg()
    .toBuffer();
  assert.ok((await sharp(input).metadata()).exif);
  const output = await prepareImage(input);
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, "webp");
  assert.equal(metadata.width, 2400);
  assert.equal(metadata.height, 1200);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.xmp, undefined);
});

test("image decoding rejects SVG, malformed data, oversized bytes, and excessive dimensions", async () => {
  for (const data of [
    Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>',
    ),
    Buffer.from("not an image"),
    Buffer.alloc(MAX_IMAGE_BYTES + 1),
  ]) {
    await assert.rejects(() => prepareImage(data), { status: 400 });
  }
  const hugeDimensions = await sharp({
    create: { width: 5000, height: 5000, channels: 3, background: "white" },
  })
    .png()
    .toBuffer();
  await assert.rejects(() => prepareImage(hugeDimensions), { status: 400 });
});

test("upload processing rejects anonymous requests before image decoding", async () => {
  await assert.rejects(
    () =>
      Promise.resolve(
        processMediaUpload({
          args: {},
          operation: "create",
          req: { file: { data: Buffer.from("invalid"), name: "fake.jpg" } },
        } as unknown as Parameters<typeof processMediaUpload>[0]),
      ),
    { status: 403 },
  );
});

test("replacing a media record cannot silently alter already published cases", async () => {
  await assert.rejects(
    () =>
      Promise.resolve(
        processMediaUpload({
          args: {},
          operation: "update",
          req: {
            user: { id: "owner", collection: "admins" },
            file: { data: Buffer.from("invalid"), name: "fake.jpg" },
          },
        } as unknown as Parameters<typeof processMediaUpload>[0]),
      ),
    { status: 409 },
  );
});
