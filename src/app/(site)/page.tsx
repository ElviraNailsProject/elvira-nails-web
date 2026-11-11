import Hero from "../components/home/Hero";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Заглушка следующей секции — сюда ведёт "Explore the Course" */}
      <section
        id="after-hero"
        className="flex min-h-[70svh] scroll-mt-24 items-center justify-center bg-[#F7F0E8] px-6 py-24 text-center"
      >
        <div>
          <h2 className="font-serif text-3xl text-[#4A3A32] tablet:text-4xl">
            Next section coming soon
          </h2>
          <p className="mt-4 font-sans text-sm text-[#4A3A32]/70">
            Здесь будет блок «О курсе» или «Услуги».
          </p>
        </div>
      </section>
    </>
  );
}
