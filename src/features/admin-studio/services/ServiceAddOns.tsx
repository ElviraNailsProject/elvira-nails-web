import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { serviceMessages } from "./services.messages";
import { Icon } from "../shared/ui/controls";
import type { AddOn } from "./services.types";
import formStyles from "../shared/styles/editor-form.module.css";
import styles from "./ServiceAddOns.module.css";

type ServiceAddOnsProps = {
  addOns: AddOn[];
  onChange: (addOns: AddOn[]) => void;
};

export function ServiceAddOns({ addOns, onChange }: ServiceAddOnsProps) {
  const { t } = useStudioTranslation(serviceMessages);
  function changeAddon(id: string, patch: Partial<AddOn>) {
    onChange(
      addOns.map((addon) => (addon.id === id ? { ...addon, ...patch } : addon)),
    );
  }
  function update(patch: { addOns: AddOn[] }) {
    onChange(patch.addOns);
  }
  return (
    <section className={styles.addOnSection}>
      <div className={styles.sectionTitle}>
        <h3>{t("addOns")}</h3>
        <small>{t("addOnsHint")}</small>
      </div>
      <div className={styles.addOnLabels} aria-hidden="true">
        <span>{t("name")}</span>
        <span>+ €</span>
        <span>{t("extraMinutes")}</span>
        <span />
      </div>
      {addOns.map((addon, index) => (
        <div className={styles.addOnRow} key={addon.id}>
          <input
            required
            maxLength={80}
            aria-label={t("addOnName", { index: index + 1 })}
            value={addon.title}
            placeholder={t("name")}
            onChange={(event) =>
              changeAddon(addon.id, { title: event.target.value })
            }
          />
          <input
            type="number"
            min="0"
            max="10000"
            step="0.5"
            required
            aria-label={t("addOnPrice", { index: index + 1 })}
            value={addon.price}
            onChange={(event) =>
              changeAddon(addon.id, {
                price: Number(event.target.value),
              })
            }
          />
          <input
            type="number"
            min="0"
            max="1440"
            step="5"
            required
            aria-label={t("addOnDuration", { index: index + 1 })}
            value={addon.minutes}
            onChange={(event) =>
              changeAddon(addon.id, {
                minutes: Number(event.target.value),
              })
            }
          />
          <button
            type="button"
            className={formStyles.iconButton}
            aria-label={t("deleteAddOn", { title: addon.title || index + 1 })}
            onClick={() =>
              update({
                addOns: addOns.filter((item) => item.id !== addon.id),
              })
            }
          >
            <Icon name="remove" />
          </button>
        </div>
      ))}
      <button
        type="button"
        className={formStyles.dashedButton}
        onClick={() =>
          update({
            addOns: [
              ...addOns,
              {
                id: crypto.randomUUID(),
                title: "",
                price: 0,
                minutes: 0,
              },
            ],
          })
        }
      >
        <Icon name="add" /> {t("addAddOn")}
      </button>
    </section>
  );
}
