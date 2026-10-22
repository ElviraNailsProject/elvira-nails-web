import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { studentCases } from "@/server/student-cases";
import {
  casesHref,
  publicCopy,
  publicLocale,
  publicPage,
  type PublicSearchParams,
} from "@/features/student-cases/public/content";
import {
  LanguageLinks,
  PublicCaseCard,
  PublicCasesFrame,
  UnavailableState,
} from "@/features/student-cases/public/PublicCases";
import styles from "@/features/student-cases/public/public-cases.module.css";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<PublicSearchParams> };

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const locale = publicLocale((await searchParams).locale);
  return { title: `${publicCopy[locale].title} | Elvira` };
}

export default async function StudentCasesPage({ searchParams }: Props) {
  const query = await searchParams;
  const locale = publicLocale(query.locale);
  const page = publicPage(query.page);
  const copy = publicCopy[locale];
  const result = await studentCases
    .listPublic({ locale, page, pageSize: 12 })
    .catch((error: unknown) => {
      console.error("Unable to load published student cases", error);
      return null;
    });

  if (result && page > Math.max(1, result.pagination.totalPages)) {
    redirect(casesHref(locale, Math.max(1, result.pagination.totalPages)));
  }

  return (
    <PublicCasesFrame locale={locale}>
      <div className={styles.toolbar}>
        <p className={styles.eyebrow}>{copy.eyebrow}</p>
        <LanguageLinks locale={locale} page={page} />
      </div>
      {result ? (
        <>
          <header className={styles.intro}>
            <h1>{copy.title}</h1>
            <p>{copy.introduction}</p>
          </header>
          {result.items.length ? (
            <div className={styles.grid}>
              {result.items.map((item) => (
                <PublicCaseCard key={item.id} item={item} locale={locale} />
              ))}
            </div>
          ) : (
            <section className={styles.empty}>
              <h2>{copy.emptyTitle}</h2>
              <p>{copy.emptyText}</p>
            </section>
          )}
          {result.pagination.totalPages > 1 ? (
            <nav className={styles.pagination} aria-label={copy.pagination}>
              {page > 1 ? (
                <Link href={casesHref(locale, page - 1)} rel="prev">
                  ← {copy.previous}
                </Link>
              ) : null}
              <p>{copy.page(page, result.pagination.totalPages)}</p>
              {page < result.pagination.totalPages ? (
                <Link href={casesHref(locale, page + 1)} rel="next">
                  {copy.next} →
                </Link>
              ) : null}
            </nav>
          ) : null}
        </>
      ) : (
        <UnavailableState locale={locale} href={casesHref(locale, page)} />
      )}
    </PublicCasesFrame>
  );
}
