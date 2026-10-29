"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./controls";
import { useStudioTranslation } from "../i18n/useStudioTranslation";
import s from "./ConfirmDialog.module.css";
import layout from "../styles/layout.module.css";

export function ConfirmDialog({
  title,
  children,
  onConfirm,
  onCancel,
}: {
  title: string;
  children?: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useStudioTranslation();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    element?.showModal();
    return () => {
      element?.close();
      trigger?.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className={s.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      <h2 id={titleId}>{title}</h2>
      {children}
      <div className={layout.actions}>
        <Button autoFocus onClick={onCancel}>
          {t("cancel")}
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {t("delete")}
        </Button>
      </div>
    </dialog>
  );
}
