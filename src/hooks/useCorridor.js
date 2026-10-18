import { useCallback, useEffect, useRef, useState } from 'react'

const NEAR = 450 
const FOCUS = -650 
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const mod = (a, n) => ((a % n) + n) % n

// Corridor
export default function useCorridor({ items, L, baseCount }) {
  const stageRef = useRef(null)
  const worldRef = useRef(null)
  const panels = useRef([])
  const live = useRef({ items, L, baseCount })
  live.current = { items, L, baseCount }
  const s = useRef({
    cam: 0, vel: 0, yaw: 0, drift: 0.6,
    down: false, lx: 0, ly: 0, moved: 0, target: null, u: 1, active: 0,
  })
  const [active, setActive] = useState(0)

  useEffect(() => {
    const resize = () => {
      const u = clamp(Math.min(window.innerHeight / 900, window.innerWidth / 1300), 0.3, 1.2)
      s.current.u = u
      if (stageRef.current) stageRef.current.style.perspective = `${1400 * u}px`
    }
    resize()

    let id
    const tick = () => {
      const st = s.current
      const { items, L, baseCount } = live.current
      const u = st.u

      if (!st.down) {
        if (st.target !== null) {
          const d = mod(st.target - st.cam + L / 2, L) - L / 2
          st.cam += d * 0.08
          st.vel = 0
          if (Math.abs(d) < 1) st.target = null
        } else {
          st.cam += st.vel
          st.vel += (st.drift - st.vel) * 0.04
        }
        st.yaw += (0 - st.yaw) * 0.05
      }
      if (worldRef.current) worldRef.current.style.transform = `rotateY(${st.yaw}deg)`

      let best = 0
      let bestD = 1e9
      for (let i = 0; i < items.length; i++) {
        const el = panels.current[i]
        if (!el) continue
        const it = items[i]
        const z = NEAR - mod(NEAR - (it.baseZ + st.cam), L)
        const fade = clamp((NEAR - z) / 250, 0, 1) * clamp((z - (NEAR - L)) / 350, 0, 1)
        el.style.width = `${it.w * u}px`
        el.style.height = `${it.h * u}px`
        el.style.opacity = fade
        el.style.pointerEvents = fade < 0.3 ? 'none' : 'auto'
        el.style.transform = `translate3d(${it.x * u}px, ${it.y * u}px, ${z * u}px) rotateY(${-it.side * 72}deg) translate(-50%, -50%)`
        const dd = Math.abs(z - FOCUS)
        if (dd < bestD) {
          bestD = dd
          best = i % baseCount
        }
      }
      if (best !== st.active) {
        st.active = best
        setActive(best)
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
      st.cam += -dy * 1.8
      st.vel = clamp(-dy * 1.8, -60, 60)
      st.yaw = clamp(st.yaw + dx * 0.08, -18, 18)
    }
    const up = () => { s.current.down = false }
    const wheel = (e) => {
      const st = s.current
      st.drift = 0
      st.target = null
      st.vel = clamp(st.vel - e.deltaY * 0.12, -60, 60)
    }
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('wheel', wheel, { passive: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('wheel', wheel)
    }
  }, [])

  const onPointerDown = (e) => {
    const st = s.current
    st.down = true
    st.drift = 0
    st.target = null
    st.moved = 0
    st.lx = e.clientX
    st.ly = e.clientY
  }
  
  const goTo = useCallback((i) => {
    const it = live.current.items[i]
    if (!it) return
    s.current.drift = 0
    s.current.target = FOCUS - it.baseZ
  }, [])
  const panelRef = useCallback((i) => (el) => { panels.current[i] = el }, [])
  const wasDrag = () => s.current.moved >= 6

  return { stageRef, worldRef, panelRef, onPointerDown, wasDrag, goTo, active }
}