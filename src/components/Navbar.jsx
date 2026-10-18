export default function Navbar({ view, onNavigate }) {
  const go = (v) => (e) => {
    e.preventDefault()
    onNavigate(v)
  }
  return (
    <header className="nav">
      <a className="logo" href="#" onClick={go('home')}>
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
          <circle cx="14" cy="14" r="10" fill="none" stroke="currentColor" strokeWidth="2.4" />
          <ellipse cx="14" cy="14" rx="13" ry="5" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(-25 14 14)" />
        </svg>
        <span>ORBIT</span>
      </a>
      <nav>
        <a href="#" className={view === 'home' ? 'active' : ''} onClick={go('home')}>Home</a>
        <a href="#" className={view === 'gallery' ? 'active' : ''} onClick={go('gallery')}>Gallery</a>
        <a href="#" className={view === 'about' ? 'active' : ''} onClick={go('about')}>About</a>
      </nav>
      <button type="button" className="btn explore" onClick={() => onNavigate('gallery')}>
        Explore ↗
      </button>
    </header>
  )
}