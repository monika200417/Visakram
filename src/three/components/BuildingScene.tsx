import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { threePalette } from '../materials/palette'
import { remap, clamp01 } from '../utils/mathHelpers'
import { sampleCamera, cameraLookAt } from '../utils/cameraKeyframes'

export type ProgressRef = RefObject<{ value: number }>

type BuildingSceneProps = {
  /**
   * A mutable ref, not React state — GSAP's ScrollTrigger writes the
   * normalized 0–1 scroll progress into `progressRef.current.value` on
   * every scrub tick (see useFromPlanToPlaceScrub). Reading it here in
   * useFrame is what keeps this scene fully imperative: no React render
   * is ever triggered by scrolling (Milestone 10 §22).
   */
  progressRef: ProgressRef
}

// ============================================================================
// Building proportions
// ----------------------------------------------------------------------------
// A rectangular footprint with one deliberate asymmetric move — the top
// floor sets back on the +X side — so the silhouette reads as a massed
// contemporary volume rather than a plain extruded tower. Three lower
// floors share the full footprint; the top floor is a smaller, offset
// block sitting on top of them.
// ============================================================================
const HALF_X = 2.4 // half-width of the main (lower) volume along X
const HALF_Z = 1.8 // half-depth along Z
const WALL_THICKNESS = 0.12
const FLOOR_HEIGHT = 0.95
const LOWER_FLOOR_COUNT = 3
const FLOOR_COUNT = LOWER_FLOOR_COUNT + 1 // + the setback top floor
const LOWER_HEIGHT = FLOOR_HEIGHT * LOWER_FLOOR_COUNT
const FULL_HEIGHT = FLOOR_HEIGHT * FLOOR_COUNT

// The setback top-floor volume: narrower along X, shifted toward -X so it
// recedes from the +X face (the building's one asymmetric massing move).
const UPPER_HALF_X = HALF_X - 0.6
const UPPER_OFFSET_X = -0.3
const UPPER_HALF_Z = HALF_Z

// Structural grid: 3 columns along X, 3 along Z (9 total), inset from the
// lower volume's footprint edge. Columns run the full height — a
// continuous structural frame is a reasonable read even under a setback
// facade above it.
const COLUMN_X = [-HALF_X + 0.3, 0, HALF_X - 0.3]
const COLUMN_Z = [-HALF_Z + 0.3, 0, HALF_Z - 0.3]
const COLUMN_SIZE = 0.22

// Perimeter beam rings, one per floor level, connecting the outer columns.
const BEAM_LEVELS = Array.from({ length: FLOOR_COUNT }, (_, i) => FLOOR_HEIGHT * (i + 1))
const BEAM_SPAN_X = (HALF_X - 0.3) * 2
const BEAM_SPAN_Z = (HALF_Z - 0.3) * 2
const BEAM_INSET_X = HALF_X - 0.3
const BEAM_INSET_Z = HALF_Z - 0.3
const BEAM_HEIGHT = 0.18
const BEAM_THICKNESS = 0.15

// Window grid on the two faces the final 3/4 camera composition actually
// sees (front +Z, right +X) — two per floor per face on the lower block,
// one per face on the smaller upper block.
const WINDOW_WIDTH = 0.46
const WINDOW_HEIGHT = 0.52
const WINDOW_OFFSET = WALL_THICKNESS / 2 + 0.005

// Balconies sit on the two middle lower floors only (front face).
const BALCONY_FLOOR_INDICES = [1, 2]

// Facade fins: evenly spaced across the lower block's front face, offset
// so they don't collide with the entrance volume.
const FIN_X_POSITIONS = [-2.0, -1.2, 1.1, 1.9]

type Block = {
  halfX: number
  halfZ: number
  offsetX: number
  baseY: number
  height: number
}

const LOWER_BLOCK: Block = {
  halfX: HALF_X,
  halfZ: HALF_Z,
  offsetX: 0,
  baseY: 0,
  height: LOWER_HEIGHT,
}
const UPPER_BLOCK: Block = {
  halfX: UPPER_HALF_X,
  halfZ: UPPER_HALF_Z,
  offsetX: UPPER_OFFSET_X,
  baseY: LOWER_HEIGHT,
  height: FLOOR_HEIGHT,
}

