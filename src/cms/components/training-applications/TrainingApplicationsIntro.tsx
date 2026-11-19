"use client";

import { useConfig } from "@payloadcms/ui";
import Link from "next/link";
import { useCompactLayout } from "@/features/admin-studio/shared/ui/useCompactLayout";
import { useStudioTranslation } from "@/features/admin-studio/shared/i18n/useStudioTranslation";
import { trainingApplicationMessages } from "./training-application-messages";
import styles from "./TrainingApplicationsIntro.module.css";

export function TrainingApplicationsIntro() {
  const compact = useCompactLayout();
  const { config } = useConfig();
  const { t } = useStudioTranslation(trainingApplicationMessages);
  if (!compact) return null;
  return (
    <div className={styles.intro}>
      <p>{t("description")}</p>
      <nav aria-label={t("applications")} className={styles.tabs}>
        <Link href={`${config.routes.admin}/studio/appointments`}>
          {t("procedures")}
        </Link>
        <Link
          href={`${config.routes.admin}/collections/training-applications`}
          aria-current="page"
        >
          {t("training")}
        </Link>
      </nav>
    </div>
  );
}
