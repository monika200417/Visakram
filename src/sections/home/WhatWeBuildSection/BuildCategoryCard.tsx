import { Link } from 'react-router-dom'
import { LoopVideo } from '../../../components/media/LoopVideo'
import { MediaImage } from '../../../components/media/MediaImage'
import type { HomeSegment } from '../../../data/homeSegments'
import styles from './WhatWeBuildSection.module.css'

type BuildCategoryCardProps = {
  segment: HomeSegment
}

/**
 * One segment card in the What We Build carousel: the segment's name and its tagline over its video
 * or picture. The whole card is a single link to the services page; nothing here claims project
 * counts or specific work. Content comes from src/data/homeSegments.ts. A segment with neither a
 * video nor a picture falls back to a blank, loading-state field rather than a fake picture.
 */
export function BuildCategoryCard({ segment }: BuildCategoryCardProps) {
  return (
    <li className={styles.card}>
      <Link
        to="/services"
        className={styles.link}
        aria-label={`${segment.title}, ${segment.tagline} — explore our services`}
      >
        <div className={styles.image}>
          <div className={styles.imageInner} data-media={segment.video ? 'video' : 'image'}>
            {segment.video ? (
              <LoopVideo
                src={segment.video.src}
                poster={segment.video.poster}
                alt={segment.video.alt}
              />
            ) : segment.image ? (
              <MediaImage src={segment.image.src} alt={segment.image.alt} />
            ) : null}
          </div>
          <span className={`text-mono-label ${styles.index}`}>{segment.index}</span>
        </div>
        <div className={styles.text}>
          <h3 className={styles.title}>{segment.title}</h3>
          <p className={styles.description}>{segment.tagline}</p>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </li>
  )
}