/**
 * A procedural architectural massing study — plain boxes and planes, not
 * an imported model or a reconstruction of any real Visakram Builders
 * project (Milestone 10 §7; redesign brief). See
 * `fromPlanToPlaceDisclaimer` in src/data/fromPlanToPlace.ts, rendered as
 * real HTML alongside this canvas.
 *
 * Construction reveal is driven entirely by SCALE and POSITION, with
 * every structural/facade material fixed at full opacity
 * (`transparent: false`, never mutated). This is a deliberate choice made
 * after a diagnostic investigation proved the render pipeline, camera and
 * scroll-progress wiring were all correct in isolation using a single
 * always-opaque test box — the one meaningful difference between that
 * proven-visible test and the earlier geometry was a large amount of
 * `transparent: true` + `opacity` toggling used purely as a reveal
 * mechanism. Rather than keep relying on that path, every solid mass here
 * grows into place via scale/position (which also reads better as
 * "engineered, precise" construction than a fade would). The only
 * exceptions are the site-plan grid (a genuinely translucent guide line,
 * unaffected by this — it was visible throughout every diagnostic pass)
 * and the window glazing, whose material is a fixed semi-transparent
 * value set once at creation, never mutated per frame.
 *
 * Every visible property (scale, position, camera) is mutated directly on
 * the underlying Three.js objects inside useFrame — nothing here causes a
 * React re-render while scrolling. Elements are grouped by stage and
 * iterate their group's `.children` rather than holding one ref per mesh.
 * Geometries and materials are created once via `useMemo` and shared
 * across the meshes that repeat them (columns, beams, windows, fins) —
 * real reuse of GPU resources without the added complexity/risk of a
 * second, less-tested `InstancedMesh` transform path, at a scene size
 * (~70 meshes) where that risk isn't worth the draw-call saving.
 */
