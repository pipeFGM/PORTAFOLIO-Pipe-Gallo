import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import PalmScene from './PalmScene.jsx'

// ✏️ Edita aquí tus datos
const PROFILE = {
  name: ['Felipe Gallo', 'Mazuera'],
  title: 'Dirección creativa para publicidad, moda y marcas de lujo.',
  links: [
    { label: 'Instagram', href: 'https://instagram.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
}

const MOODS = [
  { name: 'Hora dorada', sky: '#bfe3ea', ground: '#7a4a2a', sun: '#ffb870', rim: '#7fd6d0', accent: '#f6b85c', sand: '#c79a67' },
  { name: 'Hora azul', sky: '#9fb2ff', ground: '#2a2250', sun: '#9fb4ff', rim: '#ff8fb1', accent: '#c9b8ff', sand: '#6b6591' },
]

export default function HeroHeader() {
  const [moodIndex, setMoodIndex] = useState(0) // estado de React que cambia al hacer click en la palmera
  const [hovered, setHovered] = useState(false)
  const mood = MOODS[moodIndex]

  return (
    <header className="hero" data-mood={moodIndex} style={{ '--accent': mood.accent }}>
      <div className="sky sky-0" />
      <div className="sky sky-1" />
      <div className="sun" />

      {/* 1. Canvas de R3F ocupando todo el header */}
      <Canvas className="hero-canvas" camera={{ position: [0, 3.4, 14], fov: 32 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <PalmScene mood={mood} hovered={hovered} setHovered={setHovered} onToggle={() => setMoodIndex((i) => (i + 1) % MOODS.length)} />
        </Suspense>
      </Canvas>

      {/* 5. Interfaz HTML/CSS superpuesta al canvas */}
      <nav className="nav">
        <span className="brand">Pipe Gallo</span>
        <a href="#proyectos">Proyectos</a>
      </nav>

      <div className="copy">
        <h1>
          {PROFILE.name[0]}
          <br />
          {PROFILE.name[1]}
        </h1>
        <p className="title">{PROFILE.title}</p>
        <div className="cta">
          <a className="btn" href="#proyectos">Ver proyectos</a>
          {PROFILE.links.map((l) => (
            <a key={l.label} className="link" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </div>
      </div>

      <p className="hint">Arrastra para girar. Toca la palmera para cambiar la luz.</p>
      <p className="mood">{mood.name}</p>
    </header>
  )
}
