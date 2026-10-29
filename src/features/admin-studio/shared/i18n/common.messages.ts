import type { StudioMessages } from "./studio-translations";

export const commonMessages = {
  save: { ru: "Сохранить", uk: "Зберегти", en: "Save", nl: "Opslaan" },
  cancel: { ru: "Отмена", uk: "Скасувати", en: "Cancel", nl: "Annuleren" },
  close: { ru: "Закрыть", uk: "Закрити", en: "Close", nl: "Sluiten" },
  delete: { ru: "Удалить", uk: "Видалити", en: "Delete", nl: "Verwijderen" },
  draftSaved: {
    ru: "Черновик сохранён в этом браузере. На сайте изменений нет.",
    uk: "Чернетку збережено в цьому браузері. На сайті змін немає.",
    en: "Draft saved in this browser. The website has not changed.",
    nl: "Concept opgeslagen in deze browser. De website is niet gewijzigd.",
  },
  draftFailed: {
    ru: "Не удалось сохранить черновик. Проверьте доступ к хранилищу браузера или уменьшите изображения.",
    uk: "Не вдалося зберегти чернетку. Перевірте доступ до сховища браузера або зменште зображення.",
    en: "Could not save the draft. Check browser storage access or reduce image sizes.",
    nl: "Het concept kon niet worden opgeslagen. Controleer de browseropslag of verklein de afbeeldingen.",
  },
} satisfies StudioMessages;
