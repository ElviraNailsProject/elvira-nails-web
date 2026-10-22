import assert from "node:assert/strict";
import test from "node:test";

import { cmsEnvironment } from "../src/cms/environment";

function withEnvironment(
  values: Record<string, string | undefined>,
  check: () => void,
) {
  const settings = {
    CMS_DATABASE_URL: "postgresql://cms:synthetic@db.example/cms",
    DATABASE_URL: undefined,
    DIRECT_URL: undefined,
    PAYLOAD_SECRET: "synthetic-test-secret-with-at-least-32-characters",
    APP_ORIGIN: "http://localhost:3000",
    CMS_STORAGE: "local",
    ...values,
  };
  const previous = Object.fromEntries(
    Object.keys(settings).map((key) => [key, process.env[key]]),
  );
  try {
    for (const [key, value] of Object.entries(settings)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    check();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("CMS implicit PostgreSQL port cannot bypass either Prisma database guard", () => {
  for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
    withEnvironment(
      {
        [key]: "postgresql://prisma:synthetic@db.example:5432/shared",
        CMS_DATABASE_URL: "postgresql://cms:synthetic@db.example/shared",
      },
      () => assert.throws(cmsEnvironment, /database separate from Prisma/),
    );
  }
});

test("explicit CMS port 5432 matches implicit Prisma port", () => {
  withEnvironment(
    {
      DATABASE_URL: "postgres://prisma:synthetic@db.example/shared",
      CMS_DATABASE_URL: "postgresql://cms:synthetic@db.example:5432/shared",
    },
    () => assert.throws(cmsEnvironment, /database separate from Prisma/),
  );
});

test("different database names on the same PostgreSQL server are accepted", () => {
  const cmsURL = "postgresql://cms:synthetic@db.example/cms";
  withEnvironment(
    {
      DATABASE_URL: "postgresql://prisma:synthetic@db.example:5432/app",
      DIRECT_URL: "postgresql://prisma:synthetic@db.example/app",
      CMS_DATABASE_URL: cmsURL,
    },
    () => assert.equal(cmsEnvironment().databaseURL, cmsURL),
  );
});

test("separate PostgreSQL instances on distinct ports remain accepted", () => {
  const cmsURL = "postgresql://cms:synthetic@db.example:5433/shared";
  withEnvironment(
    {
      DATABASE_URL: "postgresql://prisma:synthetic@db.example/shared",
      CMS_DATABASE_URL: cmsURL,
    },
    () => assert.equal(cmsEnvironment().databaseURL, cmsURL),
  );
});
