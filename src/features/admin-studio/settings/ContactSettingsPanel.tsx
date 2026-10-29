import { Field } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { SettingsCard } from "./SettingsCard";
import { settingsMessages } from "./settings.messages";
import type { SettingsFieldChange, StudioSettings } from "./settings.types";
import styles from "./ContactSettingsPanel.module.css";

export function ContactSettingsPanel({
  settings,
  setField,
}: {
  settings: StudioSettings;
  setField: SettingsFieldChange;
}) {
  const { t } = useStudioTranslation(settingsMessages);
  return (
    <SettingsCard
      icon="phone"
      title={t("contacts")}
      description={t("contactDescription")}
    >
      <div className={styles.contactFields}>
        <Field label={t("phone")}>
          <input
            type="tel"
            value={settings.phone}
            onChange={(event) => setField("phone", event.target.value)}
            maxLength={40}
          />
        </Field>
        <Field label="WhatsApp">
          <input
            type="tel"
            value={settings.whatsapp}
            onChange={(event) => setField("whatsapp", event.target.value)}
            maxLength={40}
          />
        </Field>
        <Field label={t("customerEmail")}>
          <input
            type="email"
            value={settings.customerEmail}
            onChange={(event) => setField("customerEmail", event.target.value)}
            maxLength={254}
          />
        </Field>
        <Field label={t("notificationEmail")}>
          <input
            type="email"
            value={settings.notificationEmail}
            onChange={(event) =>
              setField("notificationEmail", event.target.value)
            }
            maxLength={254}
          />
        </Field>
        <div className={styles.fullWidth}>
          <Field label={t("hours")}>
            <input
              value={settings.hours}
              onChange={(event) => setField("hours", event.target.value)}
              maxLength={160}
            />
          </Field>
        </div>
      </div>
    </SettingsCard>
  );
}
