import { siteWhyElviraConfig as whyElvira } from "@/config/site";

export default function WhyElvira() {
  return (
    <section className="px-6 py-24 text-[#060404] bg-[#F7F0E8] tablet:px-12 tablet:py-32 desktop:px-16">
      <div className="max-w-[768px] reveal">
        <p className="mb-6 text-[12px] uppercase tracking-[0.35em] text-[#815e37]">
          {whyElvira.subtitle}
        </p>
        <h2 className="font-serif text-[36px] leading-[1.1] tablet:text-[48px] tablet:leading-none desktop:text-[60px]">
          {whyElvira.title} <br />
          <span className="italic">{whyElvira.titleAccent}</span>
        </h2>
      </div>

      <ul className="mt-16 tablet:mt-20 divide-y divide-[#815e37]/10">
        {whyElvira.advantages.title.map((title, index) => (
          <li
            key={title}
            className="grid grid-cols-12 gap-6 py-8 items-start tablet:py-10 reveal"
          >
            <span className="col-span-2 font-serif text-[24px] leading-loose text-[#815e37] tablet:col-span-1 tablet:text[30px] tablet:leading-[2.25rem]">
              {String(index + 1).padStart(2, "0")}
            </span>

            <h3 className="col-span-10 font-serif text-[24px] leading-loose tablet:col-span-5 tablet:text[30px] tablet:leading-[2.25rem]">
              {title}
            </h3>
            <p className="col-span-12 text-[16px] leading-relaxed text-[#3c3733] tablet:col-span-6 ">
              {whyElvira.advantages.description[index]}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
