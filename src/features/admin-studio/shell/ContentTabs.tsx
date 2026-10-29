import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { shellMessages } from "./shell.messages";
import styles from "./ContentTabs.module.css";

type ContentTab = "courses" | "services" | "gallery";

export function ContentTabs({
  selected,
  counts,
}: {
  selected: ContentTab;
  counts: Record<ContentTab, number>;
}) {
  const { t } = useStudioTranslation(shellMessages);
  const params = useSearchParams();
  return (
    <nav className={styles.tabs} aria-label={t("contentSections")}>
      {(["courses", "services", "gallery"] as const).map((tab) => {
        const query = new URLSearchParams(params.toString());
        query.set("tab", tab);
        return (
          <Link
            key={tab}
            href={`/admin/studio/content?${query}`}
            scroll={false}
            aria-current={selected === tab ? "page" : undefined}
          >
            <Icon name={selected === tab ? `${tab}-active` : tab} />
            {t(tab)}
            <span className={styles.count}>{counts[tab]}</span>
          </Link>
        );
      })}
    </nav>
  );
}
