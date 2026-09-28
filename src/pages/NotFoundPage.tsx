import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <p>
        <Link to="/">Return to the homepage</Link>
      </p>
    </section>
  )
}
