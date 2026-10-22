import type {
  StudentCaseLocale,
  StudentCaseStatus,
} from "@/features/student-cases/contracts";

export type PublicSearchParams = Record<string, string | string[] | undefined>;

export const languages: { locale: StudentCaseLocale; label: string }[] = [
  { locale: "NL", label: "Nederlands" },
  { locale: "EN", label: "English" },
  { locale: "RU", label: "Русский" },
  { locale: "UK", label: "Українська" },
];

export function publicLocale(
  value: string | string[] | undefined,
): StudentCaseLocale {
  const normalized = typeof value === "string" ? value.toUpperCase() : "EN";
  return (
    languages.find((language) => language.locale === normalized)?.locale ?? "EN"
  );
}

export function publicPage(value: string | string[] | undefined): number {
  if (typeof value !== "string" || !/^[1-9]\d{0,5}$/.test(value)) return 1;
  const page = Number(value);
  return page <= 100_000 ? page : 1;
}

export function casesHref(
  locale: StudentCaseLocale,
  page = 1,
  id?: string,
): string {
  const route = id
    ? `/student-cases/${encodeURIComponent(id)}`
    : "/student-cases";
  const query = new URLSearchParams({ locale: locale.toLowerCase() });
  if (!id && page > 1) query.set("page", String(page));
  return `${route}?${query}`;
}

type PublicCopy = {
  eyebrow: string;
  title: string;
  introduction: string;
  readStory: string;
  back: string;
  languages: string;
  gallery: string;
  caseLabel: string;
  galleryLabel: string;
  moreImages: string;
  openImage: string;
  closeImage: string;
  imageCount: (current: number, total: number) => string;
  contacts: string;
  explore: string;
  studio: string;
  studioDescription: string;
  footerContact: string;
  testimonial: string;
  emptyTitle: string;
  emptyText: string;
  unavailableTitle: string;
  unavailableText: string;
  missingTitle: string;
  missingText: string;
  retry: string;
  previous: string;
  next: string;
  pagination: string;
  page: (current: number, total: number) => string;
  fallback: (language: string) => string;
  languageNames: Record<StudentCaseLocale, string>;
  status: Record<StudentCaseStatus, string>;
};

