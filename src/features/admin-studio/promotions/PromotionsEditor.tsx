"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import { initialPromotions } from "./promotions.demo";
import type { Promotion, PromotionFilter } from "./promotions.types";
import { statusOf } from "./promotions.model";
import { PromotionsList } from "./PromotionsList";
import { PromotionDetailsPanel } from "./PromotionDetailsPanel";
import styles from "./PromotionsEditor.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { promotionMessages } from "./promotions.messages";

export function PromotionsEditor() {
  const { t } = useStudioTranslation(promotionMessages);
  const [promotions, , save] = useLocalDraft<Promotion[]>(
    "promotions",
    initialPromotions,
  );
  const [filter, setFilter] = useState<PromotionFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    promotions[0]?.id ?? null,
  );
  const [editor, setEditor] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState<Promotion | null>(null);
  const [deleteError, setDeleteError] = useState<
    keyof typeof promotionMessages | ""
  >("");
  const [error, setError] = useState<keyof typeof promotionMessages | "">("");
  const [uploading, setUploading] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const today = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Amsterdam",
  }).format(new Date());
  const selected =
    editor ??
    promotions.find((promotion) => promotion.id === selectedId) ??
    null;
  const visiblePromotions = promotions
    .filter(
      (promotion) => filter === "all" || statusOf(promotion, today) === filter,
    )
    .toSorted((first, second) => first.order - second.order);
  const isNew =
    !!selected && !promotions.some((promotion) => promotion.id === selected.id);

  function edit(promotion: Promotion) {
    if (uploading) return;
    setSelectedId(promotion.id);
    setEditor(null);
    setError("");
  }

  function change<K extends keyof Promotion>(key: K, value: Promotion[K]) {
    if (selected) setEditor({ ...selected, [key]: value });
    setError("");
  }

  function addPromotion() {
    const draft: Promotion = {
      id: crypto.randomUUID(),
      name: "",
      category: "Все услуги",
      start: today,
      end: today,
      visible: false,
      autoHide: true,
      href: "/services",
      order: Math.max(0, ...promotions.map((promotion) => promotion.order)) + 1,
      alt: "",
      code: "",
      discount: 0,
      color: "#e9d9cc",
      fileName: "",
      fileInfo: "",
    };
    setSelectedId(draft.id);
    setEditor(draft);
    setError("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected || uploading) return;
    if (!selected.name.trim()) return setError("nameRequired");
    if (!selected.start || !selected.end || selected.start > selected.end) {
      return setError("invalidDates");
    }
    if (!Number.isInteger(selected.order) || selected.order < 1)
      return setError("invalidOrder");
    if (
      !Number.isFinite(selected.discount) ||
      selected.discount < 0 ||
      selected.discount > 100
    ) {
      return setError("invalidDiscount");
    }
    if (
      selected.href &&
      !/^\/(?!\/)/.test(selected.href) &&
      !/^https?:\/\/[^\s]+$/i.test(selected.href)
    ) {
      return setError("invalidLink");
    }
    if (isNew && !selected.image) return setError("imageRequired");
    const nextPromotion = {
      ...selected,
      name: selected.name.trim(),
      alt: selected.alt.trim() || selected.name.trim(),
    };
    if (
      !save(
        isNew
          ? [...promotions, nextPromotion]
          : promotions.map((promotion) =>
              promotion.id === selected.id ? nextPromotion : promotion,
            ),
      )
    )
      return;
    setEditor(null);
    if (isNew) setFilter("all");
    setError("");
  }

  function removePromotion() {
    if (!deleting || uploading) return;
    if (!save(promotions.filter((promotion) => promotion.id !== deleting.id))) {
      setDeleteError("deleteFailed");
      return;
    }
    if (selectedId === deleting.id) {
      setSelectedId(null);
      setEditor(null);
    }
    setDeleting(null);
    setDeleteError("");
  }

  function togglePromotion(promotion: Promotion, visible: boolean) {
    if (uploading) return;
    if (visible && promotion.autoHide && promotion.end < today) {
      edit(promotion);
      setError("expiredError");
      return;
    }
    if (
      !save(
        promotions.map((item) =>
          item.id === promotion.id ? { ...item, visible } : item,
        ),
      )
    )
      return;
    if (editor?.id === promotion.id) setEditor({ ...editor, visible });
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !selected || uploading) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return setError("invalidImage");
    }
    if (file.size > 1024 * 1024) return setError("imageTooLarge");
    setUploading(true);
    setError("");
    try {
      const image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          typeof reader.result === "string"
            ? resolve(reader.result)
            : reject(new Error("read"));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const dimensions = await new Promise<{ width: number; height: number }>(
        (resolve, reject) => {
          const preview = new Image();
          preview.onload = () =>
            resolve({
              width: preview.naturalWidth,
              height: preview.naturalHeight,
            });
          preview.onerror = reject;
          preview.src = image;
        },
      );
      setEditor((current) => ({
        ...(current?.id === selected.id ? current : selected),
        image,
        fileName: file.name,
        fileInfo: `${dimensions.width} × ${dimensions.height} · ${Math.ceil(file.size / 1024)} kB`,
      }));
    } catch {
      setError("imageFailed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className={`${styles.layout} ${selected ? "" : styles.withoutDetails}`}
    >
      <PromotionsList
        promotions={promotions}
        visiblePromotions={visiblePromotions}
        selectedId={selectedId}
        today={today}
        filter={filter}
        uploading={uploading}
        setFilter={setFilter}
        addPromotion={addPromotion}
        edit={edit}
        togglePromotion={togglePromotion}
        setDeleting={setDeleting}
      />

      {selected && (
        <PromotionDetailsPanel
          selected={selected}
          isNew={isNew}
          uploading={uploading}
          hasChanges={!!editor}
          error={error ? t(error) : ""}
          uploadRef={uploadRef}
          change={change}
          submit={submit}
          upload={upload}
          onClose={() => {
            if (!uploading) {
              setSelectedId(null);
              setEditor(null);
              setError("");
            }
          }}
          onCancelNew={() => {
            setEditor(null);
            setSelectedId(null);
          }}
          onDelete={() => setDeleting(selected)}
          onRevert={() => {
            setEditor(null);
            setError("");
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={t("deleteTitle")}
          onCancel={() => {
            setDeleting(null);
            setDeleteError("");
          }}
          onConfirm={removePromotion}
        >
          <p>{t("deleteBody", { name: deleting.name })}</p>
          {deleteError ? <p role="alert">{t(deleteError)}</p> : null}
        </ConfirmDialog>
      )}
    </div>
  );
}
