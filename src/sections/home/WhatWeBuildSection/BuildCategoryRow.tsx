import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { DevImagePlaceholder } from '../../../components/media/DevImagePlaceholder'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import type { BuildCategory } from '../../../data/buildCategories'
import styles from './WhatWeBuildSection.module.css'

type BuildCategoryRowProps = {
  category: BuildCategory
  align: 'start' | 'end'
}

/**
 * One category row. Its own component (not inlined in a `.map()`) because
 * it needs its own `useRevealOnScroll` ref — see docs/ANIMATION-SYSTEM.md
 * §9 Pattern 1. The whole row is a single link to the (still placeholder)
 * services page; nothing here claims project counts or specific work.
 */
export function BuildCategoryRow({ category, align }: BuildCategoryRowProps) {
  const revealRef = useRef<HTMLLIElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <li ref={revealRef} className={styles.row} data-align={align}>
      <Link
        to="/services"
        className={styles.link}
        aria-label={`${category.title} — explore our services`}
      >
        <div className={styles.image}>
          <div className={styles.imageInner}>
            <DevImagePlaceholder label={category.title} />
          </div>
        </div>
        <div className={styles.text}>
          <span className={`text-mono-label ${styles.index}`}>{category.index}</span>
          <h3 className={styles.title}>{category.title}</h3>
          <p className={styles.description}>{category.description}</p>
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </div>
      </Link>
    </li>
  )
}
