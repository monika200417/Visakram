import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type GridProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/** 4 / 8 / 12 column responsive grid (DESIGN-SYSTEM.md §5). */
export function Grid<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: GridProps<T>) {
  const Tag = as ?? 'div'
  return (
    <Tag className={['grid', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
