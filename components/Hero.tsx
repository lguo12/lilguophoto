export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-text">
        <span className="eyebrow">Portrait · Street · Travel</span>
        <h1 className="hero-title">
          Lilian
          <br />
          Guo
        </h1>
        <p className="hero-deck">
          I photograph people and places the way a journey unfolds —
          unposed, unhurried, and a little bit true.
        </p>
        <span className="hero-scroll">Scroll to see the work</span>
      </div>
      <div className="hero-frame">
        {/* TODO: replace with a real hero photograph */}
        <img
          src="https://picsum.photos/seed/lilian-hero/1000/1250"
          alt="Placeholder portrait — replace with your own hero image"
          loading="lazy"
        />
        <span className="frame-tag">N° 001 — 2026</span>
      </div>
    </section>
  );
}
