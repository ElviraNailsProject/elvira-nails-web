import { Icon } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { SettingsCard } from "./SettingsCard";
import { settingsMessages } from "./settings.messages";
import type { StudioSettings } from "./settings.types";
import styles from "./SettingsEmailPreview.module.css";

export function SettingsEmailPreview({
  settings,
}: {
  settings: StudioSettings;
}) {
  const { t } = useStudioTranslation(settingsMessages);
  return (
    <SettingsCard title={t("emailHeading")} compact>
      <div className={styles.email}>
        <div className={styles.emailLogo}>Elvira</div>
        <p>{t("greeting")}</p>
        <p className={styles.appointment}>{t("appointment")}</p>
        <div className={styles.emailAddress}>
          <Icon name="location-accent" />
          <div>
            <p>
              {settings.street || t("streetPreview")},{" "}
              {settings.postcode || t("postcodePreview")}{" "}
              {settings.city || t("cityPreview")}
            </p>
            <p>{settings.directions || t("directionsPreview")}</p>
            {/^https?:\/\//i.test(settings.mapUrl) && (
              <a
                href={settings.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("openMap")}
              </a>
            )}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
