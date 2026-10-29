"use client";

import { Link, useAuth, useConfig, useTranslation } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { navigationLabels, studioLabels } from "./navigation-labels";
import { BrandLogo } from "../Brand";
import { AdminLanguageSelect } from "./AdminLanguageSelect";
import { getStudioLocale } from "@/features/admin-studio/shared/i18n/studio-translations";

export function EmptyNav() {
  return null;
}

/** Uses Payload's supported header slot; its forms and locale controls stay native. */
export function AdminHeader() {
  const { user } = useAuth();
  const { config } = useConfig();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const language = getStudioLocale(i18n.language);
  const text =
    navigationLabels[language as keyof typeof navigationLabels] ??
    navigationLabels.ru;

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
      icon: "/admin/icons/training-calendar.svg",
    },
    {
      href: `${admin}/collections/student-cases`,
      label: text.cases,
      icon: "/admin/icons/student-cases-compact.svg",
    },
    {
      href: `${admin}/collections/media`,
      label: text.media,
      icon: "/admin/icons/media-library.svg",
    },
    {
      href: accountHref,
      label: text.settings,
      icon: "/admin/icons/account-settings.svg",
    },
  ];
  const studio =
    studioLabels[language as keyof typeof studioLabels] ?? studioLabels.ru;
  const desktopItems = [
    {
      ...items[0],
      label: studio.appointments,
      icon: "/admin/icons/calendar.svg",
    },
    { ...items[1], icon: "/admin/icons/student-cases.svg" },
    {
      href: `${admin}/studio/promotions`,
      label: studio.promotions,
      icon:
        pathname === `${admin}/studio/promotions`
          ? "/admin/icons/promotions-active.svg"
          : "/admin/icons/promotions.svg",
    },
    {
      href: `${admin}/studio/content`,
      label: studio.content,
      icon:
        pathname === `${admin}/studio/content`
          ? "/admin/icons/content-active.svg"
          : "/admin/icons/content.svg",
    },
    {
      href: `${admin}/studio/settings`,
      label: studio.settings,
      icon:
        pathname === `${admin}/studio/settings`
          ? "/admin/icons/settings-active.svg"
          : "/admin/icons/settings.svg",
    },
  ];

  return (
    <div className="elvira-cms-header">
      <Link
        aria-label="Elvira"
        className="elvira-cms-header__brand"
        href={admin}
      >
        <span className="elvira-cms-brand-legacy">
          <BrandLogo />
        </span>
        <span className="elvira-studio-brand">
          <span className="elvira-studio-brand__name">Elvira</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/admin/icons/brand-sparkle.svg" alt="" aria-hidden="true" />
          <span className="elvira-studio-brand__descriptor">
            Nail studio &amp; academy
          </span>
        </span>
      </Link>

      <nav
        aria-label={text.navigation}
        className="elvira-cms-header__nav elvira-cms-header__nav--legacy"
      >
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className="elvira-cms-header__link"
              href={item.href}
              scroll={false}
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

      <nav
        aria-label={text.navigation}
        className="elvira-cms-header__nav elvira-cms-header__nav--desktop"
      >
        {desktopItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            scroll={false}
            className="elvira-cms-header__link"
            aria-current={
              pathname === item.href || pathname.startsWith(`${item.href}/`)
                ? "page"
                : undefined
            }
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.icon} alt="" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="elvira-cms-header__controls">
        <details
          className="elvira-studio-notifications"
          key={`notifications-${pathname}`}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.currentTarget.open = false;
              event.currentTarget.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label={studio.notifications}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/admin/icons/notifications.svg"
              alt=""
              aria-hidden="true"
            />
          </summary>
          <div role="status">
            <strong>{studio.notifications}</strong>
            <p>{studio.noNotifications}</p>
          </div>
        </details>
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
              src="/admin/icons/chevron-down.svg"
            />
          </summary>
          <div className="elvira-cms-account__menu">
            <Link href={accountHref}>{text.account}</Link>
            <Link href={`${admin}/collections/media`}>{text.media}</Link>
            <Link href="/student-cases">{text.website}</Link>
            <Link href={logoutHref}>{text.logout}</Link>
            <AdminLanguageSelect />
          </div>
        </details>
      </div>
    </div>
  );
}
