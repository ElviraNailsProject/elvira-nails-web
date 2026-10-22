import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

// Deliberately restricted to a disposable local CMS. Never load the project's .env here.
const base = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:3100");
if (
  !new Set(["127.0.0.1", "localhost", "[::1]"]).has(base.hostname) ||
  !new Set(["http:", "https:"]).has(base.protocol) ||
  base.username ||
  base.password ||
  base.pathname !== "/" ||
  base.search ||
  base.hash
) {
  throw new Error(
    "TEST_BASE_URL must be a loopback origin without credentials, path, or query.",
  );
}
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;
assert.ok(
  email && password,
  "Set TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD for the disposable local owner.",
);

let cookie = "";
let caseID;
let applicationID;
const media = [];
const marker = `CMS integration ${randomUUID()}`;
const privateEmail = `private-${randomUUID()}@example.test`;
const originalStory =
  "A complete student journey for the local CMS integration test.";

async function request(
  path,
  { method = "GET", body, authenticated = false, headers = {} } = {},
) {
  const url = new URL(path, base);
  assert.equal(
    url.origin,
    base.origin,
    "Tests must never request an external URL.",
  );
  const outgoing = new Headers(headers);
  outgoing.set("Origin", base.origin);
  if (authenticated) outgoing.set("Cookie", cookie);
  if (body && !(body instanceof FormData))
    outgoing.set("Content-Type", "application/json");
  return fetch(url, {
    method,
    headers: outgoing,
    signal: AbortSignal.timeout(120000),
    body:
      body instanceof FormData
        ? body
        : body === undefined
          ? undefined
          : JSON.stringify(body),
    redirect: "manual",
  });
}

async function json(path, options, statuses = [200]) {
  const response = await request(path, options);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = undefined;
  }
  assert.ok(
    statuses.includes(response.status),
    `${options?.method ?? "GET"} ${path}: expected ${statuses.join("/")}, received ${response.status}. ${data?.errors?.map((error) => error.message).join("; ") ?? text.slice(0, 200)}`,
  );
  return data;
}

async function denied(path, options) {
  const response = await request(path, options);
  await response.arrayBuffer();
  assert.ok(
    [401, 403, 404].includes(response.status),
    `${path} must be private; received ${response.status}`,
  );
}

const cmsCasePath = () => `/api/cms/student-cases/${caseID}`;

async function upload(color, alt) {
  const bytes = await sharp({
    create: { width: 80, height: 60, channels: 3, background: color },
  })
    .png()
    .toBuffer();
  const body = new FormData();
  body.append("_payload", JSON.stringify({ alt }));
  body.append(
    "file",
    new Blob([bytes], { type: "image/png" }),
    "synthetic-test-image.png",
  );
  const result = await json(
    "/api/cms/media",
    { method: "POST", body, authenticated: true },
    [200, 201],
  );
  assert.ok(
    result.doc?.id && result.doc.url,
    "Media create must return its id and protected URL",
  );
  assert.equal(result.doc.mimeType, "image/webp");
  assert.match(result.doc.filename, /^[0-9a-f-]{36}\.webp$/);
  media.push(result.doc);
  console.log(`Uploaded synthetic fixture: ${alt}`);
  return result.doc;
}

