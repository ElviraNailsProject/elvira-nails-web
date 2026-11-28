import Link from "next/link";

import { siteEducationConfig as education } from "@/config/site";

export default function Education() {
  return (
    <section className="px-6 py-24 bg-[#F7F0E8] tablet:px-12 tablet:py-32 desktop:px-16">
      <div className="grid grid-cols-1 gap-12 items-center desktop:grid-cols-12 desktop:gap-20 ">
        <div className="desktop:col-span-5 reveal">
          <p className="mb-6 text-[12px] uppercase tracking-[0.35em] text-[#815E37]">
            {education.subtitle}
          </p>
          <h2 className="font-serif text-[36px] leading-[1.1] text-[#060404] tablet:text-[48px] tablet:leading-none desktop:text-[60px]">
            {education.title} <br />
            <span className="italic">{education.titleAccent}</span>
          </h2>
        </div>

        <div className="desktop:col-span-6 desktop:col-start-7 reveal">
          <p className="text-[18px] leading-relaxed text-[#28231f]">
            {education.firstParagraph}
          </p>
          <p className="mt-6 text-[16px] leading-relaxed text-[#3c3733] ">
            {education.secondParagraph}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link
              href={education.primaryCta.href}
              className={[
                "pb-1",
                "text-[14px] uppercase tracking-[0.25em] leading-tight text-[#060404]",
                "border-b border-[#060404]",
                "transition-colors duration-200 ease-in-out",
                "hover:border-[#815e37] hover:text-[#815e37]",
              ].join(" ")}
            >
              {education.primaryCta.label}
            </Link>

            <Link
              href={education.secondaryCta.href}
              className={[
                "text-[14px] leading-tight text-[#57514d]",
                "transition-colors duration-200 ease-in-out",
                "hover:text-[#0d0a0b]",
              ].join(" ")}
            >
              {education.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
