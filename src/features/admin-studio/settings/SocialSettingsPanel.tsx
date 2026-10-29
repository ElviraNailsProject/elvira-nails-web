import { Icon, Toggle } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { SettingsCard } from "./SettingsCard";
import { settingsMessages } from "./settings.messages";
import type { StudioSocialLink } from "./settings.types";
import styles from "./SocialSettingsPanel.module.css";

// Presentation belongs to the component, not to persisted browser drafts.
const platforms: Record<string, { icon: string; placeholder: string }> = {
  Instagram: { icon: "instagram", placeholder: "https://instagram.com/…" },
  Facebook: { icon: "facebook", placeholder: "https://facebook.com/…" },
  TikTok: { icon: "tiktok", placeholder: "https://tiktok.com/@…" },
  Telegram: { icon: "telegram", placeholder: "https://t.me/…" },
  YouTube: { icon: "youtube", placeholder: "https://youtube.com/@…" },
};

export function SocialSettingsPanel({
  socials,
  onChange,
}: {
  socials: StudioSocialLink[];
  onChange: (
    index: number,
    patch: Partial<Pick<StudioSocialLink, "url" | "enabled">>,
  ) => void;
}) {
  const { t } = useStudioTranslation(settingsMessages);
  return (
    <SettingsCard
      icon="social-links"
      title={t("socials")}
      description={t("socialDescription")}
    >
      <div className={styles.socials}>
        {socials.map((social, index) => (
          <div
            key={social.name}
            className={`${styles.socialRow} ${!social.enabled ? styles.inactive : ""}`}
          >
            <span className={styles.socialIcon}>
              <Icon name={platforms[social.name]?.icon ?? "social-links"} />
            </span>
            <label htmlFor={`studio-social-${social.name}`}>
              {social.name}
            </label>
            <input
              id={`studio-social-${social.name}`}
              aria-label={t("socialLink", { name: social.name })}
              type="url"
              pattern="https?://.+"
              value={social.url}
              placeholder={platforms[social.name]?.placeholder ?? "https://…"}
              maxLength={500}
              onChange={(event) => onChange(index, { url: event.target.value })}
            />
            <Toggle
              label={t("showSocial", { name: social.name })}
              checked={social.enabled}
              onChange={(enabled) => onChange(index, { enabled })}
            />
          </div>
        ))}
      </div>
    </SettingsCard>
  );
}
