import Link from "next/link";

import { siteHeroConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-svh w-full flex-col justify-end overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <picture>
          <source
            media="(min-width: 1250px)"
            srcSet={siteHeroConfig.background.desktop}
          />
          <source
            media="(min-width: 768px)"
            srcSet={siteHeroConfig.background.tablet}
          />
          { }
          <img
            src={siteHeroConfig.background.mobile}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        </picture>

        <div className="absolute inset-0 bg-linear-to-tr from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content — bottom-left */}
      <div className="relative z-10 flex w-full flex-col items-start px-6 pb-16 tablet:px-10 tablet:pb-20 desktop:px-16 desktop:pb-25">
        <h1 className="max-w-3xl font-serif text-[40px] leading-[1.08] tracking-[-0.01em] text-[#FCF8F3] tablet:text-[52px] desktop:text-[64px]">
          {siteHeroConfig.title}
        </h1>

        <p className="mt-8 max-w-xl font-sans text-[15px] leading-relaxed text-[#FCF8F3] tablet:text-base">
          {siteHeroConfig.subtitle}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 tablet:gap-6 desktop:gap-8">
          <Link
            href={siteHeroConfig.primaryCta.href}
            className={[
              "inline-flex items-center justify-center rounded-md",
              "bg-[#574840] text-[#FCF8F3]",
              "px-6 py-3.5",
              "font-sans text-[12px] font-semibold uppercase tracking-widest",
              "transition-colors duration-200",
              "hover:bg-[#3F332D]",
            ].join(" ")}
          >
            {siteHeroConfig.primaryCta.label}
          </Link>

          <a
            href={siteHeroConfig.secondaryCta.href}
            className={[
              "inline-flex items-center justify-center rounded-md",
              "border border-[#FCF8F3]/80 text-[#FCF8F3]",
              "bg-transparent",
              "px-6 py-3.5",
              "font-sans text-[12px] font-semibold uppercase tracking-widest",
              "transition-colors duration-200",
              "hover:bg-[#FCF8F3]/10",
            ].join(" ")}
          >
            {siteHeroConfig.secondaryCta.label}
          </a>

          <Link
            href={siteHeroConfig.tertiaryCta.href}
            className={[
              "font-sans text-[13px] font-medium uppercase tracking-[0.14em]",
              "text-[#FCF8F3]/85",
              "underline decoration-[#FCF8F3]/40 decoration-1 underline-offset-8",
              "transition-colors duration-200",
              "hover:text-[#FCF8F3] hover:decoration-[#FCF8F3]",
            ].join(" ")}
          >
            {siteHeroConfig.tertiaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
