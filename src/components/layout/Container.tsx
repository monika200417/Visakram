import {
  createElement,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

type ContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/**
 * Centered max-width wrapper with responsive page padding (DESIGN-SYSTEM.md §5).
 * Built with `createElement` rather than a JSX `<Tag>` — with
 * @react-three/fiber's global `JSX.IntrinsicElements` augmentation now in
 * the program (Milestone 10), TS's JSX resolution for a runtime-determined
 * generic tag collapses its `children` prop to `never`. `createElement` is
 * a plain generic function call, not JSX tag resolution, so it isn't
 * affected — this is a type-level change only; behavior is unchanged and
 * callers still get full typing via `ContainerProps<T>`.
 */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  return createElement(
    as ?? 'div',
    { className: ['container', className].filter(Boolean).join(' '), ...rest },
    children,
  )
}
