import { useCallback, useEffect, useRef, useState } from 'react'
import defaultPhotos from '../data/photos'
import useGalleryControls from '../hooks/useGalleryControls'
import { getPoint } from '../utils/spherePoints'
import PhotoSphere from './PhotoSphere'
import ImageModal from './ImageModal'
import Controls from './Controls'
import LoadingScreen from './LoadingScreen'

const calcRadius = () => Math.max(130, Math.min(window.innerWidth, window.innerHeight) * 0.32)

// Kam photos hon to repeat karke sphere bhar deta hai.
const fill = (list, n = 30) =>
  Array.from({ length: Math.max(list.length, n) }, (_, i) => {
    const p = list[i % list.length]
    return { ...p, id: `${p.id}-${i}` }
  })

export default function SphereGallery() {
  const [photos, setPhotos] = useState(() => fill(defaultPhotos))
  const [baseCount, setBaseCount] = useState(defaultPhotos.length)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [ready, setReady] = useState(false)
  const [radius, setRadius] = useState(calcRadius)
  const baseRef = useRef(defaultPhotos)
  const { sphereRef, auto, dragging, toggleAuto, wasDrag, onPointerDown, focusOn } = useGalleryControls()

  useEffect(() => {
    const onResize = () => setRadius(calcRadius())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const go = useCallback(
    (i) => {
      const n = photos.length
      const idx = ((i % n) + n) % n
      const { lat, lon } = getPoint(idx, n)
      setCurrent(idx)
      focusOn(lat, lon)
      return idx
    },
    [photos.length, focusOn]
  )

  const handleSelect = (photo) => {
    if (wasDrag()) return
    const i = photos.findIndex((p) => p.id === photo.id)
    setCurrent(i)
    setSelected(i)
  }
  const stepModal = useCallback((d) => setSelected((sel) => (sel === null ? sel : go(sel + d))), [go])
  const modalPrev = useCallback(() => stepModal(-1), [stepModal])
  const modalNext = useCallback(() => stepModal(1), [stepModal])
  const closeModal = useCallback(() => setSelected(null), [])

  // Jo photos load nahi hui unhe sphere se hata deta hai.
  const onLoaded = useCallback((failed) => {
    if (failed && failed.size) {
      const ok = baseRef.current.filter((p) => !failed.has(p.src))
      if (ok.length) {
        baseRef.current = ok
        setBaseCount(ok.length)
        setPhotos(fill(ok))
      }
    }
    setReady(true)
  }, [])

  const handleUpload = (e) => {
    const files = [...e.target.files]
    if (!files.length) return
    const list = files.map((f, i) => ({
      id: `u${i}`,
      title: f.name.replace(/\.[^.]+$/, ''),
      src: URL.createObjectURL(f),
    }))
    baseRef.current = list
    setBaseCount(list.length)
    setPhotos(fill(list))
    setCurrent(0)
  }

  const shown = selected === null ? null : photos[selected]

  return (
    <main className="gallery">
      {!ready && <LoadingScreen photos={photos} onDone={onLoaded} />}

      <div className={`stage ${dragging ? 'drag' : ''}`} onPointerDown={onPointerDown}>
        <div className="ring ring-back" style={{ width: radius * 3.1, height: radius * 3.1 }} />
        <PhotoSphere photos={photos} radius={radius} sphereRef={sphereRef} onSelect={handleSelect} />
        <div className="shell" style={{ width: radius * 2.4, height: radius * 2.4 }} />
        <div className="ring ring-front" style={{ width: radius * 2.8, height: radius * 2.8 }} />
      </div>

      <section className="hero">
        <small>3D PHOTO GALLERY</small>
        <h2>ORBIT</h2>
        <p className="tag">Your memories, in a whole new dimension.</p>
        <p className="desc">Drag, explore, and discover moments from every angle.</p>
      </section>

      <Controls
        index={(current % baseCount) + 1}
        total={baseCount}
        auto={auto}
        onToggle={toggleAuto}
        onUpload={handleUpload}
        onPrev={() => go(current - 1)}
        onNext={() => go(current + 1)}
      />
      <ImageModal
        photo={shown}
        index={selected === null ? 0 : (selected % baseCount) + 1}
        total={baseCount}
        onClose={closeModal}
        onPrev={modalPrev}
        onNext={modalNext}
      />
    </main>
  )
}