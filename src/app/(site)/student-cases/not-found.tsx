"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import type { StudentCaseLocale } from "@/features/student-cases/contracts";
import {
  casesHref,
  publicCopy,
  publicLocale,
} from "@/features/student-cases/public/content";
import { PublicCasesFrame } from "@/features/student-cases/public/PublicCases";
import styles from "@/features/student-cases/public/public-cases.module.css";

function MissingStory({ locale }: { locale: StudentCaseLocale }) {
  const copy = publicCopy[locale];
  return (
    <PublicCasesFrame locale={locale}>
      <section className={styles.empty}>
        <p className={styles.eyebrow}>Elvira · 404</p>
        <h1>{copy.missingTitle}</h1>
        <p>{copy.missingText}</p>
        <Link className={styles.button} href={casesHref(locale)}>
          {copy.back} <span aria-hidden="true">→</span>
        </Link>
      </section>
    </PublicCasesFrame>
  );
}

function LocalizedMissingStory() {
  const query = useSearchParams();
  return (
    <MissingStory locale={publicLocale(query.get("locale") ?? undefined)} />
  );
}

export default function StudentCaseNotFound() {
  return (
    <Suspense fallback={<MissingStory locale="EN" />}>
      <LocalizedMissingStory />
    </Suspense>
  );
}
