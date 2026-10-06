import { Suspense, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { VillaScene, type ProgressRef } from './villa/VillaScene'
import { villaWaypoints } from './villa/tour'

type HomeTourCanvasProps = {
  progressRef: ProgressRef
  /** Receives R3F's `invalidate` so the scrub can request a frame only when progress changes. */
  onReady: (invalidate: (() => void) | null) => void
  /** False while the section is offscreen: the render loop stops entirely. */
  isVisible: boolean
}

/** Hands R3F's invalidate() to the scroll hook so it can request a frame only when progress changes. */
function Bridge({ onReady }: { onReady: (invalidate: (() => void) | null) => void }) {
  const invalidate = useThree((state) => state.invalidate)
  useEffect(() => {
    onReady(invalidate)
    invalidate()
    return () => onReady(null)
  }, [invalidate, onReady])
  return null
}

/**
 * The dynamically-imported entry for the Home Tour (default export so it can
 * be the target of React.lazy — see HomeTourSection.tsx). Every Three.js/R3F
 * import used by this experience is reachable only from here, so none of it
 * enters the homepage's initial bundle. Rendering is demand-driven: a frame
 * is drawn only when scrolling changes the progress, never on an idle page.
 */
export default function HomeTourCanvas({ progressRef, onReady, isVisible }: HomeTourCanvasProps) {
  const start = villaWaypoints[0]!
  return (
    <Canvas
      frameloop={isVisible ? 'demand' : 'never'}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      camera={{
        position: [...start.position],
        fov: start.fov,
        near: 0.15,
        far: 1200,
      }}
    >
      <Suspense fallback={null}>
        <VillaScene progressRef={progressRef} />
        {/* Mounts only once the scene has loaded, so "ready" means the first real frame can draw. */}
        <Bridge onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
