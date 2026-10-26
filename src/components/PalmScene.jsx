import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, useAnimations, useTexture } from '@react-three/drei'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL
const CLIP = 'Wind_Sway' // nombre de la animación incrustada en el FBX

// Qué texturas (color, normal, rugosidad) usa cada malla del FBX
const SPEC = {
  Tree_0: ['palm02', 'palm02_normal', 'palm02_roughness'],
  Tree_1: ['palm_top', 'palm_top_normal', 'palm_top_roughness'],
  Tree_2: ['coconut_palm_leaf', 'coconut_palm_leaf_normal', 'coconut_palm_leaf_roughness'],
  Tree_3: ['frond_stem', 'frond_stem_normal', 'frond_stem_roughness'],
  Tree_4: ['coconut_2', 'coconut_2_normal', 'coconut_2_roughness'],
}
const TEX_URLS = Object.fromEntries(
  [...new Set(Object.values(SPEC).flat())].map((n) => [n, `${BASE}textures/${n}.webp`])
)

/** Modelo FBX animado + interactividad (hover / click) */
function Palm({ accent, hovered, setHovered, onToggle }) {
  const group = useRef()
  const gust = useRef(0)
  const fbx = useLoader(FBXLoader, `${BASE}models/coconut-palm.fbx`) // 2. Modelo FBX
  const tex = useTexture(TEX_URLS)
  const { actions } = useAnimations(fbx.animations, group) // 2. Animación con useAnimations
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Materiales PBR con las texturas del modelo
  const mats = useMemo(() => {
    Object.entries(tex).forEach(([name, t]) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping // los UV del tronco/hojas se repiten
      t.anisotropy = 8
      t.colorSpace = Object.values(SPEC).some((s) => s[0] === name) ? THREE.SRGBColorSpace : THREE.NoColorSpace
      t.needsUpdate = true
    })
    const list = []
    fbx.traverse((o) => {
      if (!o.isMesh || !SPEC[o.name]) return
      const [map, normalMap, roughnessMap] = SPEC[o.name].map((n) => tex[n])
      o.material = new THREE.MeshStandardMaterial({
        map, normalMap, roughnessMap, roughness: 1, metalness: 0,
        emissive: new THREE.Color('#000000'),
        ...(o.name === 'Tree_2' ? { alphaTest: 0.5, side: THREE.DoubleSide } : {}), // hojas recortadas
      })
      list.push(o.material)
    })
    return list
  }, [fbx, tex])

  useEffect(() => {
    const a = actions[CLIP]
    if (!a) return console.warn(`No se encontró la animación "${CLIP}"`, Object.keys(actions))
    a.reset().fadeIn(0.6).play()
    return () => a.fadeOut(0.3)
  }, [actions])

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
  }, [hovered])

  // 4. useFrame: suaviza escala, brillo y velocidad de la animación
  useFrame((_, dt) => {
    const a = actions[CLIP]
    if (a) {
      const target = (reduced ? 0.4 : hovered ? 1.8 : 1) + gust.current * 3
      a.timeScale = THREE.MathUtils.damp(a.timeScale, target, 3, dt)
    }
    gust.current = THREE.MathUtils.damp(gust.current, 0, 1.5, dt)
    group.current.scale.setScalar(THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.04 : 1, 6, dt))
    mats.forEach((m) => {
      m.emissive.set(accent)
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, hovered ? 0.1 : 0, 5, dt)
    })
  })

  return (
    <group
      ref={group}
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        gust.current = 1 // ráfaga de viento
        onToggle() // cambia el estado de React: la "hora del día"
      }}
    >
      <primitive object={fbx} scale={0.01} />
    </group>
  )
}

/** 4. Formas flotantes que giran y orbitan con useFrame */
function Gems({ accent, hovered }) {
  const refs = useRef([])
  const items = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ a: (i / 6) * Math.PI * 2, r: 2.9 + (i % 3) * 0.55, y: 1.6 + ((i * 1.3) % 4.4), s: 0.13 + 0.05 * (i % 3) })),
    []
  )
  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime
    refs.current.forEach((m, i) => {
      const it = items[i]
      m.rotation.set(t * 0.6 + i, t * 0.8, 0)
      m.position.set(Math.cos(it.a + t * 0.15) * it.r, it.y + Math.sin(t * 0.9 + i) * 0.25, Math.sin(it.a + t * 0.15) * it.r)
      m.scale.setScalar(THREE.MathUtils.damp(m.scale.x, hovered ? 1.4 : 1, 5, dt))
    })
  })
  return items.map((it, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)}>
      <octahedronGeometry args={[it.s]} />
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.9} metalness={0.6} roughness={0.25} />
    </mesh>
  ))
}

/** Desplaza la palmera hacia la derecha (escritorio) o hacia abajo (móvil) sin romper OrbitControls */
function ViewShift() {
  const { camera, size } = useThree()
  useEffect(() => {
    const wide = size.width >= 900
    camera.zoom = wide ? 1 : 0.62 // en móvil se aleja la cámara para que la palmera quepa
    camera.setViewOffset(size.width, size.height, wide ? -size.width * 0.17 : 0, wide ? 0 : -size.height * 0.2, size.width, size.height)
    return () => camera.clearViewOffset()
  }, [camera, size])
  return null
}

export default function PalmScene({ mood, hovered, setHovered, onToggle }) {
  return (
    <>
      {/* 3. Iluminación: ambiental + direccionales + puntual */}
      <hemisphereLight args={[mood.sky, mood.ground, 0.7]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[-6, 8, 5]} intensity={2.4} color={mood.sun} />
      <directionalLight position={[6, 3, -6]} intensity={1.3} color={mood.rim} />
      <pointLight position={[0, 5, 2.5]} intensity={18} distance={14} color={mood.accent} />

      <Palm accent={mood.accent} hovered={hovered} setHovered={setHovered} onToggle={onToggle} />
      <Gems accent={mood.accent} hovered={hovered} />

      {/* Duna donde nace la palmera */}
      <mesh position={[0, -0.12, 0]} scale={[2.4, 0.3, 2.4]}>
        <sphereGeometry args={[1, 48, 24]} />
        <meshStandardMaterial color={mood.sand} roughness={1} />
      </mesh>

      <ViewShift />
      {/* 1. Órbita restringida, sin zoom para no romper el layout */}
      <OrbitControls
        target={[0, 3.1, 0]}
        enableZoom={false}
        enablePan={false}
        enableDamping
        minAzimuthAngle={-0.7}
        maxAzimuthAngle={0.7}
        minPolarAngle={1.25}
        maxPolarAngle={1.75}
      />
    </>
  )
}
