"use client";

import { useLightbox, type LightboxImage } from "./LightboxContext";

type ZoomableImageProps = {
  src: string;
  alt: string;
  /** Full gallery this image belongs to, for prev/next navigation. Defaults to a single-image gallery. */
  images?: LightboxImage[];
  /** This image's position within `images`. */
  index?: number;
  /** Set when the parent container establishes a definite height the trigger should fill (e.g. aspect-ratio frames, grid-stretched panes). */
  fill?: boolean;
  loading?: "lazy" | "eager";
};

export default function ZoomableImage({
  src,
  alt,
  images,
  index = 0,
  fill = false,
  loading = "lazy",
}: ZoomableImageProps) {
  const { openLightbox } = useLightbox();
  const gallery = images ?? [{ src, alt }];

  return (
    <button
      type="button"
      className={`zoomable-trigger${fill ? " zoomable-trigger--fill" : ""}`}
      onClick={() => openLightbox(gallery, index)}
      aria-label={`Open larger view: ${alt}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={loading === "eager" ? "high" : "auto"}
      />
    </button>
  );
}
