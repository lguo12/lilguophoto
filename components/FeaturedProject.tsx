import ZoomableImage from "@/components/lightbox/ZoomableImage";

export default function FeaturedProject() {
  return (
    <section id="projects">
      <div className="wrap essay reveal">
        <div className="essay-img">
          {/* TODO: replace with a real photograph from the project */}
          <ZoomableImage
            src="https://picsum.photos/seed/lilian-project/900/1200"
            alt="Placeholder image for the featured mental health documentary project"
          />
          <div className="essay-cap">Fig. 1 — from the Mental Health Project</div>
        </div>
        <div className="essay-body">
          <span className="kicker">Featured Project — No. 01</span>
          <h3>The Mental Health Project</h3>
          <p>
            An ongoing documentary project about mental health — the quiet,
            rarely-photographed moments of care, therapy, and recovery,
            made with the people living them.
          </p>
          <blockquote>
            {/* TODO: replace with a real quote from the project */}
            &ldquo;A placeholder pull-quote — swap in a real line from the
            project.&rdquo;
          </blockquote>
          <p>
            {/* TODO: replace with real project details (frame count, timeline, outcome) */}
            A growing sequence of photographs and conversations, shown here
            in part.
          </p>
        </div>
      </div>
    </section>
  );
}
