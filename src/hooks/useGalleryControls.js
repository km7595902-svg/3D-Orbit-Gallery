import { useCallback, useEffect, useRef, useState } from 'react'

const PERSPECTIVE = 2000 
const ZMIN = -500
const ZMAX = 500
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))


export default function useGalleryControls() {
  const sphereRef = useRef(null)
  const s = useRef({
    rx: -12, ry: 0, vx: 0, vy: 0.18,
    down: false, lx: 0, ly: 0, moved: 0,
    auto: true, zoom: 0, zoomT: 0, target: null,
  })
  const [auto, setAuto] = useState(true)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    let id
    const tick = () => {
      const st = s.current
      if (st.target && !st.down) {
        const dx = st.target.ry - st.ry
        const dy = st.target.rx - st.rx
        st.ry += dx * 0.09
        st.rx += dy * 0.09
        st.vx = 0
        st.vy = 0
        if (Math.abs(dx) < 0.15 && Math.abs(dy) < 0.15) st.target = null
      } else if (!st.down) {
        st.ry += st.vy
        st.rx += st.vx
        st.vx *= 0.95
        st.vy = st.auto ? st.vy + (0.18 - st.vy) * 0.04 : st.vy * 0.95
      }
      st.rx = clamp(st.rx, -80, 80)
      st.zoom += (st.zoomT - st.zoom) * 0.12

      const el = sphereRef.current
      if (el) {
        el.style.transform = `translateZ(${st.zoom}px) rotateX(${st.rx}deg) rotateY(${st.ry}deg)`
        
        el.parentElement.style.setProperty('--zs', PERSPECTIVE / (PERSPECTIVE - st.zoom))
      }
      id = requestAnimationFrame(tick)
    }
    tick()

    const move = (e) => {
      const st = s.current
      if (!st.down) return
      const dx = e.clientX - st.lx
      const dy = e.clientY - st.ly
      st.lx = e.clientX
      st.ly = e.clientY
      st.moved += Math.abs(dx) + Math.abs(dy)
      st.ry += dx * 0.35
      st.rx -= dy * 0.35
      st.vy = dx * 0.35
      st.vx = -dy * 0.35
    }
    const up = () => {
      s.current.down = false
      setDragging(false)
    }
    const wheel = (e) => {
      s.current.zoomT = clamp(s.current.zoomT - e.deltaY * 0.6, ZMIN, ZMAX)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('wheel', wheel, { passive: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('wheel', wheel)
    }
  }, [])

  const onPointerDown = (e) => {
    const st = s.current
    st.down = true
    st.target = null
    st.moved = 0
    st.lx = e.clientX
    st.ly = e.clientY
    setDragging(true)
  }
  const toggleAuto = () => {
    const st = s.current
    st.auto = !st.auto
    st.target = null
    if (!st.auto) st.vy = 0
    setAuto(st.auto)
  }
  
  const focusOn = useCallback((lat, lon) => {
    const st = s.current
    const raw = -lon
    const k = Math.round((st.ry - raw) / 360)
    st.target = { rx: clamp(-lat, -80, 80), ry: raw + 360 * k }
    st.auto = false
    setAuto(false)
  }, [])
  const wasDrag = () => s.current.moved >= 6

  return { sphereRef, auto, dragging, toggleAuto, wasDrag, onPointerDown, focusOn }
}