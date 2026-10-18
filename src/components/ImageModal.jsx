import { useEffect } from 'react'

export default function ImageModal({ photo, index, total, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (!photo) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo, onClose, onPrev, onNext])

  if (!photo) return null
  return (
    <div className="modal" role="dialog" aria-label={photo.title} onClick={onClose}>
      <figure className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        <img src={photo.src} alt={photo.title} />
        <figcaption>
          {photo.category && <span className="pill">{photo.category}</span>}
          <h3>{photo.title}</h3>
          {photo.caption && <p>{photo.caption}</p>}
        </figcaption>
        <div className="modal-nav">
          <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous">‹</button>
          <span>{index} / {total}</span>
          <button type="button" className="icon-btn" onClick={onNext} aria-label="Next">›</button>
        </div>
      </figure>
    </div>
  )
}