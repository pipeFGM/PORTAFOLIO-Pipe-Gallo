import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/bodoni-moda'
import '@fontsource-variable/instrument-sans'
import './index.css'
import HeroHeader from './components/HeroHeader.jsx'
import Projects from './components/Projects.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HeroHeader />
    <Projects />
  </React.StrictMode>
)
