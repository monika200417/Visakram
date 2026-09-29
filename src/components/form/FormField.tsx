import type { ReactNode } from 'react'
import styles from './FormField.module.css'

type FormFieldProps = {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

/**
 * Accessible label + control + error wrapper reused by every field in
 * ContactForm (docs/DESIGN-SYSTEM.md §16, milestone accessibility
 * requirements). The label always has a real `htmlFor` — never
 * placeholder-as-label. The caller's input/select/textarea is passed in
 * as `children` and is responsible for setting `id`, `aria-invalid` and
 * `aria-describedby` (pointing at `${id}-hint` and/or `${id}-error` as
 * applicable) itself, since only the caller knows which attributes its
 * own control needs.
 */
export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  const classes = [styles.field, className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className={styles.optional}> (optional)</span>
        )}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${id}-hint`} className={styles.hint}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
