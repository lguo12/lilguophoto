import ZoomableImage from "@/components/lightbox/ZoomableImage";

export default function About() {
  return (
    <section
      id="about"
      style={{
        background: "var(--paper-deep)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div className="wrap about reveal">
        <div className="about-img">
          {/* TODO: replace with a real portrait */}
          <ZoomableImage
            src="https://picsum.photos/seed/lilian-about/700/875"
            alt="Placeholder portrait of Lilian Guo"
          />
        </div>
        <div className="about-body">
          <span className="section-num">02 — About</span>
          <h2 className="section-title">Lilian Guo</h2>
          {/* TODO: replace with a real bio */}
          <p>
            I make portraits, street photographs, and travel work that
            linger a little longer than a glance. My ongoing documentary
            project on mental health looks closely at care and resilience.
          </p>
          <p>
            Available for portrait sittings, editorial work, and
            collaborations.
          </p>
          <div className="stats">
            {/* TODO: replace with real numbers */}
            <div className="stat">
              <b>—</b>
              <span>Years shooting</span>
            </div>
            <div className="stat">
              <b>—</b>
              <span>Projects</span>
            </div>
            <div className="stat">
              <b>—</b>
              <span>Cities visited</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
