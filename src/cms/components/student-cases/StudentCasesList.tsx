"use client";

import { useConfig, useListDrawerContext, useListQuery } from "@payloadcms/ui";
import Link from "next/link";
import type { StudentCase } from "../../payload-types";
import { StatusCell } from "../StatusCell";
import { useCompactLayout } from "@/features/admin-studio/shared/ui/useCompactLayout";
import { useStudioTranslation } from "@/features/admin-studio/shared/i18n/useStudioTranslation";
import styles from "./StudentCasesList.module.css";

const messages = {
  empty: {
    ru: "Кейсы не найдены.",
    uk: "Кейсів не знайдено.",
    en: "No student cases found.",
    nl: "Geen studentencases gevonden.",
  },
  period: {
    ru: "Период обучения",
    uk: "Період навчання",
    en: "Training period",
    nl: "Opleidingsperiode",
  },
  published: {
    ru: "Опубликовано",
    uk: "Опубліковано",
    en: "Published",
    nl: "Gepubliceerd",
  },
  draft: { ru: "Черновик", uk: "Чернетка", en: "Draft", nl: "Concept" },
  student: { ru: "Ученица", uk: "Учениця", en: "Student", nl: "Student" },
  status: {
    ru: "Статус обучения",
    uk: "Статус навчання",
    en: "Training status",
    nl: "Opleidingsstatus",
  },
  publication: {
    ru: "Публикация",
    uk: "Публікація",
    en: "Publication",
    nl: "Publicatie",
  },
};

export function StudentCasesList() {
  const compact = useCompactLayout();
  const { isInDrawer } = useListDrawerContext();
  const { config } = useConfig();
  const { data } = useListQuery();
  const { t, locale } = useStudioTranslation(messages);
  if (!compact || isInDrawer) return null;
  const cases = (data?.docs ?? []) as StudentCase[];
  return (
    <div className={styles.root}>
      {!cases.length && <p role="status">{t("empty")}</p>}
      {!!cases.length && (
        <div className={styles.headings} aria-hidden="true">
          <span>{t("student")}</span>
          <span>{t("period")}</span>
          <span>{t("status")}</span>
          <span>{t("publication")}</span>
        </div>
      )}
      <ul className={styles.list}>
        {cases.map((item) => {
          const contacts = item.contacts
            ?.filter(
              (contact) =>
                contact.type === "EMAIL" || contact.type === "WHATSAPP",
            )
            .map((contact) => contact.value)
            .join(" · ");
          const formatDate = (value?: string | null) => {
            if (!value) return "—";
            const date = new Date(value);
            return Number.isNaN(date.getTime())
              ? "—"
              : date.toLocaleDateString(locale);
          };
          return (
            <li key={item.id}>
              <Link
                className={styles.row}
                href={`${config.routes.admin}/collections/student-cases/${encodeURIComponent(item.id)}`}
              >
                <span className={styles.client}>
                  <span className={styles.avatar} aria-hidden="true">
                    {Array.from(item.studentName)[0]}
                  </span>
                  <span>
                    <strong>{item.studentName}</strong>
                    {contacts && <small>{contacts}</small>}
                  </span>
                </span>
                <span className={styles.date}>
                  <small>{t("period")}</small>
                  {item.trainingStartDate || item.trainingEndDate
                    ? `${formatDate(item.trainingStartDate)} – ${formatDate(item.trainingEndDate)}`
                    : "—"}
                </span>
                <span className={styles.status}>
                  <StatusCell cellData={item.status} />
                </span>
                <span className={styles.publication}>
                  {t(item._status === "published" ? "published" : "draft")}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
