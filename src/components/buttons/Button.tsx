import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary'

type CommonProps = {
  variant?: Variant
  children: ReactNode
  className?: string
}

type AsLink = CommonProps & Omit<LinkProps, 'className' | 'children'> & { href?: never }
type AsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { to?: never }
type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    to?: never
    href?: never
  }

export type ButtonProps = AsLink | AsAnchor | AsButton

/**
 * Restrained architectural CTA (docs/DESIGN-SYSTEM.md §7).
 * Renders a router Link when `to` is given, an <a> when `href` is given,
 * otherwise a native <button> — so the primary CTA is always semantic.
 */
export function Button({ variant = 'primary', className, children, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], className].filter(Boolean).join(' ')

  if ('to' in rest && rest.to !== undefined) {
    const { to, ...linkRest } = rest
    return (
      <Link to={to} className={classes} {...linkRest}>
        {children}
      </Link>
    )
  }

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
