"use client";
import {
  createContext,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useStudioTranslation } from "../i18n/useStudioTranslation";

export const DraftOwner = createContext("preview");
const DRAFT_CHANGED = "elvira-studio-draft-changed";
function subscribeToDrafts(callback: () => void) {
  window.addEventListener(DRAFT_CHANGED, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DRAFT_CHANGED, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useDraftCount(name: string, fallback: number) {
  const owner = useContext(DraftOwner);
  return useSyncExternalStore(
    subscribeToDrafts,
    () => {
      const draft = readDraft<unknown[] | null>(
        `elvira-studio:v1:${owner}:${name}`,
        [],
      );
      try {
        return localStorage.getItem(`elvira-studio:v1:${owner}:${name}`) &&
          Array.isArray(draft)
          ? draft.length
          : fallback;
      } catch {
        return fallback;
      }
    },
    () => fallback,
  );
}
export function notify(message: string) {
  window.dispatchEvent(
    new CustomEvent("elvira-studio-notice", { detail: message }),
  );
}

function readDraft<T>(key: string, initial: T): T {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return initial;
    const parsed: unknown = JSON.parse(serialized);
    if (
      parsed &&
      typeof parsed === "object" &&
      "version" in parsed &&
      parsed.version === 1 &&
      "data" in parsed &&
      parsed.data !== null &&
      typeof parsed.data === typeof initial &&
      Array.isArray(parsed.data) === Array.isArray(initial)
    )
      return parsed.data as T;
  } catch {
    /* An unavailable or obsolete browser draft must not block the editor. */
  }
  return initial;
}

/** Explicit browser-only drafts, isolated by owner. These never publish through Payload. */
export function useLocalDraft<T>(
  name: string,
  initial: T,
): [T, Dispatch<SetStateAction<T>>, (next?: T) => boolean, () => T] {
  const { t } = useStudioTranslation();
  const owner = useContext(DraftOwner);
  const key = `elvira-studio:v1:${owner}:${name}`;
  const [value, setValue] = useState<T>(() => readDraft(key, initial));
  const saved = useRef(value);
  const save = (next: T = value) => {
    try {
      const serialized = JSON.stringify({ version: 1, data: next });
      if (serialized.length > 3_500_000) throw new Error("large-draft");
      localStorage.setItem(key, serialized);
      saved.current = next;
      setValue(next);
      window.dispatchEvent(new Event(DRAFT_CHANGED));
      notify(t("draftSaved"));
      return true;
    } catch {
      notify(t("draftFailed"));
      return false;
    }
  };
  const reset = () => {
    setValue(saved.current);
    return saved.current;
  };
  return [value, setValue, save, reset];
}
