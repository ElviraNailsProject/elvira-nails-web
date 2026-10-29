"use client";

import { Button, Icon } from "../shared/ui/controls";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import shared from "../shared/styles/layout.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { initialSettings } from "./settings.demo";
import { settingsMessages } from "./settings.messages";
import type { SettingsTextField } from "./settings.types";
import { AddressSettingsPanel } from "./AddressSettingsPanel";
import { ContactSettingsPanel } from "./ContactSettingsPanel";
import { SettingsEmailPreview } from "./SettingsEmailPreview";
import { SocialSettingsPanel } from "./SocialSettingsPanel";
import styles from "./SettingsEditor.module.css";

export function SettingsEditor() {
  const { t } = useStudioTranslation(settingsMessages);
  const [settings, setSettings, save, reset] = useLocalDraft(
    "settings",
    initialSettings,
  );
  const setField = (field: SettingsTextField, value: string) => {
    setSettings((current) => ({ ...current, [field]: value }));
  };

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className={shared.pageHeading}>
        <div>
          <p className={shared.eyebrow}>{t("section")}</p>
          <h1>{t("title")}</h1>
          <p className={shared.subtitle}>{t("description")}</p>
        </div>
        <div className={shared.actions}>
          <Button type="button" variant="secondary" onClick={reset}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary">
            <Icon name="check" />
            {t("save")}
          </Button>
        </div>
      </div>

      <div className={styles.columns}>
        <div className={styles.stack}>
          <ContactSettingsPanel settings={settings} setField={setField} />

          <SocialSettingsPanel
            socials={settings.socials}
            onChange={(index, patch) =>
              setSettings((current) => ({
                ...current,
                socials: current.socials.map((social, socialIndex) =>
                  socialIndex === index ? { ...social, ...patch } : social,
                ),
              }))
            }
          />
        </div>

        <div className={styles.stack}>
          <AddressSettingsPanel settings={settings} setField={setField} />

          <SettingsEmailPreview settings={settings} />
        </div>
      </div>
    </form>
  );
}
