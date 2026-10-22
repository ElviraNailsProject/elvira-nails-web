/** CMS owns its own database. Never let schema migrations target the existing Prisma database. */
export function cmsEnvironment() {
  const databaseURL = process.env.CMS_DATABASE_URL;
  const secret = process.env.PAYLOAD_SECRET;
  if (!databaseURL || !secret || secret.length < 32) {
    throw new Error(
      "Set CMS_DATABASE_URL and PAYLOAD_SECRET (at least 32 characters). See docs/payload-cms.md.",
    );
  }
  const cmsDB = new URL(databaseURL);
  if (!["postgres:", "postgresql:"].includes(cmsDB.protocol)) {
    throw new Error(
      "CMS_DATABASE_URL must point to a dedicated PostgreSQL database.",
    );
  }
  for (const existing of [process.env.DATABASE_URL, process.env.DIRECT_URL]) {
    if (!existing) continue;
    const appDB = new URL(existing);
    if (
      appDB.hostname === cmsDB.hostname &&
      (appDB.port || "5432") === (cmsDB.port || "5432") &&
      appDB.pathname === cmsDB.pathname
    ) {
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
  return { databaseURL, secret, origin, storage };
}
