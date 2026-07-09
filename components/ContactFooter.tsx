export default function ContactFooter() {
  return (
    <footer id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <h2>
              Let&apos;s make
              <br />a picture.
            </h2>
            <p>
              Available for portrait sittings, documentary collaborations,
              and travel commissions.
            </p>
            {/* TODO: replace with a real email address */}
            <a className="contact-link" href="mailto:hello@lilianguo.example">
              hello@lilianguo.example →
            </a>
          </div>
          <div className="footer-cols">
            <div>
              <b>Find</b>
              {/* TODO: link real social/portfolio accounts */}
              <a href="#">Instagram</a>
              <br />
              <a href="#">Print shop</a>
            </div>
            <div>
              <b>Based in</b>
              {/* TODO: replace with a real location */}—
            </div>
          </div>
        </div>
        <div className="colophon">
          <span>© 2026 Lilian Guo. All frames reserved.</span>
          <span>Placeholder site — swap in your own photographs.</span>
        </div>
      </div>
    </footer>
  );
}
