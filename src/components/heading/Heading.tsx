import { Children, Fragment, useRef, type HTMLAttributes, type ReactNode } from 'react'
import { useReplayOnView } from '../../hooks/useReplayOnView'
import styles from './Heading.module.css'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
}

/** The heading's text, if it is plain text (strings and numbers only); otherwise null. */
function plainText(children: ReactNode): string | null {
  let text = ''
  for (const child of Children.toArray(children)) {
    if (typeof child === 'string' || typeof child === 'number') text += child
    else return null
  }
  return text
}

/** Total time a long heading may spend starting its words, so it never drags on. */
const MAX_STAGGER_S = 1.4
const STEP_S = 0.28

/**
 * Every section and page heading on the site. Its words drop in from above, slowly, one after another,
 * each time the heading comes into view: data-drop is set once most of it is on screen and cleared
 * only when it is completely out of sight (so nothing is seen to snap back, and the drop replays on
 * the next visit). Written straight to the element, no React state. The drop, its distance, easing and
 * duration are the same for every heading (Heading.module.css); only the gap between words shrinks for
 * a long heading. Under reduced motion the heading is simply there. The spaces between the words stay
 * real text, so the heading's accessible name is unchanged.
 */
export function Heading({ as: Tag = 'h2', children, className, ...rest }: HeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  useReplayOnView(ref, 'drop')

  const text = plainText(children)
  const words = text === null ? null : text.split(/\s+/).filter(Boolean)
  const step = words ? Math.min(STEP_S, MAX_STAGGER_S / Math.max(1, words.length - 1)) : STEP_S

  return (
    <Tag
      ref={ref}
      {...rest}
      className={className ? `${styles.heading} ${className}` : styles.heading}
      style={{ ...rest.style, ['--step' as string]: `${step}s` }}
    >
      {words
        ? words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 ? ' ' : null}
              <span className={styles.word} style={{ ['--w' as string]: String(i) }}>
                {word}
              </span>
            </Fragment>
          ))
        : children}
    </Tag>
  )
}
