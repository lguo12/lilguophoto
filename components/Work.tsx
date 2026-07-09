import ZoomableImage from "@/components/lightbox/ZoomableImage";

const CATEGORIES = [
  "Portrait",
  "Street",
  "Travel",
  "Street",
  "Portrait",
  "Travel",
  "Portrait",
  "Street",
  "Travel",
] as const;

// TODO: replace placeholder frames with real photographs
const FRAMES = CATEGORIES.map((cat, i) => ({
  num: String(i + 1).padStart(2, "0"),
  cat,
  seed: `lilian-${i + 1}`,
}));

// Reuse the exact same URL as the grid thumbnail (not a separate, larger
// picsum request) so opening the lightbox is an instant cache hit instead of
// a fresh, previously-uncached fetch. Swap for real, properly-sized photos
// once available.
const GALLERY = FRAMES.map((frame) => ({
  src: `https://picsum.photos/seed/${frame.seed}/600/750`,
  alt: `Placeholder ${frame.cat.toLowerCase()} photograph ${frame.num}`,
}));

export default function Work() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="section-head reveal">
          <div>
            <span className="section-num">01 — Selected Work</span>
            <h2 className="section-title">The contact sheet</h2>
          </div>
          <p className="section-note">
            Frames pulled from ongoing portrait, street, and travel work.
          </p>
        </div>

        <div className="contactsheet reveal">
          <div className="sprockets" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
          <div className="grid">
            {FRAMES.map((frame, i) => (
              <figure className="frame" key={frame.num}>
                <ZoomableImage
                  src={GALLERY[i].src}
                  alt={GALLERY[i].alt}
                  images={GALLERY}
                  index={i}
                  fill
                />
                <figcaption className="frame-meta">
                  <span>{frame.num}</span>
                  <span className="cat">{frame.cat}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="sprockets" aria-hidden="true">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
