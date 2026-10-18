import { useCallback, useEffect, useMemo, useState } from 'react'
import photosData from '../data/photos'
import useCorridor from '../hooks/useCorridor'
import ImageModal from './ImageModal'

const SPACING = 330
const MIN_PANELS = 14
const SIZES = [[340, 440], [300, 380], [420, 290], [320, 420], [380, 300]]
const YS = [0, -70, 60, -30, 40, -90]

export default function CorridorGallery() {
  const [filter, setFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const cats = useMemo(
    () => ['All', ...new Set(photosData.map((p) => p.category).filter(Boolean))],
    []
  )
  const list = useMemo(
    () => (filter === 'All' ? photosData : photosData.filter((p) => p.category === filter)),
    [filter]
  )

  
  const items = useMemo(() => {
    const count = Math.max(MIN_PANELS, list.length)
    const total = count + (count % 2)
    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / 2)
      const side = i % 2 ? 1 : -1
      const [w, h] = SIZES[i % SIZES.length]
      return {
        photo: list[i % list.length],
        side, w, h,
        x: side * 540,
        y: YS[(row + (i % 2) * 3) % 6],
        baseZ: -row * SPACING,
      }
    })
  }, [list])
  const L = (items.length / 2) * SPACING
  const n = list.length

  const { stageRef, worldRef, panelRef, onPointerDown, wasDrag, goTo, active } = useCorridor({
    items, L, baseCount: n,
  })

  useEffect(() => {
    if (selected !== null) goTo(selected)
  }, [selected, goTo])

  const step = useCallback(
    (d) => setSelected((s) => (s === null ? s : (s + d + n) % n)),
    [n]
  )
  const prev = useCallback(() => step(-1), [step])
  const next = useCallback(() => step(1), [step])
  const close = useCallback(() => setSelected(null), [])

  const shown = selected === null ? null : list[selected]
  const dot = n > 1 ? (active / (n - 1)) * 100 : 0

  return (
    <main className="corridor-page">
      <div className="corr-stage" ref={stageRef} onPointerDown={onPointerDown}>
        <div className="world" ref={worldRef} key={filter}>
          {items.map((it, i) => (
            <div
              key={i}
              className="panel"
              ref={panelRef(i)}
              role="button"
              aria-label={it.photo.title}
              style={{ backgroundImage: `url("${it.photo.src}")` }}
              onClick={() => !wasDrag() && setSelected(i % n)}
            />
          ))}
        </div>
      </div>
      <div className="floor" />

      <section className="hero corr-hero">
        <small>MY GALLERY</small>
        <div className="corr-title">EXPLORE<br /><b>MY WORLD</b></div>
        <p className="desc">A collection of moments, places and stories — captured from my journey around the world.</p>
        <div className="stats">
          <div><strong>{photosData.length}</strong><span>Photos</span></div>
          <div><strong>{cats.length - 1}</strong><span>Categories</span></div>
          <div><strong>∞</strong><span>Memories</span></div>
        </div>
      </section>

      <aside className="corr-hint">
        <span className="mouse" aria-hidden="true" />
        <p>Drag to explore<small>Scroll to zoom</small></p>
        <div className="depth" aria-hidden="true"><i style={{ top: `${dot}%` }} /></div>
      </aside>

      <footer className="corr-bar">
        <div className="filters">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className={c === filter ? 'on' : ''}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="thumbs-wrap">
          <div className="thumbs">
            {list.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className={i === active ? 'on' : ''}
                style={{ backgroundImage: `url("${p.src}")` }}
                aria-label={p.title}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button type="button" className="icon-btn" aria-label="Previous" onClick={() => goTo((active - 1 + n) % n)}>‹</button>
          <button type="button" className="icon-btn" aria-label="Next" onClick={() => goTo((active + 1) % n)}>›</button>
        </div>
      </footer>

      <ImageModal
        photo={shown}
        index={selected === null ? 0 : selected + 1}
        total={n}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </main>
  )
}