"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { siteHeaderConfig } from "@/config/site";

const SCROLL_THRESHOLD = 8;

function getBrandDescriptor(pathname: string): string {
  if (pathname.startsWith("/services")) {
    return siteHeaderConfig.brand.descriptors.services;
  }
  if (pathname.startsWith("/training")) {
    return siteHeaderConfig.brand.descriptors.training;
  }
  return siteHeaderConfig.brand.descriptors.home;
}

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Закрываем меню при смене маршрута (adjust state during render)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const descriptor = getBrandDescriptor(pathname);
  const hasSolidBackground = isScrolled || isMenuOpen;

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "border-b transition-[background-color,backdrop-filter,border-color] duration-300 ease-out",
        hasSolidBackground
          ? "border-[#4A3A32]/8 bg-[#F7F0E8]/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      {/* Верхняя строка — логотип по центру (desktop + tablet) */}
      <div className="hidden w-full justify-center px-8 pt-6 tablet:flex mb-1">
        <Link
          href={siteHeaderConfig.brand.logo.href}
          aria-label={siteHeaderConfig.brand.logo.alt}
          className="inline-flex items-center text-[#4A3A32]"
        >
          <Image
            src={siteHeaderConfig.brand.logo.src}
            alt={siteHeaderConfig.brand.logo.alt}
            width={siteHeaderConfig.brand.logo.width}
            height={siteHeaderConfig.brand.logo.height}
            priority
            className="h-14 w-auto"
          />
        </Link>
      </div>

      {/* Нижняя строка — управление (desktop + tablet) */}
      <div className="hidden w-full items-center px-8 pb-4 tablet:flex">
        {/* Descriptor — на месте бывшего brand.name */}
        <div className="flex min-w-0 flex-1 items-center">
          <span className="truncate font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#A99B92]">
            {descriptor}
          </span>
        </div>

        {/* Desktop-навигация */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center justify-center desktop:flex"
        >
          <ul className="flex items-center gap-8">
            {siteHeaderConfig.navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "font-sans text-[12px] font-medium uppercase",
                      "tracking-[0.12em] transition-colors duration-200",
                      "text-[#4A3A32] hover:text-[#C9A5A0]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA + burger (правый блок) */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <Link
            href={siteHeaderConfig.primaryCta.href}
            className={[
              "hidden desktop:inline-flex items-center justify-center rounded-md",
              "bg-[#574840] text-[#FCF8F3]",
              "px-5 py-3",
              "font-sans text-[12px] font-semibold uppercase tracking-widest",
              "transition-colors duration-200 hover:bg-[#3F332D]",
            ].join(" ")}
          >
            {siteHeaderConfig.primaryCta.label}
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="desktop:hidden -mr-2 inline-flex h-10 w-10 items-center justify-center text-[#4A3A32]"
          >
            <span className="relative block h-4 w-6">
              <span
                className={[
                  "absolute left-0 block h-px w-6 bg-current",
                  "transition-all duration-300 ease-out",
                  isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-1/2 block h-px w-6 -translate-y-1/2 bg-current",
                  "transition-opacity duration-200 ease-out",
                  isMenuOpen ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 block h-px w-6 bg-current",
                  "transition-all duration-300 ease-out",
                  isMenuOpen
                    ? "top-1/2 -translate-y-1/2 -rotate-45"
                    : "bottom-0",
                ].join(" ")}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Мобильный хедер — одна строка: логотип + бургер */}
      <div className="flex w-full items-center justify-between px-6 py-4 tablet:hidden">
        <Link
          href={siteHeaderConfig.brand.logo.href}
          aria-label={siteHeaderConfig.brand.logo.alt}
          className="inline-flex items-center text-[#4A3A32]"
        >
          <Image
            src={siteHeaderConfig.brand.logo.src}
            alt={siteHeaderConfig.brand.logo.alt}
            width={siteHeaderConfig.brand.logo.width}
            height={siteHeaderConfig.brand.logo.height}
            priority
            className="h-16 w-auto"
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex h-10 w-10 items-center justify-center text-[#4A3A32]"
        >
          <span className="relative block h-4 w-6">
            <span
              className={[
                "absolute left-0 block h-px w-6 bg-current",
                "transition-all duration-300 ease-out",
                isMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 top-1/2 block h-px w-6 -translate-y-1/2 bg-current",
                "transition-opacity duration-200 ease-out",
                isMenuOpen ? "opacity-0" : "opacity-100",
              ].join(" ")}
            />
            <span
              className={[
                "absolute left-0 block h-px w-6 bg-current",
                "transition-all duration-300 ease-out",
                isMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0",
              ].join(" ")}
            />
          </span>
        </button>
      </div>

      {/* Выпадающее меню — без изменений */}
      <div
        id="mobile-nav"
        className={[
          "desktop:hidden overflow-hidden",
          "transition-[max-height,opacity] duration-300 ease-out",
          isMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#4A3A32]/8 bg-[#F7F0E8]/95 px-8 pb-8 pt-4 backdrop-blur-md"
        >
          <ul className="flex flex-col">
            {siteHeaderConfig.navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href} className="border-b border-[#4A3A32]/8">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "block py-4",
                      "font-sans text-[13px] font-medium uppercase tracking-[0.14em]",
                      "transition-colors duration-200",
                      isActive ? "text-[#C9A5A0]" : "text-[#4A3A32]",
                      "hover:text-[#C9A5A0]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href={siteHeaderConfig.primaryCta.href}
            className={[
              "mt-6 inline-flex w-full items-center justify-center rounded-md",
              "bg-[#574840] text-[#FCF8F3]",
              "px-5 py-3",
              "font-sans text-[12px] font-semibold uppercase tracking-widest",
              "transition-colors duration-200 hover:bg-[#3F332D]",
            ].join(" ")}
          >
            {siteHeaderConfig.primaryCta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
