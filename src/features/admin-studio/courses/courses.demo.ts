import type { Course, CourseModule } from "./courses.types";

export const includedOptions = [
  "Теория",
  "Практика на моделях",
  "Работа с инструментами",
  "Материалы на время курса",
  "Сертификация",
];
const makeModule = (
  id: string,
  title: string,
  hours: number,
  topics: string[],
): CourseModule => ({
  id,
  title,
  hours,
  topics: topics.map((topic, index) => ({
    id: `${id}-${index}`,
    title: topic,
  })),
});
const baseModules = [
  makeModule("theory", "Теория", 6, [
    "Строение ногтя и кожи",
    "Санитария и стерилизация",
    "Материалы и их свойства",
  ]),
  makeModule("tools", "Работа с инструментами", 8, [
    "Аппаратный маникюр: фрезы и скорости",
    "Комбинированный маникюр",
    "Постановка руки",
  ]),
  makeModule("practice", "Практика на моделях", 12, [
    "Покрытие гель-лаком под кутикулу",
    "Выравнивание базой",
    "Работа на 3 моделях",
  ]),
  makeModule("certificate", "Сертификация", 4, [
    "Итоговая работа",
    "Разбор ошибок",
    "Выдача сертификата",
  ]),
];
export const demoCourses: Course[] = [
  {
    id: "basic",
    title: "Базовый курс",
    price: 550,
    days: 5,
    format: "Офлайн, группа до 4 человек",
    included: includedOptions,
    open: true,
    modules: baseModules,
  },
  {
    id: "advanced",
    title: "Повышение квалификации",
    price: 420,
    days: 3,
    format: "Офлайн, группа до 4 человек",
    included: includedOptions,
    open: true,
    modules: [
      makeModule("advanced-technique", "Совершенствование техники", 6, [
        "Разбор техники маникюра",
      ]),
      makeModule("advanced-practice", "Практика на моделях", 8, [
        "Работа на моделях",
      ]),
      makeModule("advanced-certificate", "Сертификация", 4, [
        "Итоговая работа",
      ]),
    ],
  },
  {
    id: "extensions",
    title: "Наращивание с нуля",
    price: 500,
    days: 4,
    format: "Офлайн, группа до 4 человек",
    included: includedOptions,
    open: true,
    modules: [
      makeModule("extensions-theory", "Основы моделирования", 6, [
        "Материалы и формы",
      ]),
      makeModule("extensions-practice", "Практика на моделях", 14, [
        "Постановка форм",
        "Моделирование ногтей",
      ]),
      makeModule("extensions-certificate", "Сертификация", 4, [
        "Итоговая работа",
      ]),
    ],
  },
];
