"use client";

import { useTranslation } from "@payloadcms/ui";
import { useCallback } from "react";
import { commonMessages } from "./common.messages";
import {
  getStudioLocale,
  translateStudioMessage,
  type StudioMessages,
  type StudioParams,
} from "./studio-translations";

const emptyMessages = {};

export function useStudioTranslation<
  T extends StudioMessages = Record<never, never>,
>(messages: T = emptyMessages as T) {
  const { i18n } = useTranslation();
  const locale = getStudioLocale(i18n.language);
  const t = useCallback(
    (
      key: (keyof T | keyof typeof commonMessages) & string,
      params?: StudioParams,
    ) =>
      translateStudioMessage(
        locale,
        { ...commonMessages, ...messages },
        key,
        params,
      ),
    [locale, messages],
  );
  return { t, locale };
}
