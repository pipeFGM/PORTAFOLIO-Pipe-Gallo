const BASE = import.meta.env.BASE_URL
const img = (name) => `${BASE}projects/${name}.webp`

// ✏️ Edita aquí tus proyectos.
//  - wide: true  -> la tarjeta ocupa las 2 columnas
//  - fit: 'contain' -> la imagen se ve completa (útil para piezas verticales)
//  - links: botones de la tarjeta (la imagen abre el primero)
const PROJECTS = [
  {
    id: 'colhybrid-campana',
    tag: 'Dirección de arte',
    title: 'Colhybrid · Campaña publicitaria',
    description: 'Dirección de arte y diseño publicitario para Colhybrid, una marca ficticia de autos híbridos.',
    image: img('colhybrid-campana'),
    ratio: 1800 / 859,
    alt: 'Tres piezas gráficas de la campaña Colhybrid con autos híbridos en tonos azules',
    wide: true,
    links: [],
  },
  {
    id: 'colhybrid-web',
    tag: 'Diseño UI · Figma',
    title: 'Colhybrid · Sitio web',
    description: 'Diseño UI para la presencia digital de la marca. Estética minimalista y sofisticada, adaptada a escritorio y móvil.',
    image: img('colhybrid-web'),
    ratio: 1800 / 896,
    alt: 'Prototipo del sitio web de Colhybrid en versión escritorio y versión teléfono',
    wide: true,
    links: [
      { label: 'Prototipo escritorio', href: 'https://www.figma.com/proto/bbECcippKS3LcEriEWrQs2/COLHYBRID-WEB?node-id=92-380&scaling=scale-down-width&content-scaling=fixed' },
      { label: 'Prototipo teléfono', href: 'https://www.figma.com/proto/uCR0i4CECpQesNADCGjMSH/COLHYBRID-WEB-PHONE?node-id=17-587&starting-point-node-id=17%3A587' },
    ],
  },
  {
    id: 'porsche-contour',
    tag: 'Animación 2D/3D',
    title: 'Porsche · Contour (Spec Ad)',
    description: 'Producción 2D/3D en Blender y After Effects. Anuncio del Porsche 911 centrado en sus curvas, con dirección de arte en tonos azules y líneas delgadas como lenguaje de sofisticación.',
    image: img('porsche-contour'),
    alt: 'Frente de un Porsche 911 en la oscuridad con luces azules',
    links: [{ label: 'Ver en YouTube', href: 'https://youtu.be/gYG6NKh_O4c' }],
  },
  {
    id: 'godzilla-vs-kong',
    tag: 'Stop motion',
    title: 'Godzilla vs Kong',
    description: 'Stop motion con lápices de color sobre papel, fotografiado cuadro por cuadro.',
    image: img('godzilla-vs-kong'),
    alt: 'Dibujo a lápiz de color de Godzilla frente a Kong mientras una mano dibuja',
    links: [{ label: 'Ver en YouTube', href: 'https://www.youtube.com/watch?v=zXUyF86v6OU' }],
  },
  {
    id: 'rotoscopia',
    tag: 'Rotoscopia',
    title: 'Rápidos y furiosos 2 · Estilo rotoscopia',
    description: 'Rotoscopia fotograma por fotograma sobre una escena de la película. Fondo en blanco y negro estilo noir como contraste deliberado para resaltar el color y el trazo de las ilustraciones.',
    image: img('rotoscopia'),
    alt: 'Cuatro autos nocturnos trazados con líneas de neón azul sobre fondo en blanco y negro',
    links: [{ label: 'Ver en YouTube', href: 'https://youtu.be/IUSJIj3hk2s' }],
  },
  {
    id: 'corto-atmosferico',
    tag: 'Audiovisual',
    title: 'Corto atmosférico · La Ceiba (ASMR)',
    description: 'Mood film de una casa campestre. Tomas lentas y contemplativas que recorren los detalles del espacio, con foco en la luz, las texturas y la atmósfera del lugar.',
    image: img('corto-atmosferico'),
    alt: 'Plantas con flores amarillas contra un cielo azul',
    links: [{ label: 'Ver en YouTube', href: 'https://www.youtube.com/watch?v=Ptn-ixRYxeM' }],
  },
  {
    id: 'diseno-de-sonido',
    tag: 'Diseño de sonido',
    title: 'Super Mario Galaxy · Sound Redesign',
    description: 'Rediseño de sonido del tráiler: voces grabadas desde cero, efectos recopilados y editados, sincronización cuadro por cuadro y master final.',
    image: img('diseno-de-sonido'),
    alt: 'Mario, Luigi, Peach y Yoshi volando por el espacio',
    links: [{ label: 'Ver en YouTube', href: 'https://youtu.be/tkaKTQzVvz0' }],
  },
  {
    id: 'dimension-993',
    tag: 'Ilustración · Cómic',
    title: 'Dimensión #993',
    description: 'Cómic de ciencia ficción ilustrado digitalmente en Photoshop e Illustrator. Una historia original con personajes propios, ambientada en el espacio.',
    image: img('dimension-993'),
    alt: 'Página del cómic Dimensión #993 con viñetas espaciales',
    fit: 'contain',
    links: [],
  },
]

function Card({ p }) {
  const main = p.links[0]?.href
  const isVideo = p.links.some((l) => /youtu/.test(l.href))
  const thumb = (
    <div className={`thumb${p.fit === 'contain' ? ' thumb--contain' : ''}`} style={{ aspectRatio: p.ratio ?? 16 / 9 }}>
      {p.fit === 'contain' && <img className="thumb-bg" src={p.image} alt="" aria-hidden="true" loading="lazy" />}
      <img className="thumb-img" src={p.image} alt={p.alt} loading="lazy" decoding="async" />
    </div>
  )

  return (
    <article className={`card${p.wide ? ' card--wide' : ''}`}>
      {main ? (
        <a className="card-media" href={main} target="_blank" rel="noreferrer" aria-label={`${p.title}: abrir ${isVideo ? 'video' : 'proyecto'} en una pestaña nueva`}>
          {thumb}
        </a>
      ) : (
        <div className="card-media">{thumb}</div>
      )}
      <div className="card-body">
        <p className="card-tag">{p.tag}</p>
        <h3>{p.title}</h3>
        <p className="card-desc">{p.description}</p>
        {p.links.length > 0 && (
          <div className="card-links">
            {p.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} <span aria-hidden="true">↗</span></a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="proyectos" className="projects" aria-labelledby="proyectos-title">
      <div className="projects-head">
        <p className="projects-kicker">Portafolio</p>
        <h2 id="proyectos-title">Proyectos</h2>
        <p className="projects-intro">Publicidad, animación, diseño de sonido e ilustración: una selección de trabajos que combinan dirección de arte y producción audiovisual.</p>
      </div>
      <div className="grid">
        {PROJECTS.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </section>
  )
}
