"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./ResponsiveDetails.module.css";
import { useStudioTranslation } from "../i18n/useStudioTranslation";
import { useCompactLayout } from "./useCompactLayout";

/** Keep the desktop panel in its grid; use an accessible full-screen editor on touch layouts. */
export function ResponsiveDetails({
  open,
  onClose,
  label,
  headerActions,
  busy = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  headerActions?: ReactNode;
  busy?: boolean;
  children: ReactNode;
}) {
  const compact = useCompactLayout();
  const { t } = useStudioTranslation();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!compact || !open) return;
    const element = dialog.current;
    if (!element) return;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [compact, open]);

  if (!compact) return children;
  if (!open) return null;
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <header className={styles.heading}>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("back")}
          disabled={busy}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/admin/icons/back.svg" alt="" />
        </button>
        <h2>{label}</h2>
        {headerActions && (
          <div className={styles.headerActions}>{headerActions}</div>
        )}
      </header>
      {children}
    </dialog>
  );
}
