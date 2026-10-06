import type { ComponentType } from 'react'
import { wayResolveAt, type WayChapterVisual, type WayMotif } from '../../../data/visakramWay'
import { QualityOverlay, QualityPlate } from './QualityStudy'
import { TimelinessOverlay, TimelinessPlate } from './TimelinessBuild'
import { TransparencyOverlay, TransparencyPlate } from './TransparencyExploded'
import { reveal } from './wayLinework'
import styles from './WayVisual.module.css'

/**
 * Each chapter is two layers drawn in the same 1200 × 800 frame:
 *  - a rendered plate — shaded, textured, lit architecture (web-native SVG),
 *  - a gold technical overlay — dimensions, callouts, datum, construction lines.
 * Both mark their artwork with `reveal()` attributes that the scroll hook
 * (useVisakramWayScrub) turns into one scrubbed timeline. The plate is the
 * part a real photograph, render or video replaces (`asset`); the overlay
 * stays on top. Illustrative only — not a depiction of a Visakram project.
 */
const motifs: Record<WayMotif, { Plate: ComponentType; Overlay: ComponentType }> = {
  quality: { Plate: QualityPlate, Overlay: QualityOverlay },
  timeliness: { Plate: TimelinessPlate, Overlay: TimelinessOverlay },
  transparency: { Plate: TransparencyPlate, Overlay: TransparencyOverlay },
}

/**
 * One chapter's visual layer. `data-way-media` is what the scroll timeline
 * scales/drifts (the "crop movement"). The `glow` is the chapter's final-light
 * beat, revealed by the same timeline; `grain` is a static film-grain tooth.
 * Stage captions are NOT drawn here — one active row lives in the section, so
 * two chapters' stage rows can never be visible together.
 */
export function WayVisual({ visual }: { visual: WayChapterVisual }) {
  const { asset, motif } = visual
  const { Plate, Overlay } = motifs[motif]
  return (
    <div className={`${styles.layer} ${styles[motif]}`} data-way-layer>
      <div className={styles.media} data-way-media>
        {asset?.kind === 'image' ? (
          <img className={styles.asset} src={asset.src} alt="" loading="lazy" decoding="async" />
        ) : asset?.kind === 'video' ? (
          <video className={styles.asset} src={asset.src} muted loop playsInline autoPlay />
        ) : (
          <Plate />
        )}
        <Overlay />
      </div>
      <div className={styles.glow} {...reveal(wayResolveAt, 0.1)} />
      <div className={styles.grain} />
    </div>
  )
}
