import photos from '../data/photos'


const NAME = 'Alxe'
const STATS = [
  { value: '500+', label: 'Photos Captured', icon: 'image' },
  { value: '12+', label: 'Places Visited', icon: 'pin' },
  { value: '100%', label: 'Passion', icon: 'heart' },
  { value: '1', label: 'Amazing Journey', icon: 'star' },
]


const pick = (title, fallback) => (photos.find((p) => p.title === title) || photos[fallback] || {}).src

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const ICONS = {
  camera: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
  plane: <><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></>,
  heart: <path d="M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11z" />,
  code: <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M3 17l5-5 4 4 3-3 6 6" /></>,
  pin: <><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
}

const SKILLS = [
  { title: 'Photography', sub: 'Capture Life', icon: 'camera' },
  { title: 'Travel', sub: 'Explore Places', icon: 'plane' },
  { title: 'Nature', sub: 'Feel the Peace', icon: 'heart' },
  { title: 'Tech', sub: 'Build Dreams', icon: 'code' },
]

const bg = (src) => ({ backgroundImage: `url("${src}")` })

export default function AboutPage({ onNavigate }) {
  return (
    <main className="about">
      <div className="about-main">
        <section className="about-copy">
          <p className="eyebrow">ABOUT ME</p>
          <h2>
            Turning Moments
            <span>Into Memories</span>
          </h2>
          <p className="about-text">
            Hi, I'm {NAME} — a dreamer, creator, and passionate photographer. This is my little space on the
            internet where I collect the moments that matter. From peaceful nature shots to candid everyday
            moments, I love capturing the beauty in the ordinary and extraordinary.
          </p>

          <ul className="skills">
            {SKILLS.map((s) => (
              <li key={s.title} className="skill">
                <span className="skill-ic"><Icon>{ICONS[s.icon]}</Icon></span>
                <strong>{s.title}</strong>
                <small>{s.sub}</small>
              </li>
            ))}
          </ul>

          <blockquote className="quote">
            <span className="quote-mark" aria-hidden="true">“</span>
            <p>Not just photos,<br />but pieces of my journey.</p>
            <cite>— {NAME}</cite>
          </blockquote>
        </section>

        <section className="visual" aria-hidden="true">
          <div className="orbit-ring" />
          <div className="v-card side s1" style={bg(pick('Forest', 0))} />
          <div className="v-card side s2" style={bg(pick('Tree', 1))} />
          <div className="v-card main" style={bg(pick('Mountain', 2))} />
          <div className="v-card side s3" style={bg(pick('Waterfall', 3))} />
          <div className="explore-note">
            Explore<br />My World
            <svg width="54" height="40" viewBox="0 0 54 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M46 3C48 16 36 28 10 33" /><path d="M16 26l-7 7 9 4" />
            </svg>
          </div>
        </section>
      </div>

      <footer className="about-stats">
        {STATS.map((s) => (
          <div key={s.label} className="a-stat">
            <span className="a-ic"><Icon>{ICONS[s.icon]}</Icon></span>
            <div>
              <strong>{s.value}</strong>
              <small>{s.label}</small>
            </div>
          </div>
        ))}
        <button type="button" className="btn see-btn" onClick={() => onNavigate('gallery')}>
          See My Gallery →
        </button>
      </footer>
    </main>
  )
}