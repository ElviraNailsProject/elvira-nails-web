import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { APIError, type EmailAdapter } from "payload";

/** Never create an external test inbox or log reset messages when SMTP is absent. */
const unavailableEmail: EmailAdapter = () => ({
  name: "elvira-email-unavailable",
  defaultFromAddress: "no-reply@example.invalid",
  defaultFromName: "Elvira",
  sendEmail: async () => {
    throw new APIError(
      "Восстановление пароля по почте пока недоступно. Администратору нужно настроить SMTP для сайта.",
      503,
    );
  },
});

export function cmsEmailAdapter(): EmailAdapter | Promise<EmailAdapter> {
  const host = process.env.CMS_SMTP_HOST?.trim();
  const user = process.env.CMS_SMTP_USER?.trim();
  const password = process.env.CMS_SMTP_PASSWORD;
  const from = process.env.CMS_SMTP_FROM?.trim();

  if (!host || !user || !password || !from) return unavailableEmail;

  return nodemailerAdapter({
    defaultFromAddress: from,
    defaultFromName: process.env.CMS_SMTP_FROM_NAME?.trim() || "Elvira",
    // Configuration and builds must not connect to the SMTP provider.
    skipVerify: true,
    transportOptions: {
      host,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass: password },
    },
  });
}
