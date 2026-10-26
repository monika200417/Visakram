/**
 * The amenities shown in the homepage Amenities section, as supplied by the client, each with the
 * picture supplied for its card (public/assets/amenities). Names and pictures only: no descriptions,
 * counts or specifications were given, so none are shown. The pictures are the client's own files;
 * their source and licence are not documented here, and the lift and guard-room ones are small
 * (about 234 and 250 px wide), so they look soft on a wide card.
 */
export type Amenity = {
  slug: string
  name: string
  image: string
}

export const amenities: readonly Amenity[] = [
  { slug: 'lift', name: 'Lift', image: '/assets/amenities/lift.png' },
  { slug: 'car-parking', name: 'Car parking', image: '/assets/amenities/car-parking.png' },
  { slug: 'generator', name: 'Generator', image: '/assets/amenities/generator.png' },
  { slug: 'cctv', name: 'CCTV', image: '/assets/amenities/cctv.png' },
  { slug: 'ev-charging', name: 'EV Charging point', image: '/assets/amenities/ev-charging.png' },
  {
    slug: 'security-guard-room',
    name: 'Security guard room',
    image: '/assets/amenities/security-guard-room.png',
  },
]
