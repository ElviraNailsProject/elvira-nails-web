import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ path: ".env", quiet: true });

const email = process.env.CMS_ADMIN_EMAIL;
const password = process.env.CMS_ADMIN_PASSWORD;
const name = process.env.CMS_ADMIN_NAME || "Владелец";
if (!email || !password || password.length < 16)
  throw new Error(
    "Set CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD (at least 16 characters) for the first owner.",
  );
const { getPayload } = await import("payload");
const { default: config } = await import("../payload.config");
const cms = await getPayload({ config });
try {
  const existing = await cms.find({
    collection: "admins",
    limit: 1,
    overrideAccess: true,
  });
  if (existing.totalDocs)
    throw new Error(
      "An owner already exists. Use the authenticated CMS to manage accounts.",
    );
  await cms.create({
    collection: "admins",
    overrideAccess: true,
    context: { cmsBootstrapAdmin: true },
    data: { email, password, name },
  });
  console.log(
    "Owner created. Sign in at /admin/login. No public registration is enabled.",
  );
} finally {
  await cms.destroy();
}
