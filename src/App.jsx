import { useState } from 'react'
import './App.css'
import './styles/corridor.css'
import './styles/about.css'
import Navbar from './components/Navbar'
import SphereGallery from './components/SphereGallery'
import CorridorGallery from './components/CorridorGallery'
import AboutPage from './components/AboutPage'

export default function App() {
  const [view, setView] = useState('home')

  return (
    <div className="app">
      <Navbar view={view} onNavigate={setView} />
      {view === 'home' && <SphereGallery />}
      {view === 'gallery' && <CorridorGallery />}
      {view === 'about' && <AboutPage onNavigate={setView} />}
    </div>
  )
}