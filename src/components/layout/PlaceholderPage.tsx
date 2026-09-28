type PlaceholderPageProps = {
  title: string
  milestone: string
}

/** Clearly-marked development placeholder. Must not ship to production. */
export function PlaceholderPage({ title, milestone }: PlaceholderPageProps) {
  return (
    <section>
      <h1>{title}</h1>
      <p data-dev-placeholder>Development placeholder — content is built in {milestone}.</p>
    </section>
  )
}
