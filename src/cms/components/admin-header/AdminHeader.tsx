"use client";

import { Link, useAuth, useConfig, useTranslation } from "@payloadcms/ui";
import { usePathname } from "next/navigation";
import { navigationLabels, studioLabels } from "./navigation-labels";
import { AdminLanguageSelect } from "./AdminLanguageSelect";
import { getStudioLocale } from "@/features/admin-studio/shared/i18n/studio-translations";
import { useCompactLayout } from "@/features/admin-studio/shared/ui/useCompactLayout";

export function EmptyNav() {
  return null;
}

/** Uses Payload's supported header slot; its forms and locale controls stay native. */
export function AdminHeader() {
  const { user } = useAuth();
  const { config } = useConfig();
  const { i18n } = useTranslation();
  const pathname = usePathname();
  const compact = useCompactLayout();
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
  const studio =
    studioLabels[language as keyof typeof studioLabels] ?? studioLabels.ru;
  const items: {
    href: string;
    label: string;
    shortLabel?: string;
    icon: string;
  }[] = [
    {
      href: compact
        ? `${admin}/studio/appointments`
        : `${admin}/collections/training-applications`,
      label: studio.appointments,
      shortLabel: studio.appointmentsShort,
      icon: "/admin/icons/calendar.svg",
    },
    {
      href: `${admin}/collections/student-cases`,
      label: text.cases,
      shortLabel: studio.casesShort,
      icon: "/admin/icons/student-cases.svg",
    },
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
        href={compact ? `${admin}/studio/dashboard` : admin}
      >
        <span className="elvira-studio-brand">
          <span className="elvira-studio-brand__name">Elvira</span>
          <picture className="elvira-studio-brand__sparkle">
            <source
              media="(max-width: 639px)"
              srcSet="/admin/icons/brand-sparkle-small.svg"
            />
            <source
              media="(max-width: 1249px)"
              srcSet="/admin/icons/brand-sparkle-medium.svg"
            />
            <img src="/admin/icons/brand-sparkle.svg" alt="" />
          </picture>
          <span className="elvira-studio-brand__descriptor">
            Nail studio &amp; academy
          </span>
        </span>
      </Link>

      <nav aria-label={text.navigation} className="elvira-cms-header__nav">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.href === `${admin}/studio/appointments` &&
              pathname.startsWith(
                `${admin}/collections/training-applications`,
              ));
          const mobileIcon = item.icon
            .replace("/admin/icons/", "/admin/icons/mobile-")
            .replace("-active.svg", ".svg")
            .replace(".svg", active ? "-active.svg" : ".svg");
          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={compact}
              className="elvira-cms-header__link"
              aria-current={active ? "page" : undefined}
            >
              <picture>
                <source media="(max-width: 639px)" srcSet={mobileIcon} />
                <img src={item.icon} alt="" />
              </picture>
              <span className="elvira-cms-header__full-label">
                {item.label}
              </span>
              <span className="elvira-cms-header__short-label">
                {item.shortLabel ?? item.label}
              </span>
            </Link>
          );
        })}
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
          <summary
            className="elvira-cms-account__trigger"
            aria-label={`${text.account}: ${name}`}
          >
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
