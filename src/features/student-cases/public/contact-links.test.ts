import assert from "node:assert/strict";
import test from "node:test";
import { publicContactHref } from "./contact-links";

test("only safe protocols and canonical social origins become public links", () => {
  assert.equal(
    publicContactHref({ type: "WEBSITE", value: "javascript:alert(1)" }),
    null,
  );
  assert.equal(
    publicContactHref({
      type: "WEBSITE",
      value: "https://user:password@example.com",
    }),
    null,
  );
  assert.equal(
    publicContactHref({
      type: "INSTAGRAM",
      value: "https://instagram.com.evil.test/sofia",
    }),
    null,
  );
  assert.equal(
    publicContactHref({
      type: "INSTAGRAM",
      value: "https://www.instagram.com/sofia.nails/",
    }),
    "https://www.instagram.com/sofia.nails/",
  );
  assert.equal(
    publicContactHref({ type: "TIKTOK", value: "@sofia.nails" }),
    "https://www.tiktok.com/@sofia.nails",
  );
  assert.equal(
    publicContactHref({ type: "TELEGRAM", value: "https://t.me/sofia_nails" }),
    "https://t.me/sofia_nails",
  );
});

test("contact links normalize phone and email without allowing injected parameters", () => {
  assert.equal(
    publicContactHref({ type: "WHATSAPP", value: "+31 (6) 1234 5678" }),
    "https://wa.me/31612345678",
  );
  assert.equal(
    publicContactHref({ type: "EMAIL", value: "sofia+studio@example.com" }),
    "mailto:sofia%2Bstudio@example.com",
  );
  assert.equal(
    publicContactHref({
      type: "EMAIL",
      value: "sofia@example.com?bcc=other@example.com",
    }),
    null,
  );
  assert.equal(
    publicContactHref({
      type: "EMAIL",
      value: "sofia@example.com\r\nbcc:other@example.com",
    }),
    null,
  );
  assert.equal(publicContactHref({ type: "WHATSAPP", value: "123" }), null);
});
