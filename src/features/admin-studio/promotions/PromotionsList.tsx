/* Uploaded banner previews are local data URLs. */
/* eslint-disable @next/next/no-img-element */
import { Button, Icon, Toggle } from "../shared/ui/controls";
import type { Promotion, PromotionFilter } from "./promotions.types";
import {
  formatDate,
  statusOf,
  timingText,
  visibilityText,
} from "./promotions.model";
import styles from "./PromotionsList.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import {
  promotionMessages,
  promotionCategoryKeys,
} from "./promotions.messages";

const filters: {
  value: PromotionFilter;
  label: keyof typeof promotionMessages;
}[] = [
  { value: "all", label: "all" },
  { value: "active", label: "activeFilter" },
  { value: "scheduled", label: "scheduled" },
  { value: "hidden", label: "hidden" },
];

type PromotionsListProps = {
  promotions: Promotion[];
  visiblePromotions: Promotion[];
  selectedId: string | null;
  today: string;
  filter: PromotionFilter;
  uploading: boolean;
  setFilter: (filter: PromotionFilter) => void;
  addPromotion: () => void;
  edit: (promotion: Promotion) => void;
  togglePromotion: (promotion: Promotion, visible: boolean) => void;
  setDeleting: (promotion: Promotion) => void;
};

export function PromotionsList({
  promotions,
  visiblePromotions,
  selectedId,
  today,
  filter,
  uploading,
  setFilter,
  addPromotion,
  edit,
  togglePromotion,
  setDeleting,
}: PromotionsListProps) {
  const { t, locale } = useStudioTranslation(promotionMessages);
  return (
    <section className={styles.list} aria-labelledby="promotions-heading">
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{t("title")}</p>
          <h1 id="promotions-heading">{t("title")}</h1>
          <p className={styles.subtitle}>{t("subtitle")}</p>
        </div>
        <Button variant="primary" onClick={addPromotion} disabled={uploading}>
          <Icon name="add-white" />
          {t("add")}
        </Button>
      </header>

      <div className={styles.filters} aria-label={t("filterLabel")}>
        {filters.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {t(label)}
            <span>
              {value === "all"
                ? promotions.length
                : promotions.filter(
                    (promotion) => statusOf(promotion, today) === value,
                  ).length}
            </span>
          </button>
        ))}
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.imageColumn} />
            <col className={styles.nameColumn} />
            <col className={styles.periodColumn} />
            <col className={styles.statusColumn} />
            <col className={styles.toggleColumn} />
            <col className={styles.actionsColumn} />
          </colgroup>
          <thead>
            <tr>
              <th>{t("image")}</th>
              <th>{t("promotion")}</th>
              <th>{t("period")}</th>
              <th>{t("status")}</th>
              <th>{t("onSite")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {visiblePromotions.map((promotion) => {
              const status = statusOf(promotion, today);
              const expired = promotion.autoHide && promotion.end < today;
              return (
                <tr
                  key={promotion.id}
                  className={
                    selectedId === promotion.id ? styles.selectedRow : ""
                  }
                >
                  <td>
                    <button
                      type="button"
                      className={`${styles.thumbnail} ${status === "hidden" ? styles.faded : ""}`}
                      style={{ backgroundColor: promotion.color }}
                      aria-label={t("openPromotion", { name: promotion.name })}
                      disabled={uploading}
                      onClick={() => edit(promotion)}
                    >
                      {promotion.image ? (
                        <img
                          className={styles.uploadedImage}
                          src={promotion.image}
                          alt={promotion.alt}
                        />
                      ) : (
                        <Icon name="promotion-image-placeholder" />
                      )}
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => edit(promotion)}
                      disabled={uploading}
                    >
                      {promotion.name}
                    </button>
                    <small>
                      {promotionCategoryKeys[promotion.category]
                        ? t(promotionCategoryKeys[promotion.category])
                        : promotion.category}
                    </small>
                  </td>
                  <td>
                    <span className={styles.dates}>
                      {formatDate(promotion.start, locale)} –{" "}
                      {formatDate(promotion.end, locale)}
                    </span>
                    <small>{timingText(promotion, today, t)}</small>
                  </td>
                  <td>
                    <span
                      className={`${styles.status} ${status === "active" ? styles.active : styles.inactive}`}
                    >
                      {status === "active" ? t("active") : t("inactive")}
                    </span>
                    <small className={styles.statusHint}>
                      {visibilityText(promotion, today, t, locale)}
                    </small>
                  </td>
                  <td>
                    <span className={expired ? styles.expiredToggle : ""}>
                      <Toggle
                        checked={promotion.visible && !expired}
                        onChange={(checked) =>
                          togglePromotion(promotion, checked)
                        }
                        label={t("showPromotion", { name: promotion.name })}
                      />
                    </span>
                  </td>
                  <td>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        disabled={uploading}
                        aria-label={t("editPromotion", {
                          name: promotion.name,
                        })}
                        onClick={() => edit(promotion)}
                      >
                        <Icon name="edit" />
                      </button>
                      <button
                        type="button"
                        aria-label={t("deletePromotion", {
                          name: promotion.name,
                        })}
                        disabled={uploading}
                        onClick={() => setDeleting(promotion)}
                      >
                        <Icon name="delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {visiblePromotions.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  {t("empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <footer className={styles.tableFooter}>
          <span>
            {t("count", {
              visible: visiblePromotions.length,
              total: promotions.length,
            })}
          </span>
          <span>
            <span className={styles.clock} aria-hidden="true">
              <Icon name="clock-face" />
              <Icon name="clock-hands" />
            </span>
            {t("expiryNote")}
          </span>
        </footer>
      </div>
    </section>
  );
}