export function BuildingScene({ progressRef }: BuildingSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const gridRef = useRef<THREE.GridHelper>(null)
  const foundationGroupRef = useRef<THREE.Group>(null)
  const groundRef = useRef<THREE.Mesh>(null)
  const columnsGroupRef = useRef<THREE.Group>(null)
  const beamsGroupRef = useRef<THREE.Group>(null)
  const floorsGroupRef = useRef<THREE.Group>(null)
  const facadeGroupRef = useRef<THREE.Group>(null)
  const windowsGroupRef = useRef<THREE.Group>(null)
  const entranceRef = useRef<THREE.Mesh>(null)
  const entrancePathRef = useRef<THREE.Mesh>(null)
  const balconiesGroupRef = useRef<THREE.Group>(null)
  const finsGroupRef = useRef<THREE.Group>(null)
  const parapetGroupRef = useRef<THREE.Group>(null)

  // --- Shared geometries/materials — created once, reused across every
  // mesh that repeats them (real GPU resource reuse). ---
  const columnGeometry = useMemo(
    () => new THREE.BoxGeometry(COLUMN_SIZE, FULL_HEIGHT, COLUMN_SIZE),
    [],
  )
  const structureMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: threePalette.stone, roughness: 0.85, metalness: 0 }),
    [],
  )
  const beamGeometryX = useMemo(
    () => new THREE.BoxGeometry(BEAM_SPAN_X, BEAM_HEIGHT, BEAM_THICKNESS),
    [],
  )
  const beamGeometryZ = useMemo(
    () => new THREE.BoxGeometry(BEAM_THICKNESS, BEAM_HEIGHT, BEAM_SPAN_Z),
    [],
  )
  const windowGeometry = useMemo(() => new THREE.PlaneGeometry(WINDOW_WIDTH, WINDOW_HEIGHT), [])
  const glassMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: threePalette.ink,
        roughness: 0.25,
        metalness: 0.2,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      }),
    [],
  )
  const finGeometry = useMemo(() => new THREE.BoxGeometry(0.08, LOWER_HEIGHT * 0.85, 0.16), [])
  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: threePalette.terracotta,
        roughness: 0.75,
        metalness: 0,
      }),
    [],
  )
  const primaryFacadeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: threePalette.paper, roughness: 0.8, metalness: 0 }),
    [],
  )
  const secondaryFacadeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: threePalette.charcoal,
        roughness: 0.85,
        metalness: 0,
      }),
    [],
  )
  const slabMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: threePalette.stone, roughness: 0.9, metalness: 0 }),
    [],
  )
  const groundMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color: threePalette.paper, roughness: 0.95, metalness: 0 }),
    [],
  )

  const columnPositions: [number, number][] = []
  for (const x of COLUMN_X) {
    for (const z of COLUMN_Z) {
      columnPositions.push([x, z])
    }
  }

  // Windows: lower block (3 floors) + upper block (1 floor), front (+Z)
  // and right (+X) faces of each block's own footprint.
  type WindowSpec = { x: number; y: number; z: number; face: 'front' | 'right' }
  const windowSpecs: WindowSpec[] = []
  for (let floor = 0; floor < LOWER_FLOOR_COUNT; floor += 1) {
    const y = FLOOR_HEIGHT * (floor + 0.55)
    windowSpecs.push({ x: -1.0, y, z: HALF_Z + WINDOW_OFFSET, face: 'front' })
    windowSpecs.push({ x: 1.0, y, z: HALF_Z + WINDOW_OFFSET, face: 'front' })
    windowSpecs.push({ x: HALF_X + WINDOW_OFFSET, y, z: -0.7, face: 'right' })
    windowSpecs.push({ x: HALF_X + WINDOW_OFFSET, y, z: 0.7, face: 'right' })
  }
  {
    const y = LOWER_HEIGHT + FLOOR_HEIGHT * 0.55
    windowSpecs.push({ x: UPPER_OFFSET_X, y, z: UPPER_HALF_Z + WINDOW_OFFSET, face: 'front' })
    windowSpecs.push({
      x: UPPER_OFFSET_X + UPPER_HALF_X + WINDOW_OFFSET,
      y,
      z: 0,
      face: 'right',
    })
  }

  useFrame(() => {
    const progress = clamp01(progressRef.current?.value ?? 0)

    // --- Camera: restrained interpolation across 7 progress-anchored
    // stops matching the construction stages ---
    const camera = cameraRef.current
    if (camera) {
      const { position, fov } = sampleCamera(progress)
      camera.position.set(...position)
      camera.lookAt(...cameraLookAt)
      if (camera.fov !== fov) {
        camera.fov = fov
        camera.updateProjectionMatrix()
      }
    }

    // --- PLAN (0–0.15): site-plan grid, emphasized early, settles to a
    // faint ambient ground reference for the remainder of the story ---
    const grid = gridRef.current
    if (grid) {
      const material = grid.material as THREE.LineBasicMaterial
      material.transparent = true
      material.opacity = progress < 0.12 ? 1 : remap(progress, 0.12, 0.22, 1, 0.16)
    }

    // --- FOUNDATION (0.15–0.30): two-tier stepped footing + plinth,
    // grown via scale only — material stays fully opaque throughout ---
    const foundationGroup = foundationGroupRef.current
    if (foundationGroup) {
      const t = remap(progress, 0.14, 0.3, 0, 1)
      const s = Math.max(t, 0.001)
      foundationGroup.children.forEach((child) => {
        ;(child as THREE.Mesh).scale.y = s
      })
    }

    // --- STRUCTURE (0.30–0.50): columns rise, staggered, growing from
    // the ground up ---
    const columnsGroup = columnsGroupRef.current
    if (columnsGroup) {
      const children = columnsGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.28 + (index / children.length) * 0.12
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        const s = Math.max(t, 0.001)
        mesh.scale.y = s
        mesh.position.y = (FULL_HEIGHT * s) / 2
      })
    }

    // --- STRUCTURE: beams connect the column tops, level by level,
    // extending outward from their own center ---
    const beamsGroup = beamsGroupRef.current
    if (beamsGroup) {
      const children = beamsGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const levelIndex = Math.floor(index / 4)
        const orientation = index % 4
        const start = 0.38 + (levelIndex / BEAM_LEVELS.length) * 0.14
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        const s = Math.max(t, 0.001)
        if (orientation === 0 || orientation === 1) {
          mesh.scale.x = s
        } else {
          mesh.scale.z = s
        }
      })
    }

    // --- FLOORS (0.50–0.65): slabs fade in level by level ---
    const floorsGroup = floorsGroupRef.current
    if (floorsGroup) {
      const children = floorsGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.48 + (index / children.length) * 0.14
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        mesh.scale.setScalar(Math.max(0.001, t))
      })
    }

    // --- FACADE (0.65–0.85): enclosing wall shell, both blocks ---
    const facadeGroup = facadeGroupRef.current
    if (facadeGroup) {
      const children = facadeGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.62 + (index / children.length) * 0.1
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        const s = Math.max(t, 0.001)
        mesh.scale.y = s
        const baseY = (mesh.userData.baseY as number) ?? 0
        const panelHeight = (mesh.userData.panelHeight as number) ?? 1
        mesh.position.y = baseY + (panelHeight * s) / 2
      })
    }

    // --- FACADE: window openings ---
    const windowsGroup = windowsGroupRef.current
    if (windowsGroup) {
      const children = windowsGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.7 + (index / children.length) * 0.1
        const end = start + 0.06
        const t = remap(progress, start, end, 0, 1)
        mesh.scale.setScalar(Math.max(0.001, t))
      })
    }

    // --- FACADE: entrance volume ---
    const entrance = entranceRef.current
    if (entrance) {
      const t = remap(progress, 0.72, 0.8, 0, 1)
      entrance.scale.y = Math.max(t, 0.001)
    }

    // --- FACADE: balconies ---
    const balconiesGroup = balconiesGroupRef.current
    if (balconiesGroup) {
      const children = balconiesGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.76 + (index / children.length) * 0.06
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        mesh.scale.z = Math.max(t, 0.001)
      })
    }

    // --- FACADE: vertical fins ---
    const finsGroup = finsGroupRef.current
    if (finsGroup) {
      const children = finsGroup.children
      children.forEach((child, index) => {
        const mesh = child as THREE.Mesh
        const start = 0.78 + (index / children.length) * 0.08
        const end = start + 0.08
        const t = remap(progress, start, end, 0, 1)
        mesh.scale.y = Math.max(t, 0.001)
      })
    }

    // --- PLACE (0.85–1.00): parapet rim ---
    const parapetGroup = parapetGroupRef.current
    if (parapetGroup) {
      const t = remap(progress, 0.85, 0.95, 0, 1)
      parapetGroup.children.forEach((child) => {
        ;(child as THREE.Mesh).scale.y = Math.max(t, 0.001)
      })
    }

    // --- PLACE: ground plane — breaks up the void around the building
    // and gives the final composition a sense of site ---
    const ground = groundRef.current
    if (ground) {
      const t = remap(progress, 0.85, 0.95, 0, 1)
      ground.scale.setScalar(Math.max(t, 0.001))
    }

    // --- PLACE: entrance path. This mesh is rotated flat
    // (rotation={[-Math.PI/2,0,0]}), so its geometry's local Y axis (the
    // "length" dimension of the PlaneGeometry) is what maps to world Z
    // after rotation — the mesh's own `scale.y` is what must animate,
    // not `scale.z` (rotation is applied around the already-scaled local
    // axes, so `scale` always refers to the geometry's own local frame,
    // never the world frame the rotation produces). ---
    const entrancePath = entrancePathRef.current
    if (entrancePath) {
      const t = remap(progress, 0.9, 1, 0, 1)
      entrancePath.scale.y = Math.max(t, 0.001)
    }
  })

  return (
    <>
      <color attach="background" args={[threePalette.charcoal]} />
      <fog attach="fog" args={[threePalette.charcoal, 12, 22]} />

      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 8.6, 1.0]}
        fov={38}
        near={0.1}
        far={40}
      />

      <hemisphereLight args={[threePalette.paper, threePalette.charcoal, 0.95]} />
      <directionalLight position={[5, 7, 3]} intensity={1.25} color={0xfff3e6} castShadow={false} />

      {/* PLAN — a flat site-plan grid */}
      <gridHelper
        ref={gridRef}
        args={[Math.max(HALF_X, HALF_Z) * 2.6, 12, threePalette.paper, threePalette.stone]}
      />

      {/* PLACE — ground plane, revealed last, breaks up the void around
          the building and reads as "site" */}
      <mesh ref={groundRef} position={[0, -0.55, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001}>
        <planeGeometry args={[16, 16]} />
        <primitive object={groundMaterial} attach="material" />
      </mesh>

      {/* FOUNDATION — stepped footing + plinth */}
      <group ref={foundationGroupRef}>
        <mesh position={[0, -0.3, 0]}>
          <boxGeometry args={[HALF_X * 2 + 0.7, 0.2, HALF_Z * 2 + 0.7]} />
          <primitive object={structureMaterial} attach="material" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[HALF_X * 2 + 0.3, 0.2, HALF_Z * 2 + 0.3]} />
          <primitive object={structureMaterial} attach="material" />
        </mesh>
      </group>

      {/* STRUCTURE — a 3x3 structural column grid, full height, shared
          geometry/material across all 9 */}
      <group ref={columnsGroupRef}>
        {columnPositions.map(([x, z]) => (
          <mesh
            key={`col-${x}-${z}`}
            position={[x, 0, z]}
            geometry={columnGeometry}
            material={structureMaterial}
          />
        ))}
      </group>

      {/* STRUCTURE — perimeter beam rings connecting the column tops,
          shared geometry/material across all levels */}
      <group ref={beamsGroupRef}>
        {BEAM_LEVELS.map((y) => (
          <group key={`beam-level-${y}`}>
            <mesh
              position={[0, y, BEAM_INSET_Z]}
              geometry={beamGeometryX}
              material={structureMaterial}
            />
            <mesh
              position={[0, y, -BEAM_INSET_Z]}
              geometry={beamGeometryX}
              material={structureMaterial}
            />
            <mesh
              position={[BEAM_INSET_X, y, 0]}
              geometry={beamGeometryZ}
              material={structureMaterial}
            />
            <mesh
              position={[-BEAM_INSET_X, y, 0]}
              geometry={beamGeometryZ}
              material={structureMaterial}
            />
          </group>
        ))}
      </group>

      {/* FLOORS — lower block slabs (3) + the setback top-floor slab */}
      <group ref={floorsGroupRef}>
        {Array.from({ length: LOWER_FLOOR_COUNT }, (_, i) => (
          <mesh key={`floor-${i}`} position={[0, (i + 1) * FLOOR_HEIGHT, 0]}>
            <boxGeometry args={[HALF_X * 2 - 0.15, 0.1, HALF_Z * 2 - 0.15]} />
            <primitive object={slabMaterial} attach="material" />
          </mesh>
        ))}
        <mesh position={[UPPER_OFFSET_X, LOWER_HEIGHT + FLOOR_HEIGHT, 0]}>
          <boxGeometry args={[UPPER_HALF_X * 2 - 0.15, 0.1, UPPER_HALF_Z * 2 - 0.15]} />
          <primitive object={slabMaterial} attach="material" />
        </mesh>
      </group>

      {/* FACADE — enclosing wall shell for both blocks. Front (+Z) and
          right (+X) are the primary, camera-facing faces (warm light
          neutral); back (-Z) and left (-X) are secondary faces the final
          3/4 camera never actually sees, so a darker charcoal tone here
          costs nothing — unlike the freestanding structural frame above,
          which must read clearly against the charcoal background and
          uses the high-contrast stone material instead. Each panel
          carries its own base Y / height in userData so useFrame can grow
          it upward from its own block's floor line. */}
      <group ref={facadeGroupRef}>
        {[LOWER_BLOCK, UPPER_BLOCK].flatMap((block, blockIndex) => {
          const panelHeight = block.height
          const baseY = block.baseY
          return [
            <mesh
              key={`facade-${blockIndex}-front`}
              position={[block.offsetX, baseY, block.halfZ]}
              userData={{ baseY, panelHeight }}
            >
              <boxGeometry args={[block.halfX * 2 + WALL_THICKNESS, panelHeight, WALL_THICKNESS]} />
              <primitive object={primaryFacadeMaterial} attach="material" />
            </mesh>,
            <mesh
              key={`facade-${blockIndex}-back`}
              position={[block.offsetX, baseY, -block.halfZ]}
              userData={{ baseY, panelHeight }}
            >
              <boxGeometry args={[block.halfX * 2 + WALL_THICKNESS, panelHeight, WALL_THICKNESS]} />
              <primitive object={secondaryFacadeMaterial} attach="material" />
            </mesh>,
            <mesh
              key={`facade-${blockIndex}-right`}
              position={[block.offsetX + block.halfX, baseY, 0]}
              userData={{ baseY, panelHeight }}
            >
              <boxGeometry args={[WALL_THICKNESS, panelHeight, block.halfZ * 2 + WALL_THICKNESS]} />
              <primitive object={primaryFacadeMaterial} attach="material" />
            </mesh>,
            <mesh
              key={`facade-${blockIndex}-left`}
              position={[block.offsetX - block.halfX, baseY, 0]}
              userData={{ baseY, panelHeight }}
            >
              <boxGeometry args={[WALL_THICKNESS, panelHeight, block.halfZ * 2 + WALL_THICKNESS]} />
              <primitive object={secondaryFacadeMaterial} attach="material" />
            </mesh>,
          ]
        })}
      </group>

      {/* FACADE — window openings, shared geometry/material across all */}
      <group ref={windowsGroupRef}>
        {windowSpecs.map((spec, i) => (
          <mesh
            key={`window-${i}`}
            position={[spec.x, spec.y, spec.z]}
            rotation={[0, spec.face === 'front' ? 0 : Math.PI / 2, 0]}
            geometry={windowGeometry}
            material={glassMaterial}
            scale={0.001}
          />
        ))}
      </group>

      {/* FACADE — entrance volume, ground floor, projecting forward */}
      <mesh
        ref={entranceRef}
        position={[-0.6, 0.65, HALF_Z + WALL_THICKNESS / 2 + 0.4]}
        material={accentMaterial}
      >
        <boxGeometry args={[1.3, 1.3, 0.8]} />
      </mesh>

      {/* FACADE — balconies on the two middle lower floors */}
      <group ref={balconiesGroupRef}>
        {BALCONY_FLOOR_INDICES.map((floorIndex) => (
          <mesh
            key={`balcony-${floorIndex}`}
            position={[0.6, floorIndex * FLOOR_HEIGHT + 0.05, HALF_Z + WALL_THICKNESS / 2 + 0.35]}
            material={slabMaterial}
          >
            <boxGeometry args={[1.5, 0.08, 0.7]} />
          </mesh>
        ))}
      </group>

      {/* FACADE — vertical fins, shared geometry/material, offset around
          the entrance */}
      <group ref={finsGroupRef}>
        {FIN_X_POSITIONS.map((x) => (
          <mesh
            key={`fin-${x}`}
            position={[x, LOWER_HEIGHT * 0.55, HALF_Z + WALL_THICKNESS / 2 + 0.1]}
            geometry={finGeometry}
            material={accentMaterial}
          />
        ))}
      </group>

      {/* PLACE — a parapet rim around the setback top floor's roofline */}
      <group ref={parapetGroupRef}>
        <mesh
          position={[UPPER_OFFSET_X, FULL_HEIGHT + 0.15, UPPER_HALF_Z]}
          material={structureMaterial}
        >
          <boxGeometry args={[UPPER_HALF_X * 2 + WALL_THICKNESS, 0.28, 0.1]} />
        </mesh>
        <mesh
          position={[UPPER_OFFSET_X, FULL_HEIGHT + 0.15, -UPPER_HALF_Z]}
          material={structureMaterial}
        >
          <boxGeometry args={[UPPER_HALF_X * 2 + WALL_THICKNESS, 0.28, 0.1]} />
        </mesh>
        <mesh
          position={[UPPER_OFFSET_X + UPPER_HALF_X, FULL_HEIGHT + 0.15, 0]}
          material={structureMaterial}
        >
          <boxGeometry args={[0.1, 0.28, UPPER_HALF_Z * 2 + WALL_THICKNESS]} />
        </mesh>
        <mesh
          position={[UPPER_OFFSET_X - UPPER_HALF_X, FULL_HEIGHT + 0.15, 0]}
          material={structureMaterial}
        >
          <boxGeometry args={[0.1, 0.28, UPPER_HALF_Z * 2 + WALL_THICKNESS]} />
        </mesh>
      </group>

      {/* PLACE — a short entrance path, the scene's one restrained
          landscaping touch */}
      <mesh
        ref={entrancePathRef}
        position={[-0.6, -0.44, HALF_Z + 1.6]}
        rotation={[-Math.PI / 2, 0, 0]}
        material={accentMaterial}
        scale={[1, 0.001, 1]}
      >
        <planeGeometry args={[1.1, 2.4]} />
      </mesh>
    </>
  )
}
