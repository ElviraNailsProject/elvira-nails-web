import type { ReactNode } from "react";
import { Icon } from "../shared/ui/controls";
import styles from "./SettingsCard.module.css";

export function SettingsCard({
  icon,
  title,
  description,
  compact = false,
  children,
}: {
  icon?: string;
  title: string;
  description?: string;
  compact?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`${styles.card} ${compact ? styles.compact : ""}`}
      aria-label={title}
    >
      <header className={compact ? styles.compactHeader : styles.cardHeader}>
        {icon ? (
          <span className={styles.cardIcon}>
            <Icon name={icon} />
          </span>
        ) : null}
        <div>
          <h2>{title}</h2>
          {description ? <p>{description}</p> : null}
        </div>
      </header>
      {children}
    </section>
  );
}
