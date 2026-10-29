"use client";
import Link from "next/link";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DraftOwner } from "../shared/drafts/useLocalDraft";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { shellMessages } from "./shell.messages";
import s from "./AdminWorkspace.module.css";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function AdminWorkspace({
  children,
  ownerId,
}: {
  children: ReactNode;
  ownerId: string;
}) {
  const { t } = useStudioTranslation(shellMessages);
  const mounted = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onNotice = (event: Event) => {
      setNotice((event as CustomEvent<string>).detail);
      clearTimeout(timer);
      timer = setTimeout(() => setNotice(""), 8000);
    };
    window.addEventListener("elvira-studio-notice", onNotice);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("elvira-studio-notice", onNotice);
    };
  }, []);
  return (
    <DraftOwner.Provider value={ownerId}>
      <main className={s.workspace}>
        {mounted ? (
          children
        ) : (
          <div className={s.loading} role="status">
            {t("loading")}
          </div>
        )}
        <p className={s.notice}>{t("preview")}</p>
        {notice ? (
          <div className={s.toast} role="status">
            {notice}
          </div>
        ) : null}
      </main>
      <div className={s.smallScreen}>
        <h1>{t("desktopTitle")}</h1>
        <p>{t("desktopHint")}</p>
        <Link href="/admin/collections/student-cases">{t("openCases")}</Link>
      </div>
    </DraftOwner.Provider>
  );
}
