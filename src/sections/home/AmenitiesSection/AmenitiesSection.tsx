import { useRef } from 'react'
import { Container } from '../../../components/layout/Container'
import { Heading } from '../../../components/heading/Heading'
import { useRevealOnScroll } from '../../../animations/useRevealOnScroll'
import { amenities } from '../../../data/amenities'
import { AmenityIcon } from './AmenityIcon'
import styles from './AmenitiesSection.module.css'

/**
 * Amenities — the client-supplied list (src/data/amenities.ts) as a grid of tiles, each a line icon
 * over the amenity's name, on its own picture: the picture is faint until the tile is hovered, then clear. It follows What We Build on the homepage. Names only: nothing about
 * counts, brands or specifications is claimed.
 */
export function AmenitiesSection() {
  const revealRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(revealRef, { y: 32 })

  return (
    <section id="amenities" className={styles.section} aria-labelledby="amenities-heading">
      <Container>
        <div ref={revealRef} className={styles.inner}>
          <Heading as="h2" id="amenities-heading" className={styles.heading}>
            Amenities.
          </Heading>

          <ul className={styles.grid}>
            {amenities.map((amenity) => (
              <li key={amenity.slug} className={styles.tile}>
                <img
                  className={styles.photo}
                  src={amenity.image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <span className={styles.icon}>
                  <AmenityIcon slug={amenity.slug} />
                </span>
                <span className={styles.name}>{amenity.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
