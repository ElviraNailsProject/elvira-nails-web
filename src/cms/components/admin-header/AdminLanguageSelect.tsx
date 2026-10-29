"use client";

import { useTranslation } from "@payloadcms/ui";
import { useState } from "react";
import {
  getStudioLocale,
  studioLocales,
  type StudioLocale,
} from "@/features/admin-studio/shared/i18n/studio-translations";
import styles from "./AdminLanguageSelect.module.css";

const labels = {
  ru: "Язык интерфейса",
  uk: "Мова інтерфейсу",
  en: "Interface language",
  nl: "Interfacetaal",
};
const languageNames = {
  ru: "Русский",
  uk: "Українська",
  en: "English",
  nl: "Nederlands",
};

export function AdminLanguageSelect() {
  const { i18n, switchLanguage } = useTranslation();
  const [pending, setPending] = useState(false);
  const language = getStudioLocale(i18n.language);

  return (
    <label className={styles.field}>
      <span>{labels[language]}</span>
      <select
        value={language}
        disabled={pending || !switchLanguage}
        onChange={async (event) => {
          const next = event.currentTarget.value as StudioLocale;
          setPending(true);
          try {
            await switchLanguage?.(next);
          } finally {
            setPending(false);
          }
        }}
      >
        {studioLocales.map((locale) => (
          <option key={locale} value={locale}>
            {languageNames[locale]}
          </option>
        ))}
      </select>
    </label>
  );
}
