"use client";

import { Link, useAuth, useConfig, useTranslation } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./Brand";

const labels = {
  ru: {
    navigation: "Навигация администратора",
    applications: "Заявки на обучение",
    cases: "Кейсы учениц",
    media: "Медиатека",
    settings: "Настройки",
    website: "На сайт",
    account: "Аккаунт",
    administrator: "Администратор",
    logout: "Выйти",
  },
  uk: {
    navigation: "Навігація адміністратора",
    applications: "Заявки на навчання",
    cases: "Кейси учениць",
    media: "Медіатека",
    settings: "Налаштування",
    website: "На сайт",
    account: "Акаунт",
    administrator: "Адміністратор",
    logout: "Вийти",
  },
  en: {
    navigation: "Administration navigation",
    applications: "Training enquiries",
    cases: "Student cases",
    media: "Media library",
    settings: "Settings",
    website: "View website",
    account: "Account",
    administrator: "Administrator",
    logout: "Log out",
  },
  nl: {
    navigation: "Beheernavigatie",
    applications: "Opleidingsaanvragen",
    cases: "Studentencases",
    media: "Mediabibliotheek",
    settings: "Instellingen",
    website: "Naar de website",
    account: "Account",
    administrator: "Beheerder",
    logout: "Uitloggen",
  },
} as const;

export function EmptyNav() {
  return null;
}

/** Uses Payload's supported header slot; its forms and locale controls stay native. */
export function AdminNav() {
  const { user } = useAuth();
  const { config } = useConfig();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const language = i18n.language;
  const text = labels[language as keyof typeof labels] ?? labels.ru;

  if (!user) return null;

  const admin = config.routes.admin;
  const accountHref = `${admin}${config.admin.routes.account}`;
  const logoutHref = `${admin}${config.admin.routes.logout}`;
  const name =
    (typeof user.name === "string" && user.name.trim()) ||
    (typeof user.email === "string" && user.email) ||
    text.account;
  const initials = name
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase(language);
  const items = [
    {
      href: `${admin}/collections/training-applications`,
      label: text.applications,
      icon: "/admin/icons/3ef76.svg",
    },
    {
      href: `${admin}/collections/student-cases`,
      label: text.cases,
      icon: "/admin/icons/1e3be.svg",
    },
    {
      href: `${admin}/collections/media`,
      label: text.media,
      icon: "/admin/icons/e6586.svg",
    },
    {
      href: accountHref,
      label: text.settings,
      icon: "/admin/icons/76c50.svg",
    },
  ];

  return (
    <div className="elvira-cms-header">
      <Link
        aria-label="Elvira"
        className="elvira-cms-header__brand"
        href={admin}
      >
        <BrandLogo />
      </Link>

      <nav aria-label={text.navigation} className="elvira-cms-header__nav">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className="elvira-cms-header__link"
              href={item.href}
              key={item.href}
            >
              {/* The supplied Figma icons keep their original SVG dimensions. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" aria-hidden="true" src={item.icon} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="elvira-cms-header__controls">
        <Link className="elvira-cms-header__website" href="/student-cases">
          {text.website}
          <span aria-hidden="true">↗</span>
        </Link>
        <details
          className="elvira-cms-account"
          key={pathname}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary")?.focus();
            }
          }}
        >
          <summary className="elvira-cms-account__trigger">
            <span aria-hidden="true" className="elvira-cms-account__avatar">
              {initials}
            </span>
            <span className="elvira-cms-account__identity">
              <span className="elvira-cms-account__name">{name}</span>
              <span className="elvira-cms-account__role">
                {text.administrator}
              </span>
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              aria-hidden="true"
              className="elvira-cms-account__chevron"
              src="/admin/icons/25c5c.svg"
            />
          </summary>
          <div className="elvira-cms-account__menu">
            <Link href={accountHref}>{text.account}</Link>
            <Link href="/student-cases">{text.website}</Link>
            <Link href={logoutHref}>{text.logout}</Link>
          </div>
        </details>
      </div>
    </div>
  );
}
