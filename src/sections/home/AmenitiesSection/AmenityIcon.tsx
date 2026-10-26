/** A simple line icon for each amenity (decorative: the name is always beside it as text). */
const paths: Record<string, string[]> = {
  lift: [
    'M5 3h14v18H5z',
    'M12 3v18',
    'M8.5 10.5V7M7 8.5 8.5 7 10 8.5',
    'M15.5 13.5V17M14 15.5l1.5 1.5 1.5-1.5',
  ],
  'car-parking': [
    'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z',
    'M9.5 17V7h3.5a3 3 0 0 1 0 6H9.5',
  ],
  generator: [
    'M5 7h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
    'M13 9l-3 3.5h4L11 16',
    'M6 17v3M18 17v3',
  ],
  cctv: ['M3 5h13v7H3z', 'M16 8l5-2v8l-5-2', 'M9.5 12v4M6 20h7M9.5 16v4'],
  'ev-charging': ['M9 3v4M15 3v4', 'M7 7h10v4a5 5 0 0 1-10 0z', 'M12 16v5'],
  'security-guard-room': ['M4 21V10l8-6 8 6v11', 'M2 21h20', 'M9.5 21v-7h5v7'],
}

export function AmenityIcon({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {(paths[slug] ?? []).map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
