/**
 * Photography for the /services page beyond the three service blocks (those take `image` / `video` from
 * data/services.ts): a wide picture under the process.
 * Stock photographs from Unsplash, free to use under the Unsplash License (credits in
 * public/assets/images/projects-page/README.md, which holds the same files); they are not photographs of
 * Visakram Builders projects. Replace them with approved project photography before launch.
 */
export type ServicesPageImage = {
  src: string
  alt: string
}

export const servicesProcessImage: ServicesPageImage = {
  src: '/assets/images/projects-page/apartments-dusk.webp',
  alt: 'An apartment building with glazed balconies reflecting a soft pink evening sky',
}
