"use client";

import Link from "next/link";
import type { TrainingApplication } from "@/cms/payload-types";
import { StatusCell } from "../StatusCell";
import { ResponsiveDetails } from "@/features/admin-studio/shared/ui/ResponsiveDetails";
import { Icon } from "@/features/admin-studio/shared/ui/controls";
import { useStudioTranslation } from "@/features/admin-studio/shared/i18n/useStudioTranslation";
import { trainingApplicationMessages } from "./training-application-messages";
import styles from "./TrainingApplicationDetails.module.css";

export function TrainingApplicationDetails({
  application,
  editHref,
  canDelete,
  pending,
  error,
  onClose,
  onDelete,
}: {
  application: TrainingApplication;
  editHref: string;
  canDelete: boolean;
  pending: boolean;
  error: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { t, locale } = useStudioTranslation(trainingApplicationMessages);
  const date = new Date(application.applicationDate);
  const formattedDate = Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString(locale, { dateStyle: "long", timeStyle: "short" });
  const actions = (
    <div className={styles.actions}>
      <Link
        href={editHref}
        aria-disabled={pending}
        onClick={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <Icon name="application-edit" />
        {t("edit")}
      </Link>
      {canDelete && (
        <button type="button" disabled={pending} onClick={onDelete}>
          <Icon name="application-delete" />
          {t("delete")}
        </button>
      )}
    </div>
  );

  return (
    <ResponsiveDetails
      open
      busy={pending}
      onClose={onClose}
      label={t("application")}
      headerActions={
        <div className={styles.headerActions}>
          <StatusCell cellData={application.status} />
          {actions}
        </div>
      }
    >
      <div className={styles.body}>
        <section className={`${styles.card} ${styles.client}`}>
          <Icon name="applicant" />
          <div>
            <h3>{t("client")}</h3>
            <dl>
              <dt>{t("name")}</dt>
              <dd>{application.fullName}</dd>
              <dt>{t("phone")}</dt>
              <dd>{application.phone || "—"}</dd>
              <dt>{t("email")}</dt>
              <dd>{application.email}</dd>
            </dl>
          </div>
        </section>
        <section className={`${styles.card} ${styles.status}`}>
          <Icon name="application-status" />
          <div>
            <h3>{t("status")}</h3>
            <StatusCell cellData={application.status} />
          </div>
        </section>
        <section className={`${styles.card} ${styles.comment}`}>
          <Icon name="application-comment" />
          <div>
            <h3>{t("comment")}</h3>
            <p className={styles.message}>
              {application.message || t("noComment")}
            </p>
          </div>
        </section>
        <section className={`${styles.card} ${styles.date}`}>
          <Icon name="application-date" />
          <div>
            <h3>{t("date")}</h3>
            <time dateTime={application.applicationDate}>{formattedDate}</time>
          </div>
        </section>
        {pending && <p role="status">{t("deletePending")}</p>}
        {error && <p role="alert">{error}</p>}
      </div>
      <footer className={styles.footer}>{actions}</footer>
    </ResponsiveDetails>
  );
}
