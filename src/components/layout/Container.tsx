import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type ContainerProps<T extends ElementType> = {
  as?: T
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/** Centered max-width wrapper with responsive page padding (DESIGN-SYSTEM.md §5). */
export function Container<T extends ElementType = 'div'>({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Tag = as ?? 'div'
  return (
    <Tag className={['container', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
