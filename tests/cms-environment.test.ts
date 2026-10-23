import assert from "node:assert/strict";
import test from "node:test";

import { cmsEnvironment } from "../src/cms/environment";

function withEnvironment(
  values: Record<string, string | undefined>,
  check: () => void,
) {
  const settings = {
    CMS_DATABASE_URL: "postgresql://cms:synthetic@db.example/cms",
    CMS_DATABASE_SSL_CA: undefined,
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

const appProject = "abcdefghijklmnopqrst";
const cmsProject = "bcdefghijklmnopqrstu";
const pooler = "aws-0-eu-west-3.pooler.supabase.com";

test("distinct Supabase projects sharing a regional pooler are accepted", () => {
  for (const port of ["5432", "6543"]) {
    const cmsURL = `postgresql://payload.${cmsProject}:synthetic@${pooler}:${port}/postgres`;
    withEnvironment(
      {
        DATABASE_URL: `postgresql://prisma.${appProject}:synthetic@${pooler}:${port}/postgres`,
        DIRECT_URL: `postgresql://postgres:synthetic@db.${appProject}.supabase.co/postgres`,
        CMS_DATABASE_URL: cmsURL,
      },
      () => assert.equal(cmsEnvironment().databaseURL, cmsURL),
    );
  }
});

test("the same Supabase project is rejected across roles and pooler modes", () => {
  for (const key of ["DATABASE_URL", "DIRECT_URL"]) {
    for (const port of ["5432", "6543"]) {
      withEnvironment(
        {
          [key]: `postgresql://prisma.${appProject}:one@${pooler}:5432/postgres`,
          CMS_DATABASE_URL: `postgresql://payload.${appProject}:two@${pooler}:${port}/postgres`,
        },
        () => assert.throws(cmsEnvironment, /database separate from Prisma/),
      );
    }
  }
});

test("direct and pooled connections to one Supabase database are rejected in either direction", () => {
  for (const directPort of ["5432", "6543"]) {
    for (const poolerPort of ["5432", "6543"]) {
      const direct = `postgresql://postgres:one@db.${appProject}.supabase.co:${directPort}/postgres`;
      const pooled = `postgresql://payload.${appProject}:two@${pooler}:${poolerPort}/postgres`;
      for (const [appURL, cmsURL] of [
        [direct, pooled],
        [pooled, direct],
      ]) {
        withEnvironment({ DIRECT_URL: appURL, CMS_DATABASE_URL: cmsURL }, () =>
          assert.throws(cmsEnvironment, /database separate from Prisma/),
        );
      }
    }
  }
});

test("Supabase identity ignores encoded credentials, DNS case and pooler host differences", () => {
  withEnvironment(
    {
      DATABASE_URL: `postgresql://prisma.${appProject}:one@${pooler}/postgres`,
      CMS_DATABASE_URL: `postgresql://payload%2E${appProject}:two@AWS-1-EU-WEST-3.POOLER.SUPABASE.COM.:6543/%70ostgres`,
    },
    () => assert.throws(cmsEnvironment, /database separate from Prisma/),
  );
});

test("different database names within a Supabase project remain distinct", () => {
  const cmsURL = `postgresql://payload.${appProject}:synthetic@${pooler}:6543/cms`;
  withEnvironment(
    {
      DATABASE_URL: `postgresql://postgres:synthetic@db.${appProject}.supabase.co/postgres`,
      CMS_DATABASE_URL: cmsURL,
    },
    () => assert.equal(cmsEnvironment().databaseURL, cmsURL),
  );
});

test("ordinary hosts cannot use Supabase-like usernames to bypass isolation", () => {
  for (const host of [
    "db.example",
    "pooler.supabase.com.example",
    "aws-0.pooler.supabase.com.example",
  ]) {
    withEnvironment(
      {
        DATABASE_URL: `postgresql://prisma.${appProject}:one@${host}/postgres`,
        CMS_DATABASE_URL: `postgresql://payload.${cmsProject}:two@${host}:5432/postgres`,
      },
      () => assert.throws(cmsEnvironment, /database separate from Prisma/),
    );
  }
});

test("unrecognized pooler usernames preserve the endpoint guard", () => {
  for (const username of ["payload", "payload.shortref", "payload%invalid"]) {
    withEnvironment(
      {
        DATABASE_URL: `postgresql://prisma.${appProject}:one@${pooler}/postgres`,
        CMS_DATABASE_URL: `postgresql://${username}:two@${pooler}:5432/postgres`,
      },
      () => assert.throws(cmsEnvironment, /database separate from Prisma/),
    );
  }
});

test("ordinary PostgreSQL identity normalizes DNS and encoded database names", () => {
  withEnvironment(
    {
      DATABASE_URL: "postgresql://prisma:one@DB.EXAMPLE./shared",
      CMS_DATABASE_URL: "postgresql://cms:two@db.example:5432/%73hared",
    },
    () => assert.throws(cmsEnvironment, /database separate from Prisma/),
  );
});

test("a supplied database CA enables verified TLS and restores escaped newlines", () => {
  withEnvironment(
    { CMS_DATABASE_SSL_CA: "  certificate\\nsecond-line  " },
    () =>
      assert.deepEqual(cmsEnvironment().databaseSSL, {
        ca: "certificate\nsecond-line",
        rejectUnauthorized: true,
      }),
  );
});

test("connection URL options cannot override the explicitly trusted database CA", () => {
  for (const setting of [
    "ssl=false",
    "sslmode=disable",
    "sslmode=require",
    "sslrootcert=other.crt",
    "sslcert=other.crt",
    "sslkey=other.key",
    "sslnegotiation=direct",
  ]) {
    withEnvironment(
      {
        CMS_DATABASE_SSL_CA: "certificate",
        CMS_DATABASE_URL: `postgresql://cms:synthetic@db.example/cms?${setting}`,
      },
      () => assert.throws(cmsEnvironment, /Remove SSL query parameters/),
    );
  }
});

test("local PostgreSQL retains its existing SSL configuration when no CA is supplied", () => {
  withEnvironment({}, () =>
    assert.equal(cmsEnvironment().databaseSSL, undefined),
  );
});

test("query routing overrides cannot bypass database identity checks", () => {
  for (const key of ["CMS_DATABASE_URL", "DATABASE_URL", "DIRECT_URL"]) {
    for (const setting of [
      `user=payload.${appProject}`,
      `host=db.${appProject}.supabase.co`,
      "port=5432",
      "database=postgres",
    ]) {
      withEnvironment(
        {
          DATABASE_URL: `postgresql://prisma.${appProject}:one@${pooler}/postgres`,
          [key]: `postgresql://payload.${cmsProject}:two@${pooler}:6543/postgres?${setting}`,
        },
        () => assert.throws(cmsEnvironment, /not query parameters/),
      );
    }
  }
});
