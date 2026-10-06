import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { boxGeometry, mergeZone, type ZoneGeometries } from '../geometry'
import { parts, type Mat, type ZoneId } from './layout'
import { CEIL1, FL1 } from './plan'
import { createSeaGeometry, createSkyGeometry, createTerrainGeometry } from './surroundings'

export const mergedZones: readonly ZoneId[] = [
  'site',
  'shell',
  'foyer',
  'stair',
  'living',
  'dining',
  'kitchen',
  'gallery',
  'suite',
  'terraceUp',
]

/** The sliding panes of the suite: glass and a black aluminium frame, sized to its opening. */
export const PANE = {
  width: 2.55,
  height: CEIL1 - FL1 - 0.14,
  centreY: FL1 + 0.04 + (CEIL1 - FL1 - 0.14) / 2,
}

export type VillaResources = {
  materials: Record<Mat, THREE.Material> & {
    ground: THREE.MeshStandardMaterial
    sea: THREE.MeshStandardMaterial
    sky: THREE.MeshBasicMaterial
  }
  zones: Record<ZoneId, ZoneGeometries>
  terrain: THREE.BufferGeometry
  sea: THREE.BufferGeometry
  sky: THREE.BufferGeometry
  paneGlass: THREE.BufferGeometry
  paneFrame: THREE.BufferGeometry
  doorLeaf: THREE.BufferGeometry
  doorHandle: THREE.BufferGeometry
}

/**
 * Builds — once — every material and merged geometry the villa needs, and
 * disposes all of it when the experience unmounts. Plain colours only: detailed
 * materials arrive in a later phase. Materials are shared across the whole
 * scene, which keeps GPU state small and lets each zone batch.
 */
export function useVillaResources(): VillaResources {
  const resources = useMemo<VillaResources>(() => {
    const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p)
    const materials = {
      stone: std({ color: 0x57514a, roughness: 0.88 }),
      plaster: std({ color: 0xdcd6ca, roughness: 0.95 }),
      concrete: std({ color: 0xa6a299, roughness: 0.92 }),
      timber: std({ color: 0x94653f, roughness: 0.7 }),
      timberDark: std({ color: 0x3a2a1f, roughness: 0.85 }),
      glass: std({
        color: 0xa7bec9,
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      metal: std({ color: 0x0e0f11, roughness: 0.45, metalness: 0.6 }),
      floorStone: std({ color: 0xd2c9b6, roughness: 0.6 }),
      paving: std({ color: 0xb7afa1, roughness: 0.85 }),
      fabric: std({ color: 0xcdc5b6, roughness: 0.96 }),
      fabricDark: std({ color: 0x413b36, roughness: 0.95 }),
      linen: std({ color: 0xeee8dc, roughness: 0.95 }),
      marble: std({ color: 0xe8e5df, roughness: 0.3 }),
      copper: std({ color: 0xb87a4d, roughness: 0.4, metalness: 0.8 }),
      poolLining: std({ color: 0x8fc4c8, roughness: 0.5 }),
      water: std({
        color: 0x62aebc,
        roughness: 0.08,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
      }),
      ground: std({ vertexColors: true, roughness: 1 }),
      sea: std({ color: 0x5c8fa8, roughness: 0.35 }),
      sky: new THREE.MeshBasicMaterial({
        vertexColors: true,
        side: THREE.BackSide,
        fog: false,
        depthWrite: false,
      }),
    } as VillaResources['materials']

    const zones = Object.fromEntries(
      mergedZones.map((zone) => [zone, mergeZone(parts, zone)]),
    ) as VillaResources['zones']

    const t = 0.05
    const frameParts = [
      boxGeometry([0, PANE.height / 2 - t / 2, 0], [PANE.width, t, 0.05]),
      boxGeometry([0, -PANE.height / 2 + t / 2, 0], [PANE.width, t, 0.05]),
      boxGeometry([-PANE.width / 2 + t / 2, 0, 0], [t, PANE.height, 0.05]),
      boxGeometry([PANE.width / 2 - t / 2, 0, 0], [t, PANE.height, 0.05]),
    ]
    const paneFrame = mergeGeometries(frameParts, false)
    frameParts.forEach((g) => g.dispose())

    return {
      materials,
      zones,
      terrain: createTerrainGeometry(),
      sea: createSeaGeometry(),
      sky: createSkyGeometry(),
      paneGlass: boxGeometry([0, 0, 0], [PANE.width, PANE.height, 0.02]),
      paneFrame,
      doorLeaf: boxGeometry([0.68, 1.5, 0], [1.36, 3.0, 0.07]),
      doorHandle: boxGeometry([1.2, 1.1, 0.06], [0.03, 0.9, 0.04]),
    }
  }, [])

  useEffect(
    () => () => {
      for (const material of Object.values(resources.materials)) material.dispose()
      for (const zone of Object.values(resources.zones)) {
        for (const geometry of Object.values(zone)) geometry?.dispose()
      }
      resources.terrain.dispose()
      resources.sea.dispose()
      resources.sky.dispose()
      resources.paneGlass.dispose()
      resources.paneFrame.dispose()
      resources.doorLeaf.dispose()
      resources.doorHandle.dispose()
    },
    [resources],
  )

  return resources
}
