"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PublicStudentCaseDto, StudentCaseLocale } from "../contracts";
import { publicCopy } from "./content";
import styles from "./public-cases.module.css";

const PAGE_SIZE = 9;

export function CaseGallery({
  images,
  locale,
}: {
  images: PublicStudentCaseDto["images"];
  locale: StudentCaseLocale;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const nextImageToFocus = useRef<number | null>(null);
  const copy = publicCopy[locale];
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  function move(direction: number) {
    setActiveIndex((index) =>
      index === null
        ? null
        : (index + direction + images.length) % images.length,
    );
  }

  if (!images.length) return null;

  return (
    <section className={styles.gallery} aria-labelledby="case-gallery-heading">
      <div className={styles.container}>
        <p className={styles.eyebrow}>{copy.galleryLabel}</p>
        <h2 id="case-gallery-heading">{copy.gallery}</h2>
        <div id="case-gallery-grid" className={styles.galleryGrid}>
          {images.slice(0, visibleCount).map((image, index) => (
            <button
              key={image.id}
              ref={(button) => {
                if (button && nextImageToFocus.current === index) {
                  nextImageToFocus.current = null;
                  button.focus();
                }
              }}
              type="button"
              className={styles.galleryImage}
              aria-label={`${copy.openImage}: ${image.altText || copy.imageCount(index + 1, images.length)}`}
              aria-haspopup="dialog"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setActiveIndex(index);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={image.url}
                alt={image.altText}
                fill
                unoptimized
                sizes="(max-width: 620px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
        {visibleCount < images.length ? (
          <div className={styles.moreImages}>
            <button
              type="button"
              aria-controls="case-gallery-grid"
              onClick={() => {
                // Keep keyboard users with the newly revealed content, even when this button disappears.
                nextImageToFocus.current = visibleCount;
                setVisibleCount((count) => count + PAGE_SIZE);
              }}
            >
              {copy.moreImages}
              <Image
                src="/student-cases/icons/0ebbf.svg"
                alt=""
                width={20}
                height={20}
              />
            </button>
          </div>
        ) : null}
      </div>
      <dialog
        ref={dialog}
        className={styles.lightbox}
        aria-label={copy.gallery}
        onClose={() => {
          setActiveIndex(null);
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className={styles.lightboxContent}>
          <header className={styles.lightboxHeader}>
            <p aria-live="polite">
              {activeIndex === null
                ? ""
                : copy.imageCount(activeIndex + 1, images.length)}
            </p>
            <button
              type="button"
              aria-label={copy.closeImage}
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </header>
          {activeImage ? (
            <div className={styles.lightboxImage}>
              <Image
                src={activeImage.url}
                alt={activeImage.altText}
                fill
                unoptimized
                sizes="90vw"
              />
              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    className={styles.previousImage}
                    aria-label={copy.previous}
                    onClick={() => move(-1)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.nextImage}
                    aria-label={copy.next}
                    onClick={() => move(1)}
                  >
                    →
                  </button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </dialog>
    </section>
  );
}
