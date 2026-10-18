import { useEffect, useState } from 'react'

// Saari photos preload karta hai aur batata hai kaun si load nahi hui.
export default function LoadingScreen({ photos, onDone }) {
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    let count = 0
    const failed = new Set()
    photos.forEach((p) => {
      const img = new Image()
      const finish = (ok) => {
        if (!ok) failed.add(p.src)
        count += 1
        setLoaded(count)
        if (count === photos.length) onDone(failed)
      }
      img.onload = () => finish(true)
      img.onerror = () => finish(false)
      img.src = p.src
    })
  }, [photos, onDone])

  const pct = Math.round((loaded / photos.length) * 100)
  return (
    <div className="loading">
      <p>Loading photos {pct}%</p>
      <div className="loading-bar"><i style={{ width: `${pct}%` }} /></div>
    </div>
  )
}