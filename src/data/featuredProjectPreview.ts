/**
 * The Featured Project chapter's PREVIEW content, shown only while `projects`
 * (data/projects.ts) is empty. It exists so the chapter's layout can be reviewed with a
 * realistic spread; it is sample text with a stock photograph (public/assets/home-media/
 * README.md), not a Visakram project, and the chapter says so on the page. Once a real
 * project is approved and added to `projects`, it replaces this automatically.
 */
export const featuredProjectPreview = {
  name: 'The Bayview Enclave',
  location: 'Kommadi, Visakhapatnam',
  category: 'Premium Residential / High-Rise Living',
  image: {
    src: '/assets/home-media/featured-project.jpg',
    alt: 'A contemporary residential building, lit warmly at dusk',
  },
} as const
