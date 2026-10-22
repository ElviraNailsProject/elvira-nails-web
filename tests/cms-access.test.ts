import assert from "node:assert/strict";
import test from "node:test";
import type { PayloadRequest } from "payload";

import {
  adminOnly,
  adminOrPublished,
  isAdmin,
  readContacts,
} from "../src/cms/access/admin";
import { readMedia } from "../src/cms/access/media";
import {
  protectAdminCreation,
  validateAdminPassword,
} from "../src/cms/hooks/admin";
import { protectReferencedMedia } from "../src/cms/hooks/media";

const admin = { id: "owner-id", collection: "admins" };
const request = (input: Record<string, unknown> = {}) =>
  ({ context: {}, ...input }) as unknown as PayloadRequest;

test("a visitor or an authenticated user from another collection cannot write CMS content", async () => {
  for (const user of [
    null,
    undefined,
    { id: "visitor" },
    { id: "customer", collection: "customers" },
  ]) {
    assert.equal(isAdmin(user), false);
    assert.equal(await adminOnly({ req: request({ user }) }), false);
  }
  assert.equal(await adminOnly({ req: request({ user: admin }) }), true);
});

test("anonymous reads require published state, while owners can read drafts", async () => {
  assert.deepEqual(await adminOrPublished({ req: request() }), {
    _status: { equals: "published" },
  });
  assert.equal(await adminOrPublished({ req: request({ user: admin }) }), true);
});

test("private contact fields fail closed during generic access checks", async () => {
  const call = (input: Record<string, unknown>) =>
    readContacts(input as unknown as Parameters<typeof readContacts>[0]);
  assert.equal(await call({ req: request() }), false);
  assert.equal(
    await call({ req: request(), siblingData: { publishContacts: false } }),
    false,
  );
  assert.equal(
    await call({ req: request(), siblingData: { publishContacts: true } }),
    true,
  );
  assert.equal(await call({ req: request({ user: admin }) }), true);
});

test("the first-register bypass cannot create an owner without private bootstrap context", () => {
  const call = (req: PayloadRequest) =>
    protectAdminCreation({
      req,
      operation: "create",
      data: { email: "owner@example.com" },
    } as unknown as Parameters<typeof protectAdminCreation>[0]);
  assert.throws(() => call(request()), { status: 403 });
  assert.throws(
    () => call(request({ context: { cmsBootstrapAdmin: "true" } })),
    { status: 403 },
  );
  assert.doesNotThrow(() =>
    call(request({ context: { cmsBootstrapAdmin: true } })),
  );
  assert.doesNotThrow(() => call(request({ user: admin })));
});

test("password policy applies to creation, account changes and reset operations", () => {
  for (const operation of ["create", "update", "resetPassword"] as const) {
    const call = (password: string) =>
      validateAdminPassword({
        args: { data: { password } },
        operation,
      } as unknown as Parameters<typeof validateAdminPassword>[0]);
    assert.throws(() => call("short"), { status: 400 });
    assert.throws(() => call("a".repeat(129)), { status: 400 });
    assert.doesNotThrow(() => call("A long local testing passphrase"));
  }
});

test("media access queries the published snapshot once per request, not draft versions", async () => {
  const queries: Record<string, unknown>[] = [];
  const req = request({
    payload: {
      find: async (query: Record<string, unknown>) => {
        queries.push(query);
        return {
          docs: [
            {
              photo: "portrait",
              gallery: [
                { image: "hidden", isPublished: false },
                { image: "work", isPublished: true },
              ],
            },
          ],
        };
      },
    },
  });
  assert.deepEqual(await readMedia({ req }), {
    id: { in: ["portrait", "work"] },
  });
  assert.deepEqual(await readMedia({ req }), {
    id: { in: ["portrait", "work"] },
  });
  assert.equal(queries.length, 1);
  assert.equal(queries[0].draft, false);
  assert.equal(queries[0].depth, 0);
  assert.deepEqual(queries[0].where, { _status: { equals: "published" } });
});

test("media visibility is refreshed for each request so unpublishing revokes it", async () => {
  const payload = { find: async () => ({ docs: [] }) };
  assert.equal(await readMedia({ req: request({ payload }) }), false);
  assert.equal(await readMedia({ req: request({ user: admin }) }), true);
});

test("deleting an image referenced by a draft or historical version is rejected", async () => {
  let versionLookup = false;
  const req = request({
    payload: {
      find: async () => ({ docs: [] }),
      findVersions: async () => {
        versionLookup = true;
        return { docs: [{ version: { photo: "image" } }] };
      },
    },
  });
  await assert.rejects(
    () =>
      Promise.resolve(
        protectReferencedMedia({ req, id: "image" } as Parameters<
          typeof protectReferencedMedia
        >[0]),
      ),
    { status: 409 },
  );
  assert.equal(versionLookup, true);
});

test("unused upload can be deleted", async () => {
  const req = request({
    payload: {
      find: async () => ({ docs: [] }),
      findVersions: async () => ({ docs: [] }),
    },
  });
  await assert.doesNotReject(() =>
    Promise.resolve(
      protectReferencedMedia({ req, id: "unused" } as Parameters<
        typeof protectReferencedMedia
      >[0]),
    ),
  );
});
