import { Field, Icon } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { SettingsCard } from "./SettingsCard";
import { settingsMessages } from "./settings.messages";
import type { SettingsFieldChange, StudioSettings } from "./settings.types";
import styles from "./AddressSettingsPanel.module.css";

export function AddressSettingsPanel({
  settings,
  setField,
}: {
  settings: StudioSettings;
  setField: SettingsFieldChange;
}) {
  const { t } = useStudioTranslation(settingsMessages);
  return (
    <SettingsCard
      icon="location"
      title={t("address")}
      description={t("addressDescription")}
    >
      <div className={styles.addressFields}>
        <div className={styles.addressNotice}>
          <Icon name="email" />
          <p>{t("addressNotice")}</p>
        </div>
        <Field label={t("street")}>
          <input
            value={settings.street}
            placeholder="ul. Przykładowa 12/4"
            onChange={(event) => setField("street", event.target.value)}
            maxLength={200}
          />
        </Field>
        <div className={styles.cityFields}>
          <Field label={t("postcode")}>
            <input
              value={settings.postcode}
              placeholder="00-000"
              onChange={(event) => setField("postcode", event.target.value)}
              maxLength={16}
            />
          </Field>
          <Field label={t("city")}>
            <input
              value={settings.city}
              placeholder="Warszawa"
              onChange={(event) => setField("city", event.target.value)}
              maxLength={100}
            />
          </Field>
        </div>
        <Field label={t("directions")}>
          <textarea
            value={settings.directions}
            placeholder={t("directionsPlaceholder")}
            onChange={(event) => setField("directions", event.target.value)}
            maxLength={500}
            rows={3}
          />
        </Field>
        <Field label={t("mapLink")}>
          <input
            type="url"
            pattern="https?://.+"
            value={settings.mapUrl}
            placeholder="https://maps.google.com/…"
            onChange={(event) => setField("mapUrl", event.target.value)}
            maxLength={1000}
          />
        </Field>
      </div>
    </SettingsCard>
  );
}
