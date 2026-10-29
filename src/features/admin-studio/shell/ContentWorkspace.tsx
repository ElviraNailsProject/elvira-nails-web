"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ServicesEditor } from "../services/ServicesEditor";
import { CoursesEditor } from "../courses/CoursesEditor";
import { GalleryEditor } from "../gallery/GalleryEditor";
import { Button, Icon } from "../shared/ui/controls";
import { useDraftCount } from "../shared/drafts/useLocalDraft";
import s from "../shared/styles/layout.module.css";
import { useStudioTranslation } from "../shared/i18n/useStudioTranslation";
import { shellMessages } from "./shell.messages";
import { ContentTabs } from "./ContentTabs";

export function ContentWorkspace() {
  const { t } = useStudioTranslation(shellMessages);
  const params = useSearchParams();
  const tab = params.get("tab");
  const selected = tab === "services" || tab === "gallery" ? tab : "courses";
  const [addSignal, setAddSignal] = useState(0);
  const galleryUpload = useRef<HTMLInputElement>(null);
  const courseCount = useDraftCount("courses", 3);
  const serviceCount = useDraftCount("services", 6);
  const galleryCount = useDraftCount("gallery", 11);
  return (
    <>
      <div className={s.pageHeading}>
        <div>
          <p className={s.eyebrow}>{t("content")}</p>
          <h1>{t("contentTitle")}</h1>
          <p className={s.subtitle}>{t("contentHint")}</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            if (selected === "gallery") galleryUpload.current?.click();
            else setAddSignal((value) => value + 1);
          }}
        >
          <Icon name="add-white" />
          {selected === "courses"
            ? t("addCourse")
            : selected === "services"
              ? t("addService")
              : t("uploadPhoto")}
        </Button>
      </div>
      <ContentTabs
        selected={selected}
        counts={{
          courses: courseCount,
          services: serviceCount,
          gallery: galleryCount,
        }}
      />
      {selected === "courses" ? (
        <CoursesEditor key="courses" addSignal={addSignal} />
      ) : selected === "services" ? (
        <ServicesEditor key="services" addSignal={addSignal} />
      ) : (
        <GalleryEditor key="gallery" uploadInput={galleryUpload} />
      )}
    </>
  );
}
