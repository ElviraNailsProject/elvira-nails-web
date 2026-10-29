import type { StudioMessages } from "../shared/i18n/studio-translations";

export const shellMessages = {
  loading: {
    ru: "Загрузка редактора…",
    uk: "Завантаження редактора…",
    en: "Loading editor…",
    nl: "Editor laden…",
  },
  preview: {
    ru: "Предпросмотр нового редактора · Данные из макета. Сохранение создаёт черновик только в этом браузере; публикация на сайте ещё не подключена.",
    uk: "Попередній перегляд нового редактора · Дані з макета. Збереження створює чернетку лише в цьому браузері; публікацію на сайті ще не підключено.",
    en: "New editor preview · Sample content. Saving creates a draft in this browser only; website publishing is not connected yet.",
    nl: "Voorbeeld van de nieuwe editor · Voorbeeldinhoud. Opslaan maakt alleen een concept in deze browser; publiceren op de website is nog niet aangesloten.",
  },
  desktopTitle: {
    ru: "Редактор для компьютера",
    uk: "Редактор для комп’ютера",
    en: "Desktop editor",
    nl: "Editor voor desktop",
  },
  desktopHint: {
    ru: "Новый дизайн пока доступен на экранах от 1250 px. Остальные разделы CMS работают в прежнем виде.",
    uk: "Новий дизайн поки доступний на екранах від 1250 px. Решта розділів CMS працюють у попередньому вигляді.",
    en: "The new design currently requires a screen at least 1250 px wide. The other CMS sections remain available.",
    nl: "Het nieuwe ontwerp vereist momenteel een scherm van minstens 1250 px breed. De andere CMS-onderdelen blijven beschikbaar.",
  },
  openCases: {
    ru: "Открыть кейсы учениц",
    uk: "Відкрити кейси учениць",
    en: "Open student cases",
    nl: "Studentencases openen",
  },
  content: { ru: "Контент", uk: "Контент", en: "Content", nl: "Inhoud" },
  contentTitle: {
    ru: "Контент сайта",
    uk: "Контент сайту",
    en: "Website content",
    nl: "Website-inhoud",
  },
  contentHint: {
    ru: "Редактируйте программу обучения, услуги с ценами и галерею работ.",
    uk: "Редагуйте програму навчання, послуги з цінами та галерею робіт.",
    en: "Edit training courses, services and prices, and the work gallery.",
    nl: "Bewerk opleidingen, diensten en prijzen, en de werkgalerij.",
  },
  courses: {
    ru: "Программа обучения",
    uk: "Програма навчання",
    en: "Training courses",
    nl: "Opleidingen",
  },
  services: { ru: "Услуги", uk: "Послуги", en: "Services", nl: "Diensten" },
  gallery: { ru: "Галерея", uk: "Галерея", en: "Gallery", nl: "Galerij" },
  addCourse: {
    ru: "Добавить курс",
    uk: "Додати курс",
    en: "Add course",
    nl: "Cursus toevoegen",
  },
  addService: {
    ru: "Добавить услугу",
    uk: "Додати послугу",
    en: "Add service",
    nl: "Dienst toevoegen",
  },
  uploadPhoto: {
    ru: "Загрузить фото",
    uk: "Завантажити фото",
    en: "Upload photo",
    nl: "Foto uploaden",
  },
  contentSections: {
    ru: "Разделы контента",
    uk: "Розділи контенту",
    en: "Content sections",
    nl: "Inhoudsonderdelen",
  },
} satisfies StudioMessages;
