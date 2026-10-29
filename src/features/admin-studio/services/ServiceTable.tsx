import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { serviceMessages, serviceCategoryKeys } from "./services.messages";
import Image from "next/image";
import { Icon, Toggle } from "../shared/ui/controls";
import { categories } from "./services.demo";
import { formatServiceDuration } from "./services.model";
import type { Service } from "./services.types";
import formStyles from "../shared/styles/editor-form.module.css";
import styles from "./ServiceTable.module.css";

type ServiceTableProps = {
  services: Service[];
  selectedId: string | null;
  filter: string;
  onFilterChange: (filter: string) => void;
  onSelect: (service: Service) => void;
  onToggle: (service: Service, visible: boolean) => void;
  onDelete: (id: string) => void;
};

export function ServiceTable({
  services,
  selectedId,
  filter,
  onFilterChange,
  onSelect,
  onToggle,
  onDelete,
}: ServiceTableProps) {
  const { t, locale } = useStudioTranslation(serviceMessages);
  const filtered = services.filter(
    (service) => filter === "Все" || service.category === filter,
  );
  return (
    <section className={formStyles.mainColumn} aria-label={t("services")}>
      <div className={styles.filters} aria-label={t("categories")}>
        {(["Все", ...categories] as const).map((category) => (
          <button
            type="button"
            key={category}
            aria-pressed={filter === category}
            className={filter === category ? styles.activeFilter : ""}
            onClick={() => onFilterChange(category)}
          >
            {t(serviceCategoryKeys[category])}
          </button>
        ))}
      </div>
      <div className={styles.serviceTable}>
        <table>
          <colgroup>
            <col className={styles.photoColumn} />
            <col className={styles.nameColumn} />
            <col className={styles.durationColumn} />
            <col className={styles.priceColumn} />
            <col className={styles.visibleColumn} />
            <col className={styles.actionColumn} />
          </colgroup>
          <thead>
            <tr>
              <th>{t("photo")}</th>
              <th>{t("service")}</th>
              <th>{t("duration")}</th>
              <th>{t("price")}</th>
              <th>{t("visibility")}</th>
              <th className={styles.right}>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => (
              <tr
                key={service.id}
                className={
                  selectedId === service.id ? styles.selectedRow : undefined
                }
              >
                <td>
                  <button
                    type="button"
                    className={styles.servicePhoto}
                    style={{ backgroundColor: service.color }}
                    aria-label={t("openService", { title: service.title })}
                    onClick={() => onSelect(service)}
                  >
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt=""
                        width={64}
                        height={64}
                        unoptimized
                      />
                    ) : (
                      <Icon name="service-image-placeholder" />
                    )}
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className={styles.serviceName}
                    onClick={() => onSelect(service)}
                  >
                    {service.title}
                  </button>
                  <span className={styles.category}>
                    {t(serviceCategoryKeys[service.category])}
                  </span>
                </td>
                <td className={styles.duration}>
                  {formatServiceDuration(service.minutes, locale)}
                </td>
                <td>{service.price} €</td>
                <td>
                  <Toggle
                    checked={service.visible}
                    onChange={(checked) => onToggle(service, checked)}
                    label={t("showService", { title: service.title })}
                  />
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button
                      type="button"
                      className={formStyles.iconButton}
                      aria-label={t("editService", { title: service.title })}
                      onClick={() => onSelect(service)}
                    >
                      <Icon name="edit" />
                    </button>
                    <button
                      type="button"
                      className={formStyles.iconButton}
                      aria-label={t("deleteService", { title: service.title })}
                      onClick={() => onDelete(service.id)}
                    >
                      <Icon name="delete" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className={formStyles.empty}>{t("empty")}</p>
        )}
        <p className={styles.tableFooter}>
          {t("showing", { count: filtered.length, total: services.length })}
        </p>
      </div>
    </section>
  );
}
