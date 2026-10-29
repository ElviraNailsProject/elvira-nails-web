import assert from "node:assert/strict";
import test from "node:test";
import { courseMessages } from "../src/features/admin-studio/courses/courses.messages";
import { galleryMessages } from "../src/features/admin-studio/gallery/gallery.messages";
import { promotionMessages } from "../src/features/admin-studio/promotions/promotions.messages";
import { serviceMessages } from "../src/features/admin-studio/services/services.messages";
import { settingsMessages } from "../src/features/admin-studio/settings/settings.messages";
import { shellMessages } from "../src/features/admin-studio/shell/shell.messages";
import { commonMessages } from "../src/features/admin-studio/shared/i18n/common.messages";
import {
  getStudioLocale,
  studioLocales,
  translateStudioMessage,
  type StudioMessages,
} from "../src/features/admin-studio/shared/i18n/studio-translations";

const dictionaries: Record<string, StudioMessages> = {
  courses: courseMessages,
  gallery: galleryMessages,
  promotions: promotionMessages,
  services: serviceMessages,
  settings: settingsMessages,
  shell: shellMessages,
  common: commonMessages,
};
const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();

test("every editor message has all four languages and matching interpolation fields", () => {
  for (const [section, messages] of Object.entries(dictionaries)) {
    for (const [key, translations] of Object.entries(messages)) {
      for (const locale of studioLocales) {
        assert.ok(
          translations[locale]?.trim(),
          `${section}.${key}: missing ${locale}`,
        );
        assert.deepEqual(
          placeholders(translations[locale]),
          placeholders(translations.ru),
          `${section}.${key}: incompatible ${locale} parameters`,
        );
      }
    }
  }
});

test("interface languages support region codes and a defined fallback", () => {
  assert.equal(getStudioLocale("en-US"), "en");
  assert.equal(getStudioLocale("uk-UA"), "uk");
  assert.equal(getStudioLocale("nl_NL"), "nl");
  assert.equal(getStudioLocale("de"), "ru");
});

test("messages translate without rewriting the administrator's content", () => {
  assert.equal(
    translateStudioMessage("en", galleryMessages, "moved", {
      name: "Моя работа",
      position: 0,
    }),
    "Photo Моя работа moved to position 0. Save your changes.",
  );
  assert.equal(
    translateStudioMessage("uk", commonMessages, "save"),
    "Зберегти",
  );
  assert.equal(translateStudioMessage("nl", commonMessages, "save"), "Opslaan");
});
