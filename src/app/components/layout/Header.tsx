"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteHeaderConfig } from "@/config/site";

const SCROLL_THRESHOLD = 8;

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50",
        "border-b border-transparent",
        "transition-[background-color,backdrop-filter,border-color] duration-300 ease-out",
        isScrolled
          ? "border-[#4A3A32]/8 bg-[#F7F0E8]/80 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="flex min-h-24 w-full items-center px-8">
        {/* Brand */}
        <div className="flex flex-1 items-center">
          <Link
            href="/"
            className="shrink-0 font-serif text-[30px] leading-none tracking-[0.02em] text-[#4A3A32]"
          >
            {siteHeaderConfig.brand.name}
          </Link>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-center"
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
                      "text-[#4A3A32]",
                      "hover:text-[#C9A5A0]",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* CTA */}
        <div className="flex flex-1 justify-end">
          <Link
            href={siteHeaderConfig.primaryCta.href}
            className={[
              "inline-flex items-center justify-center",
              "rounded-md",
              "bg-[#574840] text-[#FCF8F3]",
              "px-5 py-3",
              "font-sans text-[12px] font-semibold uppercase",
              "tracking-widest",
              "transition-colors duration-200",
              "hover:bg-[#3F332D]",
            ].join(" ")}
          >
            {siteHeaderConfig.primaryCta.label}
          </Link>
        </div>
      </div>
    </header>
  );
}
