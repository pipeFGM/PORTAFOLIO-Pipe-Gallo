# Hero Header 3D · Felipe Gallo Mazuera

Header interactivo de portafolio hecho con **React + Vite + React Three Fiber + drei**.
Palmera de coco en formato **FBX** con animación incrustada (`Wind_Sway`), luces, formas flotantes con `useFrame`
e interacción por hover/click.

## Correr en local
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera /dist
```

## Dónde editar
- Proyectos del portafolio (título, descripción, imagen, enlaces): arreglo `PROJECTS` en `src/components/Projects.jsx`. Las imágenes están en `public/projects/`.
- Nombre, título y enlaces: `src/components/HeroHeader.jsx` (objeto `PROFILE`).
- Paletas de luz ("Hora dorada" / "Hora azul"): `MOODS` en el mismo archivo.
- Escena 3D, animación y materiales: `src/components/PalmScene.jsx`.
- Modelo y texturas: `public/models/coconut-palm.fbx` y `public/textures/`.

## Requisitos de la tarea
| Requisito | Dónde |
|---|---|
| `<Canvas>` + `OrbitControls` sin zoom | `HeroHeader.jsx` / `PalmScene.jsx` |
| Modelo FBX con `useLoader(FBXLoader)` + `useAnimations` | `Palm` en `PalmScene.jsx` |
| `ambientLight`, `directionalLight`, `pointLight` | `PalmScene` |
| `useFrame` (gemas flotantes, escala, brillo, velocidad) | `Gems` y `Palm` |
| `onClick`, `onPointerOver`, `onPointerOut` con estado de React | `Palm` + `moodIndex` en `HeroHeader.jsx` |
| UI HTML/CSS superpuesta | `HeroHeader.jsx` + `src/index.css` |
| Sección de proyectos (HTML/CSS) | `Projects.jsx` + `src/index.css` |
