"use client";

import { useTranslation } from "@payloadcms/ui";

const statusLabels = {
  ru: { STUDYING: "Учится", WAITING: "В ожидании", COMPLETED: "Закончила" },
  uk: {
    STUDYING: "Навчається",
    WAITING: "В очікуванні",
    COMPLETED: "Закінчила",
  },
  en: { STUDYING: "Studying", WAITING: "Waiting", COMPLETED: "Completed" },
  nl: {
    STUDYING: "In opleiding",
    WAITING: "In afwachting",
    COMPLETED: "Afgerond",
  },
} as const;

export function StatusCell({ cellData }: { cellData?: unknown }) {
  const { i18n } = useTranslation();
  const text =
    statusLabels[i18n.language as keyof typeof statusLabels] ?? statusLabels.ru;
  if (
    typeof cellData !== "string" ||
    !Object.hasOwn(statusLabels.ru, cellData)
  ) {
    return <span>—</span>;
  }

  const status = cellData as keyof typeof statusLabels.ru;
  return (
    <span
      className={`elvira-cms-status elvira-cms-status--${status.toLowerCase()}`}
    >
      {text[status]}
    </span>
  );
}
