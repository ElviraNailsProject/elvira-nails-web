import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { StudentCaseLocale } from "@/features/student-cases/contracts";
import { studentCases } from "@/server/student-cases";
import { ApiError } from "@/server/http";
import {
  casesHref,
  publicCopy,
  publicLocale,
  type PublicSearchParams,
} from "@/features/student-cases/public/content";
import {
  LanguageLinks,
  PublicCasesFrame,
  TranslationNote,
  UnavailableState,
  PublicCaseContacts,
} from "@/features/student-cases/public/PublicCases";
import { CaseGallery } from "@/features/student-cases/public/CaseGallery";
import styles from "@/features/student-cases/public/public-cases.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<PublicSearchParams>;
};

const getPublishedCase = cache(
  async (id: string, locale: StudentCaseLocale) => {
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) notFound();
    try {
      return await studentCases.getPublic(id, locale);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) notFound();
      console.error("Unable to load a published student case", error);
      return null;
    }
  },
);

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = publicLocale(query.locale);
  const item = await getPublishedCase(id, locale);
  return {
    title: `${item ? `${item.studentName} · ${item.resultTitle}` : publicCopy[locale].title} | Elvira`,
  };
}

export default async function StudentCasePage({ params, searchParams }: Props) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const locale = publicLocale(query.locale);
  const copy = publicCopy[locale];
  const item = await getPublishedCase(id, locale);
  return (
    <PublicCasesFrame locale={locale} fullWidth>
      <div className={styles.profileSection}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <Link href={casesHref(locale)} className={styles.back}>
              <Image
                src="/student-cases/icons/0f2b3.svg"
                className={styles.backArrow}
                alt=""
                width={24.5}
                height={7.36396}
              />
              {copy.back}
            </Link>
            <LanguageLinks locale={locale} id={id} />
          </div>
          {item ? (
            <>
              <article className={styles.detail}>
                <div className={styles.portrait}>
                  {item.studentPhoto ? (
                    // Serve revocable public media directly, without Next image optimizer caching.
                    <Image
                      src={item.studentPhoto}
                      alt={item.studentName}
                      fill
                      unoptimized
                      priority
                      sizes="(max-width: 620px) 100vw, 50vw"
                    />
                  ) : (
                    <span className={styles.monogram} aria-hidden="true">
                      {item.studentName.slice(0, 1)}
                    </span>
                  )}
                </div>
                <div className={styles.detailInfo}>
                  <p className={styles.eyebrow}>{copy.caseLabel}</p>
                  <h1>{item.studentName}</h1>
                  <p
                    className={styles.resultTitle}
                    lang={item.locale.toLowerCase()}
                  >
                    {item.resultTitle}
                  </p>
                  <TranslationNote locale={locale} actualLocale={item.locale} />
                  <Image
                    className={styles.shortDivider}
                    src="/student-cases/icons/4087b.svg"
                    alt=""
                    width={120}
                    height={1}
                  />
                  <p className={styles.story} lang={item.locale.toLowerCase()}>
                    {item.story}
                  </p>
                  <PublicCaseContacts item={item} locale={locale} />
                  {item.testimonial ? (
                    <section className={styles.testimonial}>
                      <h2>{copy.testimonial}</h2>
                      <blockquote lang={item.locale.toLowerCase()}>
                        {item.testimonial}
                      </blockquote>
                    </section>
                  ) : null}
                </div>
              </article>
            </>
          ) : (
            <UnavailableState locale={locale} href={casesHref(locale, 1, id)} />
          )}
        </div>
      </div>
      {item ? (
        <CaseGallery key={item.id} images={item.images} locale={locale} />
      ) : null}
    </PublicCasesFrame>
  );
}
