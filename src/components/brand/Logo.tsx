import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

const LOGO_SRC = {
  dark: '/assets/brand/visakram-logo-dark.svg',
  light: '/assets/brand/visakram-logo-light.svg',
} as const

type LogoProps = {
  /** 'dark' = dark mark for light backgrounds. 'light' = light/gold mark for dark backgrounds. */
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * Client-supplied brand mark (see brand-source/README.md for provenance).
 * Referenced from public/ by URL, never re-imported as a module, never
 * recreated in CSS, never rasterized — the SVG files are used as-is.
 */
export function Logo({ variant = 'dark', className }: LogoProps) {
  return (
    <Link
      to="/"
      className={[styles.logo, className].filter(Boolean).join(' ')}
      aria-label="Visakram Builders — home"
    >
      <img src={LOGO_SRC[variant]} alt="Visakram Builders" width={1323} height={672} />
    </Link>
  )
}
