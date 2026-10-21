import type { MetadataRoute } from 'next'

/** Lets players "Add to Home Screen" and open the tracker like an app at the table. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Metro :Otherscape Tracker',
    short_name: ':Otherscape',
    description: 'Character sheets, crew, Challenges and rules help for Metro :Otherscape.',
    start_url: '/campaigns',
    display: 'standalone',
    background_color: '#080c18',
    theme_color: '#080c18',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  }
}
