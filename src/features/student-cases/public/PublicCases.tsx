import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type {
  PublicStudentCaseDto,
  StudentCaseLocale,
} from "@/features/student-cases/contracts";
import { casesHref, languages, publicCopy } from "./content";
import { publicContactHref } from "./contact-links";
import { siteHeaderConfig } from "@/config/site";
import styles from "./public-cases.module.css";

export function PublicCasesFrame({
  locale,
  children,
  fullWidth = false,
}: {
  locale: StudentCaseLocale;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <>
      <main
        className={`${styles.page} ${fullWidth ? styles.detailPage : ""}`}
        lang={locale.toLowerCase()}
      >
        {fullWidth ? (
          children
        ) : (
          <div className={styles.container}>{children}</div>
        )}
      </main>
      <StoriesFooter locale={locale} />
    </>
  );
}

const contactIcons = {
  EMAIL: { file: "c597f.svg", width: 27.43, height: 24, label: "Email" },
  INSTAGRAM: { file: "55853.svg", width: 24, height: 24, label: "Instagram" },
  TIKTOK: { file: "1dd5c.svg", width: 24, height: 24, label: "TikTok" },
  WEBSITE: {
    file: "f1df5.svg",
    width: 20.0006,
    height: 20.0006,
    label: "Website",
  },
  WHATSAPP: { file: "whatsapp.svg", width: 20, height: 20, label: "WhatsApp" },
  TELEGRAM: {
    file: "telegram.svg",
    width: 18.0167,
    height: 18.0167,
    label: "Telegram",
  },
} as const;

export function PublicCaseContacts({
  item,
  locale,
}: {
  item: PublicStudentCaseDto;
  locale: StudentCaseLocale;
}) {
  const contacts = item.contacts.flatMap((contact) => {
    const href = publicContactHref(contact);
    return href ? [{ ...contact, href }] : [];
  });
  if (!item.city && !contacts.length) return null;
  return (
    <div className={styles.contactRow}>
      <div className={styles.contactDivider}>
        <Image
          src="/student-cases/icons/4e6fa.svg"
          alt=""
          width={602}
          height={1}
        />
      </div>
      {item.city ? (
        <p className={styles.location}>
          <Image
            src="/student-cases/icons/9d73d.svg"
            alt=""
            width={17.0126}
            height={20.6665}
          />
          <span>{item.city}</span>
        </p>
      ) : null}
      {contacts.length ? (
        <nav
          className={styles.contacts}
          aria-label={publicCopy[locale].contacts}
        >
          {contacts.map((contact) => {
            const icon = contactIcons[contact.type];
            return (
              <a
                key={contact.type}
                href={contact.href}
                aria-label={`${icon.label}: ${contact.value}`}
                title={`${icon.label}: ${contact.value}`}
                rel="noopener noreferrer"
              >
                <Image
                  src={`/student-cases/icons/${icon.file}`}
                  alt=""
                  width={icon.width}
                  height={icon.height}
                />
              </a>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}

function StoriesFooter({ locale }: { locale: StudentCaseLocale }) {
  const copy = publicCopy[locale];
  return (
    <footer className={styles.footer} lang={locale.toLowerCase()}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          <div>
            <Link href="/" className={styles.footerBrand}>
              Elvira<span>Nail studio & academy</span>
            </Link>
            <p>{copy.studioDescription}</p>
          </div>
          <nav aria-label={copy.explore}>
            <h2>{copy.explore}</h2>
            {siteHeaderConfig.navigation
              .filter((item) => item.href !== "/")
              .map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
          </nav>
          <div>
            <h2>{copy.studio}</h2>
            <p>Leiderdorp, Netherlands</p>
            <Link href="/contact">{copy.footerContact}</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} Elvira Nail Studio & Academy
        </div>
      </div>
    </footer>
  );
}

export function LanguageLinks({
  locale,
  id,
  page = 1,
}: {
  locale: StudentCaseLocale;
  id?: string;
  page?: number;
}) {
  return (
    <nav className={styles.languages} aria-label={publicCopy[locale].languages}>
      {languages.map((language) => (
        <Link
          key={language.locale}
          href={casesHref(language.locale, page, id)}
          hrefLang={language.locale.toLowerCase()}
          aria-label={language.label}
          aria-current={language.locale === locale ? "page" : undefined}
        >
          {language.locale}
        </Link>
      ))}
    </nav>
  );
}

export function TranslationNote({
  locale,
  actualLocale,
}: {
  locale: StudentCaseLocale;
  actualLocale: StudentCaseLocale;
}) {
  if (locale === actualLocale) return null;
  const copy = publicCopy[locale];
  return (
    <p className={styles.translationNote}>
      {copy.fallback(copy.languageNames[actualLocale])}
    </p>
  );
}

export function PublicCaseCard({
  item,
  locale,
}: {
  item: PublicStudentCaseDto;
  locale: StudentCaseLocale;
}) {
  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const photo = cover?.url ?? item.studentPhoto;
  const copy = publicCopy[locale];
  return (
    <article className={styles.card}>
      <Link className={styles.cardLink} href={casesHref(locale, 1, item.id)}>
        <div className={styles.cardImage}>
          {photo ? (
            // Keep media on its access-checked route; the optimizer must not cache revoked publications.
            <Image
              src={photo}
              alt={cover?.altText ?? item.studentName}
              fill
              unoptimized
              sizes="(max-width: 620px) 100vw, (max-width: 960px) 50vw, 33vw"
            />
          ) : (
            <span className={styles.monogram} aria-hidden="true">
              {item.studentName.slice(0, 1)}
            </span>
          )}
          <span className={styles.status}>{copy.status[item.status]}</span>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.studentName}>
            {item.studentName}
            {item.city ? <span> · {item.city}</span> : null}
          </p>
          <h2 lang={item.locale.toLowerCase()}>{item.resultTitle}</h2>
          <TranslationNote locale={locale} actualLocale={item.locale} />
          <p className={styles.excerpt} lang={item.locale.toLowerCase()}>
            {item.story}
          </p>
          <span className={styles.textLink}>
            {copy.readStory}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export function UnavailableState({
  locale,
  href,
}: {
  locale: StudentCaseLocale;
  href: string;
}) {
  const copy = publicCopy[locale];
  return (
    <section className={styles.empty}>
      <h1>{copy.unavailableTitle}</h1>
      <p>{copy.unavailableText}</p>
      {/* A full reload retries a failed server query instead of reusing a cached router response. */}
      <a className={styles.button} href={href}>
        {copy.retry}
      </a>
    </section>
  );
}
