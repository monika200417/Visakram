import { Canvas } from '@react-three/fiber'
import { BuildingScene, type ProgressRef } from './BuildingScene'

type PlanToPlaceCanvasProps = {
  progressRef: ProgressRef
  /** Toggles the R3F render loop off entirely while the section is far
   *  outside the viewport (Milestone 10 §15 — "avoid unnecessary
   *  animation work", "pause 3D rendering when offscreen"). */
  isVisible: boolean
}

/**
 * The dynamically-imported entry point for the From Plan to Place 3D
 * chapter (default export so it can be the target of React.lazy — see
 * FromPlanToPlaceSection.tsx). Every Three.js/R3F/drei import used by
 * this chapter is reachable only from here, so none of it enters the
 * homepage's initial bundle (Milestone 10 §14, docs/PERFORMANCE-BUDGET.md
 * §6 "3D must be lazy-loaded, code-split").
 */
export default function PlanToPlaceCanvas({ progressRef, isVisible }: PlanToPlaceCanvasProps) {
  return (
    <Canvas
      frameloop={isVisible ? 'always' : 'never'}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false }}
      camera={{ position: [0, 8.6, 1.0], fov: 38, near: 0.1, far: 40 }}
    >
      <BuildingScene progressRef={progressRef} />
    </Canvas>
  )
}
