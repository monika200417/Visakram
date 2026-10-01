import {
  createElement,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

type GridProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/**
 * 4 / 8 / 12 column responsive grid (DESIGN-SYSTEM.md §5). See
 * Container.tsx for why this uses `createElement` instead of a JSX `<Tag>`.
 */
export function Grid<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: GridProps<T>) {
  return createElement(
    as ?? 'div',
    { className: ['grid', className].filter(Boolean).join(' '), ...rest },
    children,
  )
}
