import type { ReactNode } from "react";
import { useStudioTranslation } from "../i18n/useStudioTranslation";
import s from "./DetailsPanel.module.css";
import layout from "../styles/layout.module.css";

export function DetailsPanel({
  title,
  children,
  actions,
  onClose,
}: {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
}) {
  const { t } = useStudioTranslation();
  return (
    <aside className={s.panel} aria-label={title}>
      <div className={s.panelHeading}>
        <h2>{title}</h2>
        {onClose ? (
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className={s.close}
          >
            ×
          </button>
        ) : null}
      </div>
      <div className={s.panelBody}>
        {children}
        {actions ? <div className={layout.actions}>{actions}</div> : null}
      </div>
    </aside>
  );
}
