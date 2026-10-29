"use client";

import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { serviceMessages } from "./services.messages";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { ConfirmDialog } from "../shared/ui/ConfirmDialog";
import { useLocalDraft } from "../shared/drafts/useLocalDraft";
import { demoServices } from "./services.demo";
import { createServiceDraft } from "./services.model";
import type { Service } from "./services.types";
import { ServiceTable } from "./ServiceTable";
import { ServiceDetails } from "./ServiceDetails";
import formStyles from "../shared/styles/editor-form.module.css";

export function ServicesEditor({ addSignal = 0 }: { addSignal?: number }) {
  const { t } = useStudioTranslation(serviceMessages);
  const [services, setServices, save] = useLocalDraft<Service[]>(
    "services",
    demoServices,
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    services[0]?.id ?? null,
  );
  const [draft, setDraft] = useState<Service | null>(null);
  const [filter, setFilter] = useState<string>("Все");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState<keyof typeof serviceMessages | "">("");
  const [lastAddSignal, setLastAddSignal] = useState(addSignal);
  const [uploading, setUploading] = useState(false);
  const photoRequest = useRef(0);
  useLayoutEffect(
    () => () => {
      photoRequest.current += 1;
    },
    [addSignal],
  );
  const current =
    draft ?? services.find((service) => service.id === selectedId);
  const isNew = !!current && !services.some((item) => item.id === current.id);

  if (lastAddSignal !== addSignal) {
    setLastAddSignal(addSignal);
    const service = createServiceDraft();
    setSelectedId(service.id);
    setDraft(service);
    setMessage("");
    setUploading(false);
  }

  function cancelPhoto() {
    photoRequest.current += 1;
    setUploading(false);
  }

  function update(patch: Partial<Service>) {
    if (current) setDraft({ ...current, ...patch });
    setMessage("");
  }

  function selectService(service: Service) {
    cancelPhoto();
    setSelectedId(service.id);
    setDraft(null);
    setMessage("");
  }

  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!current || uploading) return;
    const cleaned = {
      ...current,
      title: current.title.trim(),
      description: current.description.trim(),
      addOns: current.addOns.map((addon) => ({
        ...addon,
        title: addon.title.trim(),
      })),
    };
    if (!cleaned.title || cleaned.addOns.some((addon) => !addon.title)) {
      setMessage("validationError");
      return;
    }
    const next = isNew
      ? [...services, cleaned]
      : services.map((service) =>
          service.id === cleaned.id ? cleaned : service,
        );
    if (save(next)) {
      setServices(next);
      setDraft(null);
      setFilter("Все");
    }
  }

  function cancelChanges() {
    cancelPhoto();
    setDraft(null);
    if (isNew) setSelectedId(services[0]?.id ?? null);
    setMessage("");
  }

  function deleteService() {
    cancelPhoto();
    const next = services.filter((service) => service.id !== deleteId);
    if (save(next)) {
      setServices(next);
      if (selectedId === deleteId) {
        setSelectedId(next[0]?.id ?? null);
        setDraft(null);
      }
      setDeleteId(null);
    } else {
      setMessage("deleteFailed");
    }
  }

  function toggleService(service: Service, visible: boolean) {
    cancelPhoto();
    const next = services.map((item) =>
      item.id === service.id ? { ...item, visible } : item,
    );
    if (save(next)) {
      setServices(next);
      if (draft?.id === service.id) setDraft({ ...draft, visible });
    }
  }

  async function changePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !current) return;
    cancelPhoto();
    if (!/^(image\/jpeg|image\/webp|image\/png)$/.test(file.type)) {
      setMessage("imageType");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage("imageSize");
      return;
    }
    const reader = new FileReader();
    const serviceId = current.id;
    const request = ++photoRequest.current;
    setUploading(true);
    setMessage("");
    const fail = () => {
      if (photoRequest.current !== request) return;
      setUploading(false);
      setMessage("imageInvalid");
    };
    reader.onload = () => {
      const image = reader.result;
      if (typeof image !== "string") return fail();
      if (photoRequest.current !== request) return;
      const preview = new window.Image();
      preview.onload = () => {
        if (photoRequest.current !== request) return;
        setDraft((previous) => {
          const service = previous ?? current;
          return service.id === serviceId
            ? { ...service, image, imageName: file.name }
            : previous;
        });
        setUploading(false);
      };
      preview.onerror = fail;
      preview.src = image;
    };
    reader.onerror = fail;
    reader.readAsDataURL(file);
  }

  return (
    <div className={formStyles.columns}>
      <ServiceTable
        services={services}
        selectedId={selectedId}
        filter={filter}
        onFilterChange={setFilter}
        onSelect={selectService}
        onToggle={toggleService}
        onDelete={setDeleteId}
      />
      {current ? (
        <ServiceDetails
          current={current}
          isNew={isNew}
          hasChanges={draft !== null}
          uploading={uploading}
          message={message ? t(message) : ""}
          update={update}
          onSave={saveService}
          onPhotoChange={changePhoto}
          onCancel={cancelChanges}
          onDelete={setDeleteId}
          onClose={() => {
            cancelPhoto();
            setSelectedId(null);
            setDraft(null);
            setMessage("");
          }}
        />
      ) : (
        <aside className={`${formStyles.panel} ${formStyles.emptyPanel}`}>
          <h2>{t("details")}</h2>
          <p>{t("selectService")}</p>
        </aside>
      )}
      {deleteId && (
        <ConfirmDialog
          title={t("deleteTitle")}
          onCancel={() => setDeleteId(null)}
          onConfirm={deleteService}
        >
          {t("deleteDescription", {
            title:
              services.find((service) => service.id === deleteId)?.title ?? "",
          })}
          {message === "deleteFailed" ? <p role="alert">{t(message)}</p> : null}
        </ConfirmDialog>
      )}
    </div>
  );
}