export const publicCopy: Record<StudentCaseLocale, PublicCopy> = {
  EN: {
    eyebrow: "Elvira · Professional training",
    title: "Our students, their stories",
    introduction:
      "Discover the work and experiences of students from our nail training.",
    readStory: "Read the story",
    back: "All student stories",
    languages: "Story language",
    gallery: "Her works",
    caseLabel: "Student case",
    galleryLabel: "Gallery",
    moreImages: "More images",
    openImage: "View image",
    closeImage: "Close image",
    imageCount: (current, total) => `Image ${current} of ${total}`,
    contacts: "Student contacts",
    explore: "Explore",
    studio: "Studio",
    studioDescription:
      "Professional nail education and private studio work based in Leiderdorp, Netherlands.",
    footerContact: "Contact the studio",
    testimonial: "In their own words",
    emptyTitle: "New stories are on their way",
    emptyText:
      "Our students’ work will appear here as their stories are published.",
    unavailableTitle: "The stories are temporarily unavailable",
    unavailableText: "Please try again in a moment.",
    missingTitle: "This story is not available",
    missingText: "Explore the published stories from our students.",
    retry: "Try again",
    previous: "Previous",
    next: "Next",
    pagination: "Student stories pages",
    page: (current, total) => `Page ${current} of ${total}`,
    fallback: (language) => `This story is currently available in ${language}.`,
    languageNames: {
      NL: "Dutch",
      EN: "English",
      RU: "Russian",
      UK: "Ukrainian",
    },
    status: {
      WAITING: "Waiting",
      STUDYING: "In training",
      COMPLETED: "Training completed",
    },
  },
  NL: {
    eyebrow: "Elvira · Professionele opleidingen",
    title: "Onze cursisten, hun verhalen",
    introduction:
      "Ontdek het werk en de ervaringen van cursisten van onze nagelopleidingen.",
    readStory: "Lees het verhaal",
    back: "Alle cursistenverhalen",
    languages: "Taal van het verhaal",
    gallery: "Haar werk",
    caseLabel: "Cursistenverhaal",
    galleryLabel: "Galerij",
    moreImages: "Meer foto’s",
    openImage: "Foto bekijken",
    closeImage: "Foto sluiten",
    imageCount: (current, total) => `Foto ${current} van ${total}`,
    contacts: "Contactgegevens van de cursist",
    explore: "Ontdek",
    studio: "Studio",
    studioDescription:
      "Professionele nagelopleidingen en een privéstudio in Leiderdorp, Nederland.",
    footerContact: "Neem contact op",
    testimonial: "In eigen woorden",
    emptyTitle: "Nieuwe verhalen volgen binnenkort",
    emptyText:
      "Het werk van onze cursisten verschijnt hier zodra hun verhalen zijn gepubliceerd.",
    unavailableTitle: "De verhalen zijn tijdelijk niet beschikbaar",
    unavailableText: "Probeer het over een ogenblik opnieuw.",
    missingTitle: "Dit verhaal is niet beschikbaar",
    missingText: "Ontdek de gepubliceerde verhalen van onze cursisten.",
    retry: "Opnieuw proberen",
    previous: "Vorige",
    next: "Volgende",
    pagination: "Pagina’s met cursistenverhalen",
    page: (current, total) => `Pagina ${current} van ${total}`,
    fallback: (language) =>
      `Dit verhaal is momenteel beschikbaar in het ${language}.`,
    languageNames: {
      NL: "Nederlands",
      EN: "Engels",
      RU: "Russisch",
      UK: "Oekraïens",
    },
    status: {
      WAITING: "In afwachting",
      STUDYING: "In opleiding",
      COMPLETED: "Opleiding afgerond",
    },
  },
  RU: {
    eyebrow: "Elvira · Профессиональное обучение",
    title: "Наши ученики, их истории",
    introduction: "Работы и опыт учеников наших курсов маникюра.",
    readStory: "Читать историю",
    back: "Все истории учеников",
    languages: "Язык истории",
    gallery: "Её работы",
    caseLabel: "Кейс ученицы",
    galleryLabel: "Галерея",
    moreImages: "Больше фотографий",
    openImage: "Открыть фотографию",
    closeImage: "Закрыть фотографию",
    imageCount: (current, total) => `Фото ${current} из ${total}`,
    contacts: "Контакты ученицы",
    explore: "Навигация",
    studio: "Студия",
    studioDescription:
      "Профессиональное обучение маникюру и частная студия в Лейдердорпе, Нидерланды.",
    footerContact: "Связаться со студией",
    testimonial: "От первого лица",
    emptyTitle: "Скоро здесь появятся новые истории",
    emptyText:
      "Работы наших учеников появятся здесь после публикации их историй.",
    unavailableTitle: "Истории временно недоступны",
    unavailableText: "Пожалуйста, попробуйте ещё раз через некоторое время.",
    missingTitle: "Эта история недоступна",
    missingText: "Посмотрите опубликованные истории наших учеников.",
    retry: "Попробовать снова",
    previous: "Назад",
    next: "Вперёд",
    pagination: "Страницы историй учеников",
    page: (current, total) => `Страница ${current} из ${total}`,
    fallback: (language) => `Эта история пока доступна на ${language} языке.`,
    languageNames: {
      NL: "нидерландском",
      EN: "английском",
      RU: "русском",
      UK: "украинском",
    },
    status: {
      WAITING: "В ожидании",
      STUDYING: "Учится",
      COMPLETED: "Закончила",
    },
  },
  UK: {
    eyebrow: "Elvira · Професійне навчання",
    title: "Наші учні, їхні історії",
    introduction: "Роботи й досвід учнів наших курсів манікюру.",
    readStory: "Читати історію",
    back: "Усі історії учнів",
    languages: "Мова історії",
    gallery: "Її роботи",
    caseLabel: "Кейс учениці",
    galleryLabel: "Галерея",
    moreImages: "Більше фотографій",
    openImage: "Відкрити фотографію",
    closeImage: "Закрити фотографію",
    imageCount: (current, total) => `Фото ${current} з ${total}`,
    contacts: "Контакти учениці",
    explore: "Навігація",
    studio: "Студія",
    studioDescription:
      "Професійне навчання манікюру та приватна студія в Лейдердорпі, Нідерланди.",
    footerContact: "Зв’язатися зі студією",
    testimonial: "Від першої особи",
    emptyTitle: "Незабаром тут з’являться нові історії",
    emptyText:
      "Роботи наших учнів з’являться тут після публікації їхніх історій.",
    unavailableTitle: "Історії тимчасово недоступні",
    unavailableText: "Будь ласка, спробуйте ще раз за деякий час.",
    missingTitle: "Ця історія недоступна",
    missingText: "Перегляньте опубліковані історії наших учнів.",
    retry: "Спробувати знову",
    previous: "Назад",
    next: "Далі",
    pagination: "Сторінки історій учнів",
    page: (current, total) => `Сторінка ${current} з ${total}`,
    fallback: (language) => `Ця історія поки доступна ${language} мовою.`,
    languageNames: {
      NL: "нідерландською",
      EN: "англійською",
      RU: "російською",
      UK: "українською",
    },
    status: {
      WAITING: "В очікуванні",
      STUDYING: "Навчається",
      COMPLETED: "Закінчила",
    },
  },
};
