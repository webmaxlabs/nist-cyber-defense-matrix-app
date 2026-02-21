import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://cyberdefensematrix.ai'

  return [
    {
      url: baseUrl,
      lastModified: '2026-02-21',
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: '2026-02-21',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: '2026-02-21',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: '2026-02-21',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