try {
  const login = await request("/api/cms/admins/login", {
    method: "POST",
    body: { email, password },
  });
  assert.equal(login.status, 200, "Owner login must succeed");
  cookie = login.headers
    .getSetCookie()
    .map((value) => value.split(";")[0])
    .join("; ");
  assert.ok(cookie, "Native login must set a session cookie");
  await login.arrayBuffer();

  await denied("/api/cms/student-cases", {
    method: "POST",
    body: { studentName: marker },
  });
  await denied("/api/cms/training-applications");
  await denied("/api/cms/admins");
  console.log(
    "PASS: native owner login and anonymous write/private-data protection",
  );

  const portrait = await upload("#bea48e", "Synthetic portrait");
  const visible = await upload("#ecd6cb", "Synthetic manicure work");
  const hidden = await upload("#b88b7c", "Synthetic private work");
  const fields = {
    studentName: marker,
    city: "Leiden, Netherlands",
    status: "WAITING",
    resultTitle: "From first practice to confident nail artist.",
    story: originalStory,
    photo: portrait.id,
    publishContacts: false,
    contacts: [{ type: "EMAIL", value: privateEmail }],
    gallery: [
      { image: visible.id, isPublished: true, isCover: true },
      { image: hidden.id, isPublished: false, isCover: false },
    ],
  };
  const created = await json(
    "/api/cms/student-cases?locale=en&draft=true",
    { method: "POST", body: fields, authenticated: true },
    [200, 201],
  );
  caseID = created.doc?.id;
  assert.ok(caseID);
  await denied(cmsCasePath());
  await denied(`/api/student-cases/${caseID}`);
  for (const item of media) await denied(item.url);
  console.log("PASS: drafts and all draft-only files remain private");

  const ukTitle = "Від першої практики до впевненої майстрині.";
  const ukStory =
    "Учениця навчилася професійного манікюру та відкрила власну справу.";
  await json(`${cmsCasePath()}?locale=uk&draft=true`, {
    method: "PATCH",
    body: { resultTitle: ukTitle, story: ukStory },
    authenticated: true,
  });
  const ukDraft = await json(`${cmsCasePath()}?locale=uk&draft=true`, {
    authenticated: true,
  });
  assert.equal(ukDraft.resultTitle, ukTitle);
  assert.equal(ukDraft.story, ukStory);
  await json(`${cmsCasePath()}?locale=en`, {
    method: "PATCH",
    body: { _status: "published" },
    authenticated: true,
  });

  const publicResult = await json(`/api/student-cases/${caseID}?locale=EN`);
  assert.equal(publicResult.data.studentName, marker);
  assert.equal(publicResult.data.story, originalStory);
  assert.deepEqual(publicResult.data.contacts, []);
  assert.equal(publicResult.data.images.length, 1);
  assert.equal(publicResult.data.images[0].isCover, true);
  const ukrainian = await json(`/api/student-cases/${caseID}?locale=UK`);
  assert.equal(ukrainian.data.resultTitle, ukTitle);
  assert.equal(ukrainian.data.story, ukStory);
  const raw = await json(`${cmsCasePath()}?locale=en&depth=2`);
  assert.ok(
    !JSON.stringify(raw).includes(privateEmail),
    "Native public API must redact private contacts",
  );
  assert.ok(
    !JSON.stringify(raw).includes(String(hidden.id)),
    "Native public API must redact hidden gallery references",
  );
  assert.equal(raw.gallery.length, 1);
  for (const item of [portrait, visible]) {
    const response = await request(item.url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.match(response.headers.get("content-type"), /image\/webp/);
    await response.arrayBuffer();
  }
  await denied(hidden.url);
  await denied(
    `/api/cms/student-cases/versions?where[parent][equals]=${caseID}`,
  );
  console.log(
    "PASS: publication, Ukrainian translation, public DTO, contact redaction, and exact media visibility",
  );

  const deletion = await request(`/api/cms/media/${visible.id}`, {
    method: "DELETE",
    authenticated: true,
  });
  assert.equal(deletion.status, 409, "An in-use image must not be deleted");
  await deletion.arrayBuffer();

  await json(`${cmsCasePath()}?locale=en`, {
    method: "PATCH",
    body: { publishContacts: true },
    authenticated: true,
  });
  assert.equal(
    (await json(`/api/student-cases/${caseID}?locale=en`)).data.contacts[0]
      .value,
    privateEmail,
  );
  await json(`${cmsCasePath()}?locale=en&draft=true`, {
    method: "PATCH",
    body: {
      story: "PRIVATE DRAFT DO NOT PUBLISH",
      photo: null,
      publishContacts: false,
    },
    authenticated: true,
  });
  const stillPublished = await json(`/api/student-cases/${caseID}?locale=en`);
  assert.equal(
    stillPublished.data.story,
    originalStory,
    "Saving an edit as draft must not change the published snapshot",
  );
  assert.ok(
    stillPublished.data.studentPhoto,
    "The old published portrait stays visible until publication changes",
  );
  const portraitStillVisible = await request(portrait.url);
  assert.equal(portraitStillVisible.status, 200);
  await portraitStillVisible.arrayBuffer();
  await json(`${cmsCasePath()}?locale=en`, {
    method: "PATCH",
    body: { _status: "draft" },
    authenticated: true,
  });
  await denied(`/api/student-cases/${caseID}`);
  for (const item of media) await denied(item.url);
  console.log(
    "PASS: opt-in contacts, draft edits preserve live content, unpublishing revokes file access",
  );

  const application = await json(
    "/api/cms/training-applications",
    {
      method: "POST",
      authenticated: true,
      body: {
        fullName: marker,
        email: "student@example.test",
        phone: "+31 612 345 678",
        message: "Synthetic local test",
        status: "WAITING",
      },
    },
    [200, 201],
  );
  applicationID = application.doc?.id;
  assert.ok(applicationID);
  for (const status of ["STUDYING", "COMPLETED", "WAITING"]) {
    const changed = await json(
      `/api/cms/training-applications/${applicationID}`,
      { method: "PATCH", authenticated: true, body: { status } },
    );
    assert.equal(changed.doc.status, status);
  }
  for (const status of ["NEW", "PAID", "CANCELLED"]) {
    await json(
      `/api/cms/training-applications/${applicationID}`,
      { method: "PATCH", authenticated: true, body: { status } },
      [400],
    );
  }
  await denied(`/api/cms/training-applications/${applicationID}`);
  console.log(
    "PASS: training applications accept exactly the three requested statuses and remain private",
  );
} finally {
  const failures = [];
  const cleanup = async (path) => {
    try {
      const response = await request(path, {
        method: "DELETE",
        authenticated: true,
      });
      await response.arrayBuffer();
      if (![200, 204, 404].includes(response.status))
        failures.push(`${path} (${response.status})`);
    } catch (error) {
      failures.push(`${path} (${error.message})`);
    }
  };
  // Removing the case also removes its versions; only then can its media be deleted safely.
  if (caseID) await cleanup(cmsCasePath());
  if (applicationID)
    await cleanup(`/api/cms/training-applications/${applicationID}`);
  for (const item of media) await cleanup(`/api/cms/media/${item.id}`);
  if (failures.length)
    throw new Error(
      `Remove these synthetic local records manually: ${failures.join(", ")}`,
    );
}

console.log(
  "CMS integration checks passed; synthetic records and uploads removed.",
);
