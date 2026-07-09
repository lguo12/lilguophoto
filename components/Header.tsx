export default function Header() {
  return (
    <header>
      <div className="nav-inner">
        <a href="#top" className="mark">
          GUO<span>.</span>
        </a>
        <nav aria-label="Primary">
          <ul>
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
