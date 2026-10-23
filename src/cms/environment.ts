function decoded(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function hostname(database: URL) {
  return database.hostname.toLowerCase().replace(/\.$/, "");
}

function validatedDatabaseURL(value: string) {
  const database = new URL(value);
  // pg accepts routing overrides in the query; require one unambiguous identity.
  if (
    ["user", "host", "port", "database"].some((key) =>
      database.searchParams.has(key),
    )
  ) {
    throw new Error(
      "Database URLs must specify user, host, port and database in the URL authority/path, not query parameters.",
    );
  }
  return database;
}

function supabaseProject(database: URL) {
  if (!["5432", "6543"].includes(database.port || "5432")) return;

  const host = hostname(database);
  const direct = /^db\.([a-z]{20})\.supabase\.co$/.exec(host);
  if (direct) return direct[1];

  if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.pooler\.supabase\.com$/.test(host)) {
    return /^.+\.([a-z]{20})$/.exec(decoded(database.username))?.[1];
  }
}

function sameDatabase(first: URL, second: URL) {
  const firstProject = supabaseProject(first);
  const secondProject = supabaseProject(second);
  // Supavisor routes tenants by the username; a regional host serves many projects.
  const sameServer =
    firstProject && secondProject
      ? firstProject === secondProject
      : hostname(first) === hostname(second) &&
        (first.port || "5432") === (second.port || "5432");

  return sameServer && decoded(first.pathname) === decoded(second.pathname);
}

/** CMS owns its own database. Never let schema migrations target the existing Prisma database. */
export function cmsEnvironment() {
  const databaseURL = process.env.CMS_DATABASE_URL;
  const secret = process.env.PAYLOAD_SECRET;
  if (!databaseURL || !secret || secret.length < 32) {
    throw new Error(
      "Set CMS_DATABASE_URL and PAYLOAD_SECRET (at least 32 characters). See docs/payload-cms.md.",
    );
  }
  const cmsDB = validatedDatabaseURL(databaseURL);
  if (!["postgres:", "postgresql:"].includes(cmsDB.protocol)) {
    throw new Error(
      "CMS_DATABASE_URL must point to a dedicated PostgreSQL database.",
    );
  }
  const certificate = process.env.CMS_DATABASE_SSL_CA?.trim().replace(
    /\\n/g,
    "\n",
  );
  if (
    certificate &&
    [
      "ssl",
      "sslmode",
      "sslrootcert",
      "sslcert",
      "sslkey",
      "sslnegotiation",
    ].some((key) => cmsDB.searchParams.has(key))
  ) {
    throw new Error(
      "Remove SSL query parameters from CMS_DATABASE_URL when using CMS_DATABASE_SSL_CA; the supplied CA enables verified TLS.",
    );
  }
  const databaseSSL = certificate
    ? { ca: certificate, rejectUnauthorized: true }
    : undefined;
  for (const existing of [process.env.DATABASE_URL, process.env.DIRECT_URL]) {
    if (!existing) continue;
    const appDB = validatedDatabaseURL(existing);
    if (sameDatabase(appDB, cmsDB)) {
      throw new Error(
        "Payload must use a database separate from Prisma. Change CMS_DATABASE_URL.",
      );
    }
  }
  const origin = new URL(process.env.APP_ORIGIN || "http://localhost:3000")
    .origin;
  const storage = process.env.CMS_STORAGE || "local";
  if (storage !== "local" && storage !== "s3")
    throw new Error("CMS_STORAGE must be local or s3.");
  if (
    storage === "s3" &&
    (!process.env.CMS_S3_BUCKET ||
      !process.env.CMS_S3_ACCESS_KEY_ID ||
      !process.env.CMS_S3_SECRET_ACCESS_KEY)
  ) {
    throw new Error("Configure a private S3 bucket and CMS_S3 credentials.");
  }
  return { databaseURL, databaseSSL, secret, origin, storage };
}
