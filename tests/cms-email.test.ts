import assert from "node:assert/strict";
import test, { type TestContext } from "node:test";
import nodemailer from "nodemailer";
import { APIError, type Payload } from "payload";

import { cmsEmailAdapter } from "../src/cms/email";

const completeSMTP = {
  CMS_SMTP_HOST: " smtp.example.invalid ",
  CMS_SMTP_USER: " synthetic-owner ",
  CMS_SMTP_PASSWORD: "synthetic-test-password",
  CMS_SMTP_FROM: " noreply@example.invalid ",
  CMS_SMTP_FROM_NAME: " Elvira Studio ",
};

async function withSMTP(
  values: Partial<Record<keyof typeof completeSMTP, string | undefined>>,
  check: () => Promise<void>,
) {
  const previous = Object.fromEntries(
    Object.keys(completeSMTP).map((key) => [key, process.env[key]]),
  );
  try {
    for (const key of Object.keys(completeSMTP)) delete process.env[key];
    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) process.env[key] = value;
    }
    await check();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function blockExternalTestAccountsAndLogs(t: TestContext) {
  const testAccount = t.mock.method(nodemailer, "createTestAccount", () => {
    throw new Error("External test inbox creation is forbidden in CMS tests.");
  });
  const logs = ["log", "info", "warn", "error"].map((method) =>
    t.mock.method(console, method as "log", () => {}),
  );
  return () => {
    assert.equal(testAccount.mock.callCount(), 0);
    for (const log of logs) assert.equal(log.mock.callCount(), 0);
  };
}

test("missing SMTP fails closed without constructing transport, creating test inboxes or logging reset content", async (t) => {
  const assertNoSideEffects = blockExternalTestAccountsAndLogs(t);
  const createTransport = t.mock.method(nodemailer, "createTransport", () => {
    throw new Error("SMTP transport must not be created for missing settings.");
  });
  await withSMTP({}, async () => {
    const factory = await cmsEmailAdapter();
    const adapter = factory({ payload: {} as Payload });
    assert.equal(adapter.name, "elvira-email-unavailable");
    await assert.rejects(
      () =>
        adapter.sendEmail({
          to: "owner@example.invalid",
          subject: "Reset",
          html: "private reset token",
        }),
      (error: unknown) => error instanceof APIError && error.status === 503,
    );
  });
  assert.equal(createTransport.mock.callCount(), 0);
  assertNoSideEffects();
});

test("each incomplete SMTP configuration remains unavailable and never attempts delivery", async (t) => {
  const assertNoSideEffects = blockExternalTestAccountsAndLogs(t);
  const createTransport = t.mock.method(nodemailer, "createTransport", () => {
    throw new Error("Partial configuration must not start SMTP.");
  });
  for (const missing of [
    "CMS_SMTP_HOST",
    "CMS_SMTP_USER",
    "CMS_SMTP_PASSWORD",
    "CMS_SMTP_FROM",
  ] as const) {
    for (const absent of [undefined, ""]) {
      await withSMTP({ ...completeSMTP, [missing]: absent }, async () => {
        const factory = await cmsEmailAdapter();
        const adapter = factory({ payload: {} as Payload });
        assert.equal(adapter.name, "elvira-email-unavailable");
        await assert.rejects(
          () =>
            adapter.sendEmail({
              to: "owner@example.invalid",
              text: "private reset token",
            }),
          { status: 503 },
        );
      });
    }
  }
  assert.equal(createTransport.mock.callCount(), 0);
  assertNoSideEffects();
});

test("complete SMTP initializes a STARTTLS transport without verification or email delivery", async (t) => {
  const assertNoSideEffects = blockExternalTestAccountsAndLogs(t);
  const originalCreateTransport = nodemailer.createTransport;
  const transportOptions: unknown[] = [];
  let verifyCalls = 0;
  let sendCalls = 0;
  t.mock.method(
    nodemailer,
    "createTransport",
    (...args: Parameters<typeof originalCreateTransport>) => {
      transportOptions.push(args[0]);
      const transport = originalCreateTransport(...args);
      // These are public Nodemailer methods. Any accidental startup network activity fails before connecting.
      t.mock.method(transport, "verify", () => {
        verifyCalls++;
        throw new Error("Build-time SMTP verification is forbidden.");
      });
      t.mock.method(transport, "sendMail", () => {
        sendCalls++;
        throw new Error("Initialization must not send email.");
      });
      return transport;
    },
  );
  await withSMTP(completeSMTP, async () => {
    const factory = await cmsEmailAdapter();
    const adapter = factory({ payload: {} as Payload });
    assert.equal(adapter.name, "nodemailer");
    assert.equal(adapter.defaultFromAddress, "noreply@example.invalid");
    assert.equal(adapter.defaultFromName, "Elvira Studio");
  });
  assert.deepEqual(transportOptions, [
    {
      host: "smtp.example.invalid",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: "synthetic-owner", pass: "synthetic-test-password" },
    },
  ]);
  assert.equal(verifyCalls, 0);
  assert.equal(sendCalls, 0);
  assertNoSideEffects();
});
