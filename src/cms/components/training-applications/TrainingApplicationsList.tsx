"use client";

import {
  useConfig,
  useListDrawerContext,
  useListQuery,
  useRouteCache,
} from "@payloadcms/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TrainingApplication } from "@/cms/payload-types";
import { ConfirmDialog } from "@/features/admin-studio/shared/ui/ConfirmDialog";
import { Icon } from "@/features/admin-studio/shared/ui/controls";
import { useCompactLayout } from "@/features/admin-studio/shared/ui/useCompactLayout";
import { useStudioTranslation } from "@/features/admin-studio/shared/i18n/useStudioTranslation";
import { StatusCell } from "../StatusCell";
import { TrainingApplicationDetails } from "./TrainingApplicationDetails";
import { trainingApplicationMessages } from "./training-application-messages";
import styles from "./TrainingApplicationsList.module.css";

type Props = { hasDeletePermission?: boolean };

/** Keeps Payload's query, access checks, filters and pagination as the source of data. */
export function TrainingApplicationsList(props: Props) {
  const compact = useCompactLayout();
  const { isInDrawer } = useListDrawerContext();
  if (!compact || isInDrawer) return null;
  return <CompactApplications {...props} />;
}

function CompactApplications({ hasDeletePermission = false }: Props) {
  const { t, locale } = useStudioTranslation(trainingApplicationMessages);
  const { config } = useConfig();
  const { data, handlePageChange } = useListQuery();
  const { clearRouteCache } = useRouteCache();
  const router = useRouter();
  const [selected, setSelected] = useState<TrainingApplication | null>(null);
  const [deleting, setDeleting] = useState<TrainingApplication | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const applications = (data?.docs ?? []) as TrainingApplication[];
  const collectionURL = `${config.routes.admin}/collections/training-applications`;
  const editHref = (id: string) => `${collectionURL}/${encodeURIComponent(id)}`;

  function openApplication(application: TrainingApplication) {
    setError("");
    setNotice("");
    setSelected(application);
  }

  async function deleteApplication() {
    if (!deleting || pending || !hasDeletePermission) return;
    const application = deleting;
    setDeleting(null);
    setPending(true);
    setError("");
    try {
      const response = await fetch(
        `${config.routes.api}/training-applications/${encodeURIComponent(application.id)}`,
        {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Accept-Language": locale },
        },
      );
      if (!response.ok) throw new Error("delete_failed");
      setSelected(null);
      setNotice(t("deleted"));
      clearRouteCache();
      if (applications.length === 1 && (data?.page ?? 1) > 1) {
        await handlePageChange?.((data?.page ?? 1) - 1);
      }
      router.refresh();
    } catch {
      setError(t("deleteFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={styles.root} data-training-application-list>
      {!applications.length && <p role="status">{t("empty")}</p>}
      {applications.length > 0 && (
        <div className={styles.headings} aria-hidden="true">
          <span>{t("date")}</span>
          <span>{t("name")}</span>
          <span>{t("contacts")}</span>
          <span>{t("status")}</span>
          <span>{t("actions")}</span>
        </div>
      )}
      {applications.length > 0 && (
        <ul className={styles.list}>
          {applications.map((application) => {
            const date = new Date(application.applicationDate);
            const validDate = !Number.isNaN(date.getTime());
            return (
              <li className={styles.row} key={application.id}>
                <time
                  className={styles.date}
                  dateTime={application.applicationDate}
                >
                  {validDate ? date.toLocaleDateString(locale) : "—"}
                  {validDate && (
                    <span>
                      {date.toLocaleDateString(locale, { weekday: "short" })}
                    </span>
                  )}
                </time>
                <button
                  className={styles.open}
                  type="button"
                  onClick={() => openApplication(application)}
                  aria-label={t("open", { name: application.fullName })}
                >
                  <span>{application.fullName}</span>
                  <Icon name="chevron-right" />
                </button>
                <div className={styles.contacts}>
                  <span>{application.phone || "—"}</span>
                  <span>{application.email}</span>
                </div>
                <div className={styles.status}>
                  <StatusCell cellData={application.status} />
                </div>
                <div className={styles.actions}>
                  <Link
                    href={editHref(application.id)}
                    aria-label={`${t("edit")}: ${application.fullName}`}
                  >
                    <Icon name="application-row-edit" />
                  </Link>
                  {hasDeletePermission && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => setDeleting(application)}
                      aria-label={`${t("delete")}: ${application.fullName}`}
                    >
                      <Icon name="application-row-delete" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {notice && <p role="status">{notice}</p>}
      {!selected && pending && <p role="status">{t("deletePending")}</p>}
      {!selected && error && <p role="alert">{error}</p>}
      {selected && (
        <TrainingApplicationDetails
          application={selected}
          editHref={editHref(selected.id)}
          canDelete={hasDeletePermission}
          pending={pending}
          error={error}
          onClose={() => {
            if (!pending) setSelected(null);
          }}
          onDelete={() => setDeleting(selected)}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title={t("deleteTitle")}
          onCancel={() => setDeleting(null)}
          onConfirm={deleteApplication}
        >
          <p>{t("deleteHint", { name: deleting.fullName })}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}
