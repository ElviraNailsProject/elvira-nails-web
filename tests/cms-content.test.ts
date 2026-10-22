import assert from "node:assert/strict";
import test from "node:test";

import {
  redactCaseForPublic,
  validateContactValue,
  validateContacts,
  validateGallery,
  visibleMediaIDs,
} from "../src/cms/lib/content-rules";

test("public media visibility checks image and visibility on the same gallery row", () => {
  const ids = visibleMediaIDs({
    photo: { id: "portrait" },
    gallery: [
      { image: "hidden", isPublished: false },
      { image: { id: "visible" }, isPublished: true },
      { image: "unspecified" },
      { image: "visible", isPublished: true },
    ],
  });
  assert.deepEqual(ids, ["portrait", "visible"]);
});

test("public case projection hides contacts by default and strips whole hidden rows", () => {
  const hidden = { image: "private-file", isPublished: false };
  const input = {
    contacts: [{ value: "private@example.com" }],
    gallery: [hidden, { image: "published-file", isPublished: true }],
  };
  const result = redactCaseForPublic(input);
  assert.deepEqual(result.contacts, []);
  assert.deepEqual(result.gallery, [
    { image: "published-file", isPublished: true },
  ]);
  assert.equal(
    input.gallery[0],
    hidden,
    "Projection must not mutate the saved document",
  );
});

test("explicit contact permission is necessary to publish contact values", () => {
  const contacts = [{ value: "allowed@example.com" }];
  assert.deepEqual(
    redactCaseForPublic({ publishContacts: true, contacts }).contacts,
    contacts,
  );
  assert.deepEqual(
    redactCaseForPublic({ publishContacts: false, contacts }).contacts,
    [],
  );
});

test("gallery rejects duplicate relationships, hidden cover and competing covers", () => {
  assert.notEqual(validateGallery([{ image: 1 }, { image: { id: 1 } }]), true);
  assert.notEqual(
    validateGallery([{ image: 1, isCover: true, isPublished: false }]),
    true,
  );
  assert.notEqual(
    validateGallery([
      { image: 1, isCover: true, isPublished: true },
      { image: 2, isCover: true, isPublished: true },
    ]),
    true,
  );
  assert.equal(
    validateGallery([
      { image: 1, isCover: true, isPublished: true },
      { image: 2, isPublished: false },
    ]),
    true,
  );
});

test("gallery and contact validators bound payloads and reject malformed rows", () => {
  assert.notEqual(
    validateGallery(Array.from({ length: 41 }, (_, image) => ({ image }))),
    true,
  );
  assert.notEqual(validateGallery([null]), true);
  assert.notEqual(
    validateContacts([{ type: "EMAIL" }, { type: "EMAIL" }]),
    true,
  );
  assert.notEqual(
    validateContacts(Array.from({ length: 7 }, (_, type) => ({ type }))),
    true,
  );
});

test("website contact only permits HTTPS without embedded credentials", () => {
  for (const value of [
    "javascript:alert(1)",
    "http://example.com",
    "https://user:password@example.com",
    "https://example.com\nmalicious",
  ]) {
    assert.notEqual(validateContactValue("WEBSITE", value), true);
  }
  assert.equal(
    validateContactValue("WEBSITE", "https://sofia.example/work"),
    true,
  );
});

test("social contact values are handles or phone numbers instead of arbitrary URLs", () => {
  assert.equal(validateContactValue("INSTAGRAM", "@sofia.nails"), true);
  assert.equal(validateContactValue("WHATSAPP", "+31 612 345 678"), true);
  assert.equal(validateContactValue("TELEGRAM", "@sofia_nails"), true);
  assert.notEqual(
    validateContactValue("INSTAGRAM", "https://malicious.example/profile"),
    true,
  );
  assert.notEqual(validateContactValue("EMAIL", "missing-address"), true);
});
