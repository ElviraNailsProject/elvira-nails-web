import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { nl } from "@payloadcms/translations/languages/nl";
import { ru } from "@payloadcms/translations/languages/ru";
import { uk } from "@payloadcms/translations/languages/uk";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Admins } from "./src/cms/collections/Admins";
import { Media } from "./src/cms/collections/Media";
import { StudentCases } from "./src/cms/collections/StudentCases";
import { TrainingApplications } from "./src/cms/collections/TrainingApplications";
import { cmsEnvironment } from "./src/cms/environment";
import { cmsEmailAdapter } from "./src/cms/email";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const env = cmsEnvironment();

export default buildConfig({
  secret: env.secret,
  email: cmsEmailAdapter(),
  serverURL: env.origin,
  routes: { admin: "/admin", api: "/api/cms" },
  cookiePrefix: "elvira-cms",
  cors: [env.origin],
  csrf: [env.origin],
  graphQL: { disable: true },
  admin: {
    user: "admins",
    theme: "light",
    meta: { titleSuffix: "— Elvira", robots: "noindex, nofollow" },
    importMap: {
      baseDir,
      importMapFile: path.resolve(
        baseDir,
        "src/app/(payload)/admin/importMap.ts",
      ),
    },
    components: {
      Nav: "/src/cms/components/AdminNav#EmptyNav",
      header: ["/src/cms/components/AdminNav#AdminNav"],
      graphics: { Logo: "/src/cms/components/Brand#BrandLogo" },
    },
  },
  i18n: { fallbackLanguage: "ru", supportedLanguages: { en, nl, ru, uk } },
  localization: {
    locales: [
      { label: "Nederlands · NL", code: "nl" },
      { label: "English · EN", code: "en" },
      { label: "Русский · RU", code: "ru" },
      { label: "Українська · UK", code: "uk" },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  collections: [Admins, StudentCases, TrainingApplications, Media],
  db: postgresAdapter({
    pool: { connectionString: env.databaseURL, ssl: env.databaseSSL },
    idType: "uuid",
    push: false,
    disableCreateDatabase: true,
    migrationDir: path.resolve(baseDir, "src/cms/migrations"),
  }),
  sharp,
  upload: {
    limits: { fileSize: 5 * 1024 * 1024 },
    requestSizeLimit: 6 * 1024 * 1024,
    abortOnLimit: true,
  },
  plugins: [
    s3Storage({
      enabled: env.storage === "s3",
      alwaysInsertFields: true,
      bucket: process.env.CMS_S3_BUCKET || "elvira-private-media",
      // Omit disablePayloadAccessControl: private files must pass Payload's read policy.
      collections: { media: true },
      config: {
        region: process.env.CMS_S3_REGION || "auto",
        endpoint: process.env.CMS_S3_ENDPOINT || undefined,
        forcePathStyle: process.env.CMS_S3_FORCE_PATH_STYLE === "true",
        credentials:
          env.storage === "s3"
            ? {
                accessKeyId: process.env.CMS_S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.CMS_S3_SECRET_ACCESS_KEY!,
              }
            : undefined,
      },
    }),
  ],
  typescript: { outputFile: path.resolve(baseDir, "src/cms/payload-types.ts") },
});
