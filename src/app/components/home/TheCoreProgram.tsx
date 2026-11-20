import Link from "next/link";
import Image from "next/image";

import { siteTheCoreProgramConfig as coreProgram } from "@/config/site";

export default function TheCoreProgram() {
  return (
    <section className="px-6 py-24 text-[#fdf9fa] bg-[#040303] tablet:px-12 tablet:py-32 desktop:px-16">
      <div className="grid grid-cols-1 gap-12 items-center desktop:grid-cols-2 desktop:gap-20">
        <div className="order-2 desktop:order-1 reveal">
          <div className="relative overflow-hidden aspect-[4/5] w-full rounded-sm">
            <Image
              src={coreProgram.image.src}
              alt={coreProgram.image.alt}
              fill
              sizes="(min-width: 1250px) 50vw, 100vw"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        <div className="order-1 desktop:order-2 reveal">
          <p className="mb-6 text-[12px] uppercase tracking-[0.35em] text-[#d2b590]">
            {coreProgram.subtitle}
          </p>
          <h2 className="font-serif text-[36px] leading-[1.1] tablet:text-[48px] tablet:leading-none desktop:text-[60px]">
            {coreProgram.title}
          </h2>
          <p className="mt-6 max-w-[512px] text-[16px] leading-relaxed">
            {coreProgram.description}
          </p>

          <ul className="mt-10 flex flex-col gap-4">
            {coreProgram.checklist.items.map((item) => (
              <li key={item} className="flex gap-4 items-center">
                <svg
                  width="20"
                  height="20"
                  aria-hidden="true"
                  className="stroke-[#a1794b]"
                >
                  <use href={coreProgram.checklist.icon} />
                </svg>
                <p className="text-[14px] leading-tight tablet:text-[16px] tablet:leading-normal ">
                  {item}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href={coreProgram.primaryCta.href}
            className={[
              "inline-flex items-center gap-3",
              "mt-12 px-9 py-4",
              "text-[12px] uppercase tracking-[0.25em]",
              "rounded-[6px]",
              "bg-[#a1794b]",
              "transition-bg duration-200 ease-in-out",
              "hover:bg-[#bb986c]",
            ].join(" ")}
          >
            {coreProgram.primaryCta.label}

            <svg
              width="12"
              height="12"
              aria-hidden="true"
              className="fill-current"
            >
              <use href={coreProgram.primaryCta.icon} />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
