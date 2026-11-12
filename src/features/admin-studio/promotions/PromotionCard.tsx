/* Uploaded banner previews are local data URLs. */
/* eslint-disable @next/next/no-img-element */
import { Icon, Toggle } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import {
  promotionCategoryKeys,
  promotionMessages,
} from "./promotions.messages";
import {
  formatDate,
  statusOf,
  timingText,
  visibilityText,
} from "./promotions.model";
import type { Promotion } from "./promotions.types";
import s from "./PromotionCard.module.css";

export function PromotionCard({
  promotion,
  today,
  disabled,
  onEdit,
  onDelete,
  onToggle,
}: {
  promotion: Promotion;
  today: string;
  disabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (visible: boolean) => void;
}) {
  const { t, locale } = useStudioTranslation(promotionMessages);
  const status = statusOf(promotion, today);
  const expired = promotion.autoHide && promotion.end < today;
  return (
    <article className={s.card}>
      <button
        className={s.open}
        type="button"
        onClick={onEdit}
        disabled={disabled}
        aria-label={t("openPromotion", { name: promotion.name })}
      >
        <span
          className={`${s.image} ${status === "hidden" ? s.faded : ""}`}
          style={{ backgroundColor: promotion.color }}
        >
          {promotion.image ? (
            <img
              className={s.uploadedImage}
              src={promotion.image}
              alt={promotion.alt}
            />
          ) : (
            <Icon name="promotion-image-placeholder" />
          )}
        </span>
        <span className={s.identity}>
          <span className={s.name}>{promotion.name}</span>
          <small>
            {promotionCategoryKeys[promotion.category]
              ? t(promotionCategoryKeys[promotion.category])
              : promotion.category}
          </small>
        </span>
        <span className={s.chevron} aria-hidden="true">
          <Icon name="chevron-right" />
        </span>
      </button>
      <div className={s.information}>
        <div className={s.period}>
          <span>
            {formatDate(promotion.start, locale)} –{" "}
            {formatDate(promotion.end, locale)}
          </span>
          <small>{timingText(promotion, today, t)}</small>
        </div>
        <div className={s.visibility}>
          <span
            className={`${s.status} ${status === "active" ? s.active : s.inactive}`}
          >
            {status === "active" ? t("active") : t("inactive")}
          </span>
          <small>{visibilityText(promotion, today, t, locale)}</small>
        </div>
      </div>
      <footer className={s.actions}>
        <div className={s.toggle}>
          <span className={expired ? s.faded : ""}>
            <Toggle
              checked={promotion.visible && !expired}
              onChange={(checked) => {
                if (!disabled) onToggle(checked);
              }}
              label={t("showPromotion", { name: promotion.name })}
            />
          </span>
          <span className={s.tabletLabel}>{t("onSite")}</span>
          <span className={s.mobileLabel}>{t("showOnSite")}</span>
        </div>
        <div className={s.buttons}>
          <button
            type="button"
            className={s.edit}
            onClick={onEdit}
            disabled={disabled}
            aria-label={t("editPromotion", { name: promotion.name })}
          >
            <Icon name="edit" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            aria-label={t("deletePromotion", { name: promotion.name })}
          >
            <Icon name="delete-danger" />
          </button>
        </div>
      </footer>
    </article>
  );
}
