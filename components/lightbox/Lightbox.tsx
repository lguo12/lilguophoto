"use client";

import { useEffect, useRef } from "react";
import { useLightbox } from "./LightboxContext";

export default function Lightbox() {
  const { state, closeLightbox, next, prev } = useLightbox();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!state) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight" && state.images.length > 1) next();
      if (e.key === "ArrowLeft" && state.images.length > 1) prev();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [state, closeLightbox, next, prev]);

  if (!state) return null;

  const current = state.images[state.index];
  const hasMultiple = state.images.length > 1;

  return (
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt}
      onClick={closeLightbox}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={closeLightbox}
        ref={closeButtonRef}
        aria-label="Close"
      >
        ✕
      </button>

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--prev"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Previous photo"
        >
          ‹
        </button>
      )}

      {hasMultiple && (
        <button
          type="button"
          className="lightbox-nav lightbox-nav--next"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Next photo"
        >
          ›
        </button>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} />

        <span className="lightbox-caption">
          {current.alt}
          {hasMultiple ? ` — ${state.index + 1} / ${state.images.length}` : ""}
        </span>
      </div>
    </div>
  );
}
