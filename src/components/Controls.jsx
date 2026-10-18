export default function Controls({ index, total, auto, onToggle, onUpload, onPrev, onNext }) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <footer className="controls">
      <div className="counter">
        <span>{pad(index)} / {pad(total)}</span>
        <i><b style={{ width: `${(index / total) * 100}%` }} /></i>
      </div>

      <div className="hint">
        <span className="mouse" aria-hidden="true" />
        <p>Drag to rotate<small>Scroll to zoom</small></p>
      </div>

      <div className="actions">
        <label className="btn">
          Add photos
          <input type="file" accept="image/*" multiple onChange={onUpload} />
        </label>
        <button type="button" className="btn" onClick={onToggle}>{auto ? 'Pause' : 'Resume'}</button>
        <button type="button" className="icon-btn" onClick={onPrev} aria-label="Previous photo">‹</button>
        <button type="button" className="icon-btn" onClick={onNext} aria-label="Next photo">›</button>
      </div>
    </footer>
  )
}