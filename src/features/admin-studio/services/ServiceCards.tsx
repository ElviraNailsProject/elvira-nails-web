import Image from "next/image";
import { Icon, Toggle } from "../shared/ui/controls";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { serviceMessages, serviceCategoryKeys } from "./services.messages";
import { formatServiceDuration } from "./services.model";
import type { Service } from "./services.types";
import styles from "./ServiceCards.module.css";

export function ServiceCards({
  services,
  onSelect,
  onToggle,
}: {
  services: Service[];
  onSelect: (service: Service) => void;
  onToggle: (service: Service, visible: boolean) => void;
}) {
  const { t, locale } = useStudioTranslation(serviceMessages);
  return (
    <div className={styles.cards}>
      {services.map((service) => (
        <article className={styles.card} key={service.id}>
          <button
            className={styles.open}
            type="button"
            onClick={() => onSelect(service)}
            aria-label={t("openService", { title: service.title })}
          >
            <span
              className={styles.photo}
              style={{ backgroundColor: service.color }}
            >
              {service.image ? (
                <Image
                  src={service.image}
                  alt=""
                  width={56}
                  height={56}
                  unoptimized
                />
              ) : (
                <Icon name="service-image-placeholder" />
              )}
            </span>
            <span className={styles.description}>
              <strong>{service.title}</strong>
              <small>{t(serviceCategoryKeys[service.category])}</small>
              <span>
                {formatServiceDuration(service.minutes, locale)} ·{" "}
                {service.price} €
              </span>
            </span>
          </button>
          <Toggle
            checked={service.visible}
            onChange={(visible) => onToggle(service, visible)}
            label={t("showService", { title: service.title })}
          />
        </article>
      ))}
    </div>
  );
}
