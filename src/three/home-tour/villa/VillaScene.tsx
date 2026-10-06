import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { smoothstep } from '../pathMath'
import { doorOpen, glassOpen } from './choreography'
import { regionAt, type Mat, type Region, type ZoneId } from './layout'
import { FRONT_DOOR, SUITE_SLIDER } from './plan'
import { mergedZones, PANE, useVillaResources } from './resources'
import { HORIZON_COLOR } from './surroundings'
import { villaTour as tour } from './tour'

export type ProgressRef = RefObject<{ value: number }>

/**
 * Zones that cannot be seen from a given part of the villa, and so are not
 * drawn there. Nothing is mounted or unmounted during the journey — only
 * `visible` is toggled, and only on things hidden behind the first-floor slab
 * or the walls — so there is no visible pop-in. From outside, and from the
 * double-height core, everything is drawn.
 */
const hiddenIn: Record<Region, readonly ZoneId[]> = {
  exterior: [],
  core: [],
  ground: ['gallery', 'suite', 'terraceUp'],
  upper: ['living', 'dining', 'kitchen'],
}

/** Closed and open centres (x) of the suite's two sliding panes, one on each track. */
const PANE_A = { closed: SUITE_SLIDER.x[0] + PANE.width / 2, travel: -PANE.width, z: 0.1 }
const PANE_B = { closed: SUITE_SLIDER.x[1] - PANE.width / 2, travel: PANE.width, z: -0.1 }

/**
 * ONE villa, ONE camera. Everything responds to a single normalized progress
 * value (`progressRef`, written by the scrubbed GSAP timeline in
 * useHomeTourScrub): the camera pose is sampled from the predetermined path,
 * and the front door, the suite's sliding glass, the indoor fill light and zone
 * visibility all read the same value inside useFrame. No React state changes
 * while scrolling.
 */
export function VillaScene({ progressRef }: { progressRef: ProgressRef }) {
  const resources = useVillaResources()
  const m = resources.materials

  const zoneGroups = useRef<Partial<Record<ZoneId, THREE.Group | null>>>({})
  const lastRegion = useRef<Region | null>(null)
  const door = useRef<THREE.Group>(null)
  const paneA = useRef<THREE.Group>(null)
  const paneB = useRef<THREE.Group>(null)
  const fill = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera
    const p = progressRef.current.value
    const sample = tour.sample(p)
    camera.position.set(sample.position[0], sample.position[1], sample.position[2])
    camera.lookAt(sample.lookAt[0], sample.lookAt[1], sample.lookAt[2])
    if (Math.abs(camera.fov - sample.fov) > 1e-3) {
      camera.fov = sample.fov
      camera.updateProjectionMatrix()
    }

    const [x, y, z] = sample.position
    const region = regionAt(x, y, z)
    if (region !== lastRegion.current) {
      lastRegion.current = region
      for (const zone of mergedZones) {
        const group = zoneGroups.current[zone]
        if (group) group.visible = !hiddenIn[region].includes(zone)
      }
    }

    // A soft warm fill that travels with the camera once it is inside the house
    if (fill.current) {
      const inside = x > -0.5 && x < 24.5 ? smoothstep((z + 0.4) / 1.4) : 0
      fill.current.intensity = 14 * inside
      fill.current.position.set(x, y + 0.4, z)
    }

    if (door.current) door.current.rotation.y = -doorOpen(p) * Math.PI * 0.5
    const slide = glassOpen(p)
    if (paneA.current) paneA.current.position.x = PANE_A.closed + PANE_A.travel * slide
    if (paneB.current) paneB.current.position.x = PANE_B.closed + PANE_B.travel * slide

    if (import.meta.env.DEV) {
      // Dev-only: lets QA read the per-frame render cost against the budget.
      const { render, memory } = state.gl.info
      ;(window as unknown as { __homeTourStats?: unknown }).__homeTourStats = {
        calls: render.calls,
        triangles: render.triangles,
        geometries: memory.geometries,
        textures: memory.textures,
      }
    }
  })

  return (
    <>
      <color attach="background" args={[HORIZON_COLOR]} />
      <fogExp2 attach="fog" args={[HORIZON_COLOR, 0.0032]} />

      {/* Lights: a fixed count, no shadow maps. Final lighting is a later phase. */}
      <hemisphereLight args={[0xdbe7f2, 0x9a8a74, 1.5]} />
      <directionalLight color={0xffe3c0} intensity={2.4} position={[-40, 28, -35]} />
      <pointLight ref={fill} color={0xffe9cf} intensity={0} distance={12} decay={2} />

      {/* Surroundings */}
      <mesh geometry={resources.sky} material={m.sky} renderOrder={-10} frustumCulled={false} />
      <mesh geometry={resources.terrain} material={m.ground} frustumCulled={false} />
      <mesh geometry={resources.sea} material={m.sea} frustumCulled={false} />

      {/* The villa: merged boxes, one mesh per zone and material */}
      {mergedZones.map((zone) => (
        <group
          key={zone}
          ref={(node) => {
            zoneGroups.current[zone] = node
          }}
        >
          {(Object.entries(resources.zones[zone]) as Array<[Mat, THREE.BufferGeometry]>).map(
            ([mat, geometry]) => (
              <mesh key={mat} geometry={geometry} material={m[mat]} />
            ),
          )}
        </group>
      ))}

      {/* The front door: a tall timber leaf hinged at the left jamb, opening inward */}
      <group ref={door} position={[FRONT_DOOR.x[0] + 0.02, 0.6, 0]}>
        <mesh geometry={resources.doorLeaf} material={m.timber} />
        <mesh geometry={resources.doorHandle} material={m.metal} />
      </group>

      {/* The suite's sliding glass: two panes that part to either side */}
      {(
        [
          { ref: paneA, spec: PANE_A },
          { ref: paneB, spec: PANE_B },
        ] as const
      ).map(({ ref, spec }) => (
        <group key={spec.z} ref={ref} position={[spec.closed, PANE.centreY, spec.z]}>
          <mesh geometry={resources.paneGlass} material={m.glass} />
          <mesh geometry={resources.paneFrame} material={m.metal} />
        </group>
      ))}
    </>
  )
}
